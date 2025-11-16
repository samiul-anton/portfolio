from django.urls import path, include
from . import views
from .views import send_email

urlpatterns = [
    path('', views.home, name='info-home'),
    path('resume', views.resume, name='resume'),
    path('components', views.components, name='components'),
    path('', views.send_email, name='send_email'),
    path('blog/', include('blog.urls')),
]