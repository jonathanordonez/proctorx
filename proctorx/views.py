from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.http import HttpResponse
from .forms import StudentForm, StudentSettings, ChangeEmailForm, SetStudentPassword, ChangeStudentPassword
from .functions import obtain_exam_schedules, email_password_reset_link, email_activation_token, get_cart_items_number, make_payment
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Student, Order
from .models import Session as StudentSession
from .tokens import account_activation_token, password_reset_token
from django.utils.http import urlsafe_base64_decode
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils.encoding import force_str
from django.utils import timezone
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.contrib.sessions.models import Session
from django.views.decorators.csrf import csrf_exempt
from django.core.serializers import serialize
import datetime
import json
import pytz

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

def set_user_details(request):
    data = json.loads((request.body.decode('ascii')))
    if request.user.is_authenticated:
        try:
            student = Student.objects.get(email=request.user.email)
            student.first_name = data['first_name']
            student.last_name = data['last_name']
            student.phone_number = data['phone_number']
            student.street_address = data['street_address']
            student.city = data['city']
            student.state = data['state']
            student.country = data['country']
            student.postal_code = data['postal_code']
            student.save()
            response = JsonResponse({'status':'success'})
        except Exception as e:
            response = JsonResponse({'status':'failure', 'description': 'Error occurred when updating Student information'})
    else:
        response = JsonResponse({'status':'failure', 'description': 'User is not authenticated'})
    
    return response

def change_password(request):
    data = json.loads((request.body.decode('ascii')))
    if request.user.is_authenticated:
        old_password = data['old_password']
        new_password = data['new_password']
        if not request.user.check_password(old_password):
            return JsonResponse({'status':'failure', 'details':'Old password is incorrect'})
        try:
            request.user.set_password(new_password)
            request.user.save()
            user = authenticate(request, email=request.user.email, password=new_password)
            if user is not None:
                print('logged in user: ' , user)
                login(request, request.user)
                return JsonResponse({'status':'success'})
            else:
                return JsonResponse({'status': 'failure', 'details': 'Authentication failed'})
        except Exception as e:
            return JsonResponse({'status':'failure', 'details':'Error in changing the user password'})
    else:
        return JsonResponse({'status':'failure', 'details':'User is not authenticated'})

def add_to_cart(request):
    data = json.loads((request.body.decode('ascii')))
    exam_date = data['dateSelected'].split(' ')[0].split('-')
    exam_time = data['dateSelected'].split(' ')[1].split(':')
    exam_date_time = datetime.datetime(int(exam_date[0]), int(
        exam_date[1]), int(exam_date[2]), int(exam_time[0]), int(exam_time[1]))
    exam_length = int(data['lengthSelected'].split(' ')[0])
    
    StudentSession.objects.create(student_id=request.user.id, exam_date_time=exam_date_time, university=data['university'], exam_name=data['exam'],
                            exam_length=exam_length, session_status='Cart', date_purchased=timezone.now(), cost=exam_length * 35, payment_status='pending')
    return JsonResponse({'status':'success', 'message': 'Added to cart'})

def sessions(request):
    is_cart = request.GET.get('cart')
    
    if is_cart:
        try:
            cart_sessions = StudentSession.objects.filter(student_id = request.user.id, session_status = "Cart")
            if len(cart_sessions) > 0:
                cart_sessions_array = list(cart_sessions.values())
                print(cart_sessions_array)
                return JsonResponse({'status':'success', 'cart_sessions':cart_sessions_array })
            else:
                return JsonResponse({'status':'success', 'cart_sessions':[] })
        except Exception as e:
            return JsonResponse({'status':'failure', 'message':'An error occurred while fetching cart sessions'})
    
    elif not is_cart:
        complete_sessions(request.user.id) # Checks for scheduled sessions that are now completed
        try:
            orders = StudentSession.objects.filter(student_id = request.user.id, payment_status = "paid")
            print('this orders', orders)
            if len(orders) > 0:
                orders_list = list(orders.values())
                print(orders_list)
                return JsonResponse({'status':'success', 'orders':orders_list })
            else:
                return JsonResponse({'status':'success', 'orders':[] })
        except Exception as e:
            return JsonResponse({'status':'failure', 'message':'An error occurred while fetching orders'})

def complete_sessions(student_id):
    student_sessions = StudentSession.objects.filter(student_id=student_id, session_status='scheduled')
    for session in student_sessions:
        timezone_utc = pytz.timezone('UTC')
        now_utc = timezone_utc.localize(datetime.datetime.now()) 
        if(session.exam_date_time < now_utc):
            session.session_status = 'completed'
            session.save()

def delete_cart_session(request):
    data = json.loads((request.body.decode('ascii')))
    if request.user.is_authenticated:
        try:
            session = StudentSession.objects.get(id=data['session_id'])
            if (session.student_id == request.user.id):
                session.delete()
                return JsonResponse({'status':'success'})
            else:
                return JsonResponse({'status':'failure'})
            
        except Exception as e:
            return JsonResponse({'status':'failure','description':'Error deleting cart session'})
    else:
        return JsonResponse({'status':'failure','description':'User is not authenticated'})

def cart_items_quantity(request):
    if request.user.is_authenticated:
        try:
            sessions = StudentSession.objects.filter(student_id=request.user.id, session_status='Cart')
            return JsonResponse({'status':'success', 'cart_items_quantity':len(sessions)})
        except Exception as e:
            return JsonResponse({'status':'failure'})
    else:
        return JsonResponse({'status':'failure','description':'User is not authenticated'})

def pay_cart_session(request):
    data = json.loads((request.body.decode('ascii')))
    print(f' this is the data: {data}')
    if request.user.is_authenticated:
        try:
            for session_id in data:
                session = StudentSession.objects.filter(id=session_id)
                if(len(session) ==1):
                    cart_session = session[0]
                    cart_session.payment_status = 'paid'
                    cart_session.session_status = 'scheduled'
                    cart_session.save()
                else:
                    return JsonResponse({'status':'failure','description':f'error filtering session {session["sessionid"]}'})
            return JsonResponse({'status':'success',})
        except Exception as e:
            return JsonResponse({'status':'failure','description':'failed to modify sessions'})
    else:
        return JsonResponse({'status':'failure','description':'User is not authenticated'})
    
def upcoming_sessions(request):
    try:
        upcoming_sessions = StudentSession.objects.filter(student_id = request.user.id, session_status = "scheduled")
        if len(upcoming_sessions) > 0:
            upcoming_sessions_array = list(upcoming_sessions.values())
            return JsonResponse({'status':'success', 'upcoming_sessions':upcoming_sessions_array })
        else:
            return JsonResponse({'status':'success', 'upcoming_sessions':[] })
    except Exception as e:
        return JsonResponse({'status':'failure', 'message':'An error occurred while fetching upcoming sessions'})
    
    