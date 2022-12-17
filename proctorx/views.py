from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.http import HttpResponse
from .forms import StudentForm, StudentSettings, ChangeEmailForm, SetStudentPassword, ChangeStudentPassword
from .functions import obtain_exam_schedules, email_password_reset_link, email_activation_token, get_cart_items_number, make_payment
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Session, Student, Order
from django.contrib.auth.models import User
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth import views as auth_views
from django.urls import reverse_lazy
from .tokens import account_activation_token, password_reset_token
from django.utils.http import urlsafe_base64_decode
# from django.utils.encoding import force_text
from django.views import View
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils.encoding import force_str
from django.contrib.auth.forms import PasswordChangeForm
from django.http import JsonResponse
import datetime
import re

import urllib.parse
import json


def homepage(request):
    if request.user.is_authenticated:
        print(f'user is {request.user} with type {type(request.user)}')
        return redirect('/student/session')
    return render(request, 'homepage.html')


def register(request):
    EMAIL_REGEX = re.compile(r"(?:[a-z0-9!#$%&'"+r"*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'"+r'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])')
    form = StudentForm()
    if request.user.is_authenticated:
        return redirect('/student/session')

    if (request.method == 'GET'):
        # Show user registrarion form
        context = {'form': form}
        return render(request, 'register.html', context=context)

    elif (request.method == 'POST'):
        email = request.POST.get('email')
        student_exists = Student.objects.filter(email=email)
        # Email address already exists
        if (len(student_exists)>0):
            message = {'status':'failure','message':'Email address already exists'}
            context = {'form': form, 'message':message}
            return render(request, 'register.html', context=context)

        # Register user
        form = StudentForm(request.POST)
        if (form.is_valid() and EMAIL_REGEX.match(email)):
            form_status =  form.save()
            print(form_status)
            student_record = Student.objects.get(email=email)
            student_id_base64 = urlsafe_base64_encode(
                force_bytes(student_record.id))
            activation_token = account_activation_token.make_token(
                student_record)
            if (email_activation_token(student_record.first_name, email, student_id_base64, activation_token)):
                message = {'status':'success','message':f'Please activate your account by clicking in activation link sent to {email}'}
                context = {'message':message}
                return render(request, 'register.html', context=context)
            else:
                message = {'status':'failure','message':'Please check the information entered and try again'}
                context = {'form': form, 'message':message}
                return render(request, 'register.html', context=context)
        
        # Form is not valid
        else:
            message = {'status':'failure','message':'Please check the information entered and try again'}
            context = {'form': form, 'message':message}
            return render(request, 'register.html', context=context)



def help(request):
    return render(request, 'help.html')


def sign_in(request):
    context = {}
    if request.user.is_authenticated:
        return redirect('student/session')

    if (request.method == 'POST'):
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)
            # print('****gets here')
            return redirect('/student/session')

        else:
            messages.info(request, 'Username OR password is incorrect')

    return render(request, 'login.html', context=context)


@login_required(login_url='/login')
def reservation(request):
    print(f'cart items number is {get_cart_items_number(request.user)}')
    if request.method == 'GET':
        context = {'cart_items_number': get_cart_items_number(request.user)}
        return render(request, 'reservation.html', context=context)

    elif request.method == 'POST':
        print(request.body)
        body = request.body.decode('utf-8')
        body = json.loads(body)
        print(body)
        option = body['postOption']
        if option == 'search schedules':
            print(body)
            print(type(body))
            available_schedules = obtain_exam_schedules(
                body['date'], body['time'])
            response = {'university': body['university'], 'date': body['date'],
                        'time': body['time'], 'program': body['program'], 'length': body['exam-length'], 'available_schedules': available_schedules}
            return JsonResponse({'available_schedules': available_schedules})
        elif option == 'add to cart':
            exam_date = body['dateSelected'].split('T')[0].split('-')
            exam_time = body['dateSelected'].split('T')[1][1:].split(':')
            exam_date_time = datetime.datetime(int(exam_date[0]), int(
                exam_date[1]), int(exam_date[2]), int(exam_time[0]), int(exam_time[1]))
            exam_length = int(body['exam-length'].split(' ')[0])
            # print(exam_date)
            # print(exam_time)
            # print(exam_date_time)
            # print(body[])
            Session.objects.create(student_id=request.user.id, exam_date_time=exam_date_time, university=body['university'], exam_name=body['program'],
                                   exam_length=exam_length, session_status='Cart', date_purchased=None, cost=exam_length * 35, payment_status='pending')
            return JsonResponse({'status':'success', 'message': 'Added to cart'})


