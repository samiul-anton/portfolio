import os
import smtplib
from email.message import EmailMessage
from django.shortcuts import render
from django.http import HttpResponse
from django.core.mail import send_mail
from django.http import HttpResponseRedirect
from django.urls import reverse

# Create your views here.
EMAIL_ADDRESS = 'antonportfolioemail@gmail.com'#os.environ.get('EMAIL_USER')
EMAIL_PASSWORD = 'okra ueqv uvcd plaj'#os.environ.get('EMAIL_PASS')
def home(request):
    return render(request, 'info/index.html')
def resume(request):
    return render(request, 'info/resume.html')
def components(request):
    return render(request, 'info/components.html')
def send_email(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        receiver = 'antonportfolioemail@gmail.com'
        subject = request.POST.get('name')
        text = request.POST.get('message')

        # Send email
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        #with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
        #with smtplib.SMTP('localhost',1025) as smtp:
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.sendmail(email, receiver, text)

        # Redirect to a success page
        return render(request, 'info/index.html')



