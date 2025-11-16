from django.shortcuts import get_object_or_404, render, redirect
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.views.decorators.http import require_POST
from .models import Post, Comment, Like
from .forms import CommentForm

def post_list(request):
    posts = Post.objects.filter(published=True).order_by('-published_at')
    session_key = request.session.session_key or request.session.create() or request.session.session_key

    # Annotate each post with a 'liked' attribute
    for post in posts:
        post.liked = post.likes.filter(session_key=session_key).exists()

    comment_form = CommentForm()
    return render(request, 'blog/post_list.html', {
        'posts': posts,
        'comment_form': comment_form,
    })

def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug, published=True)
    comment_form = CommentForm()
    session_key = request.session.session_key or request.session.create() or request.session.session_key
    liked = post.likes.filter(session_key=session_key).exists()
    return render(request, 'blog/post_detail.html', {
        'post': post,
        'comment_form': comment_form,
        'liked': liked,
    })

@require_POST
def add_comment(request, post_id):
    post = get_object_or_404(Post, id=post_id, published=True)
    form = CommentForm(request.POST)
    if not request.session.session_key:
        request.session.create()
    if form.is_valid():
        comment = form.save(commit=False)
        comment.post = post
        comment.session_key = request.session.session_key
        comment.save()
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'ok': True, 'message': 'Comment submitted'})
        return redirect('blog:post_detail', slug=post.slug)
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({'ok': False, 'errors': form.errors}, status=400)
    return render(request, 'blog/post_detail.html', {'post': post, 'comment_form': form})

@require_POST
def toggle_like(request, post_id):
    post = get_object_or_404(Post, id=post_id, published=True)
    if not request.session.session_key:
        request.session.create()
    session_key = request.session.session_key
    like = post.likes.filter(session_key=session_key).first()
    if like:
        like.delete()
        liked = False
    else:
        Like.objects.create(post=post, session_key=session_key)
        liked = True
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({'ok': True, 'liked': liked, 'likes_count': post.likes.count()})
    return redirect('blog:post_detail', slug=post.slug)