@ login_required(login_url='/login')
def order(request):
    orders_list = []
    orders = Order.objects.filter(student_id=request.user.id)
    if len(orders) > 0:
        for order in orders:
            obj_sub = {}
            sessions = Session.objects.filter(order_id=order.id)
            obj_sub['order_id'] = order.id
            obj_sub['date'] = order.date_placed.date()
            obj_sub['total'] = order.total
            obj_sub['sessions'] = sessions
            orders_list.append(obj_sub)

        orders_list.reverse()  
        context = context = {
            'cart_items_number': get_cart_items_number(request.user),
            'orders': orders_list,
        }
    

    else: 
        context = {'cart_items_number': get_cart_items_number(request.user)}

    return render(request, 'order.html', context=context)


@ login_required(login_url='/login')
def cart(request):
    if request.method == 'GET':
        # Query and dispaly unpaid reservations (aka sessions)
        unpaid_reservations = Session.objects.filter(
            student_id=request.user.id).filter(session_status='Cart')
        cart_items_number = get_cart_items_number(request.user)
        total_cost = 0
        for session in unpaid_reservations:
            total_cost += session.cost
        context = {'unpaid_reservations': unpaid_reservations,
                   'cart_items_number': cart_items_number, 'total_cost': total_cost}
        return render(request, 'cart.html', context)

    elif request.method == 'POST':
        print(request.body)
        body = request.body.decode('utf-8')
        body = json.loads(body)
        option = body['postOption']
        print(option)

        # Used when customer deletes a session from their cart
        if option == 'deleteFromCart':
            session_record = Session.objects.get(id=body['sessionId'])
            # ensures the request to delete the session is performed by the owner
            if request.user.id == session_record.student_id:
                session_record.session_status = 'Deleted'
                session_record.save()
                return JsonResponse({'status': 'success', 'message': 'Session deleted'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Unable to delete session from cart'})

        # Used when customer pays for the session(s) in their cart
        elif option == 'cc-payment':
            # Checks that the sessions submitted belong to the user paying for them
            proceed_with_payment = True
            sessions = []
            for session in body['sessions']:
                session_record = Session.objects.get(id=session)
                if session_record.student_id != request.user.id or session_record.session_status != 'Cart' or session_record.payment_status != 'pending':
                    proceed_with_payment = False
                else:
                    sessions.append(session_record)
                    
            if (proceed_with_payment):
                payment_amount = 0
                for session in sessions:
                    payment_amount += session.cost
                if (payment_amount > 0) and make_payment(body['card-holder-name'], body['card-number'].replace(' ',''), 
                body['month'], body['year'], body['cvv'], payment_amount):
                    order = Order.objects.create(total=payment_amount, student_id = request.user.id)
                    # Updates the sessions if the payment is successful
                    for session in sessions:
                        session.payment_status = 'Paid'
                        session.session_status = 'Scheduled'
                        session.order = order
                        session.save()
                    return JsonResponse({'status':'success', 'message':'Payment successful. Redirecting to Sessions...'})
                else:
                    return JsonResponse({'status':'failure', 'message':'Payment unsuccessful.\nPlease try again or contact Support.'})
            else:
                return JsonResponse({'status':'failure', 'message':'Payment not processed. Please try again or contact Support.'})


@ login_required(login_url='/login')
def checkout(request):
    # if request.method == 'POST':
    # 	payment_id = request.POST.get('payment_id')
    # 	payment_record = Payment.objects.get(id = payment_id)
    # 	payment_record.payment_status = 'paid'

    pending_sessions = Session.objects.filter(
        student_id=request.user.id).filter(payment_status='pending')
    session_total = 0
    for session in pending_sessions:
        session_total += session.cost
    context = {'total': session_total}

    return render(request, 'checkout.html', context)


@ login_required(login_url='/login')
def delete_from_cart(request, order_id):
    session_id = order_id
    # session_record = int(request.POST.get('session_id'))
    session = Session.objects.get(id=session_id)
    if (session.student_id == request.user.id):
        session.session_status = 'cancelled'
        session.payment_status = 'cancelled'
        session.save()

    return redirect('/student/cart')


@ login_required(login_url='/login')
def settings(request):
    student_record = Student.objects.get(id=request.user.id)
    settings_data = {
        'first_name': student_record.first_name, 'last_name': student_record.last_name,
        'street_address': student_record.street_address, 'postal_code': student_record.postal_code, 'country': student_record.country,
        'city': student_record.city, 'state': student_record.state, 'phone_number': student_record.phone_number,
    }
    if request.method == 'GET':
        form = StudentSettings(initial=settings_data)
        form_password = ChangeStudentPassword(user=request.user)
        context = {'cart_items_number': get_cart_items_number(request.user), 'form': form, 'form_password': form_password}
        return render(request, 'settings.html', context=context)

    elif request.method == 'POST':
        print(request.body)
        body = request.body.decode('utf-8')
        print(body)
        body = json.loads(body)
        option = body['postOption']

        if option == 'update user settings':
            print(body)
            
            # check if the form has changed 
            student_record = Student.objects.get(id=request.user.id)
            form = StudentSettings(body, initial=settings_data)
            if form.has_changed:
                print(f'fields that changed {form.changed_data}')
                for field in form.changed_data:
                    print(f'field is: {field}')
                    print(type(field))
                    setattr(student_record, field, str(body[field]))
                    student_record.save()

            return JsonResponse({'status': 'success', 'message': 'Account settings updated'})

        if option == 'change password':
            form = ChangeStudentPassword(user=request.user, data=body)
            if form.is_valid():
                print('form is valid')
                form.save()
                update_session_auth_hash(request, form.user)
                # request.session['message'] = 'Password changed successfully'
                # return redirect('/student/session')

                return JsonResponse({'status': 'success', 'message': 'Password changed successfully'})
            else:
                return JsonResponse({'status': 'failure', 'message': 'Failed to change password. Please try again.'})
        else:
            print('your form is not valid')
            # to-do: show message indicating form wasn't valid
            return JsonResponse({'status': 'failure', 'message': 'Failed to change password'})

    else:
        form = StudentSettings(initial=settings_data)
        context = {'form': form}

        return render(request, 'settings.html', context)


@ login_required(login_url='/login')
def session(request):

    # Query and dispaly current active reservations (aka paid sessions)
    current_reservations = Session.objects.filter(
        student_id=request.user.id).filter(session_status='Scheduled')
    cart_items_number = get_cart_items_number(request.user)
    if len(current_reservations) > 0:
        context = {'current_reservations': current_reservations,
                   'cart_items_number': cart_items_number}
    else:
        context = {'cart_items_number': cart_items_number}

    return render(request, 'session.html', context)


@ login_required(login_url='/login')
def sign_out(request):

    logout(request)
    return redirect('/login')

# Returns the forgot_password.html

def change_password(request):
    if request.user.is_authenticated:
        return redirect('/student/settings#change-password')

    else:
        if request.method == 'GET':
            return render(request, 'change_password.html')

        elif request.method == 'POST':
            student_record = Student.objects.filter(
                email=request.POST.get('email'))
            if len(student_record) > 0:
                student_record = student_record[0]
                student_id_base64 = urlsafe_base64_encode(
                    force_bytes(student_record.id))
                student_token = password_reset_token.make_token(student_record)
                email_password_reset_link(
                    student_record.first_name, student_record.email, student_id_base64, student_token)
            else:
                print(f'student with email {request.POST.get("email")} not found')
            message = {'status':'success', 'message':'A password reset link will be sent to the email address entered if it exits in our database'}
            context = {'message': message}

            return render(request, 'change_password.html', context=context)

    return render(request, 'change_password.html')


def set_password(request, uidb64, token):
    student_uid = force_str(urlsafe_base64_decode(uidb64))
    student_record = Student.objects.get(id=student_uid)

    if request.method == 'GET':
        if password_reset_token.check_token(student_record, token):
            form = SetStudentPassword(user=student_record)
            context = {'form': form}
            return render(request, 'set_password.html', context=context)
        else:
            message = {'status':'failure','message':'This token link does not exist'}
            context = {'message':message}
            return render(request, 'set_password.html', context=context)

    elif request.method == 'POST':
        form = SetStudentPassword(user=student_record, data=request.POST)
        if form.is_valid():
            form.save()
            authenticate(email=student_record.email,password=request.POST.get('password1'))
            login(request, student_record)
            # to-do: show message indicating password was changed successfully
            return redirect('/student/session')
        else:
            form = SetStudentPassword(user=student_record)
            message = {'status':'failure','message':'Please ensure both password fields match'}
            context = {'form':form,'message':message}
            return render(request, 'set_password.html', context=context)

    return render(request, 'set_password.html')

    # if student_record is not None and password_reset_token.check_token(student_record, token):
    # login(request, user)
    print(f'gets here {uidb64} {token}')
    return render(request, 'password_changed.html')


def activate_account(request, uidb64, token):
    student_id = force_str(urlsafe_base64_decode(uidb64))
    student_record = Student.objects.filter(id=student_id)
    if len(student_record) > 0:
        if (student_record[0].is_active):
            return redirect('login')

        else:
            if account_activation_token.check_token(student_record[0], token):
                student_record[0].is_active = True
                student_record[0].save()
                response = '<div style="font-family:sans-serif">Account successfully activated. <a href="/login">Log in</a></div>'
                return HttpResponse(response)
            else:
                print('unable to activate account')

    else:
        print('user does not exist - token link incorrect')
        message = {'status':'failure', 'message':'This activation link is invalid'}
        context = {'message':message}
        return render(request, 'login.html',context=context)
    
