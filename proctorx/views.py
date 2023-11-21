from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.http import HttpResponse
from .forms import StudentForm, StudentSettings, ChangeEmailForm, SetStudentPassword, ChangeStudentPassword
from .functions import obtain_exam_schedules, email_password_reset_link, email_activation_token, get_cart_items_number, make_payment
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Session, Student, Order
from .tokens import account_activation_token, password_reset_token
from django.utils.http import urlsafe_base64_decode
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils.encoding import force_str
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.contrib.sessions.models import Session
from django.views.decorators.csrf import csrf_exempt
import datetime
import json
import re

def is_user_authenticated(request):
    if request.user.is_authenticated:

        return JsonResponse({'is_authenticated': True,'first_name':request.user.first_name, 'last_name': request.user.last_name, 
                             'email':request.user.email, 'country':request.user.country, 'city':request.user.city,
                             'state':request.user.state,'time_zone':request.user.time_zone,'postal_code':request.user.postal_code,
                             'phone_number':request.user.phone_number,'street_address':request.user.street_address})
    else:
        return JsonResponse({'is_authenticated': False}) 

def sign_in(request):
    data = json.loads((request.body.decode('ascii')))
    print(data)
    email = data['email']
    password = data['password']

    user = authenticate(request, email=email, password=password)

    if(user):
        print('user authenticated: ',user)
        login(request, user)
        return JsonResponse({'status': 'success'})

    else:
        return JsonResponse({'status': 'failure'})
    
def sign_out(request):
    logout(request)
    return HttpResponse(status=200)

def register(request):
    data = json.loads((request.body.decode('ascii')))
    email = data['email']
    student_exists = Student.objects.filter(email=email)
    if (len(student_exists)>0):
        print('this email exists already ',)
        message = {'status':'failure','message':'Email address already exists'}
        response = JsonResponse(message)
        return response
    
    data = {
    'first_name': data['firstName'],
    'last_name': data['lastName'],
    'email': data['email'],
    'password1': data['password'],
    'password2': data['password2']
    }

    form = StudentForm(data)
    if (form.is_valid()):
        try:
            user = form.save()
            user.is_active = True
            user.save()
            print('this user: ', user)
            json_data = {"status":"successful","description":f"Student created: {email}"}
        except Exception as e:
            print(f"An error occurred while saving the form: {e}")
            json_data = {"status":"failure","description":f"Unable to create student: {email}"}

    else:
        json_data = {"status":"failure","description":f"Unable to create student: {email}"}
    
    response = JsonResponse(json_data)
    response["Access-Control-Allow-Credentials"] = 'true'
    return response
   
def get_csrf_token(request):
    if request.session.session_key:
        return JsonResponse({'status':'failure', 'description':'Session already exists. Therefore, csrftoken cookie should already be in the browser cookies. Clear all cookies in the browser if the issue persists.'});
    request.session.create() # Create a Django session and adds 'sessionid' cookie to the browser
    get_token(request) # Adds 'csrftoken' cookie to the browser
    response = JsonResponse({'status':'successful'})
    response["Access-Control-Allow-Credentials"] = 'true'
    return response