from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .forms import StudentForm, StudentSettings
from .functions import obtain_exam_schedules
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Session, Student
from django.contrib.auth.models import User
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth import views as auth_views
from django.urls import reverse_lazy

def homepage(request):
	if request.user.is_authenticated:
		return redirect('/student/session')
	return render(request, 'homepage.html')

def register(request):
	if request.user.is_authenticated:
		return redirect('/student/session')

	if (request.method == 'GET'):
		# Show user registrarion form
		form = StudentForm()
		context = {'form':form}
		return render(request, 'register.html', context=context)

	elif (request.method == 'POST'):
		email = request.POST.get('email')
		password = request.POST.get('password1')
		# Register user
		form = StudentForm(request.POST)
		if (form.is_valid()):
			form.save()
			# print(f'received username: {username} and password {password} ')
				# to do: mail confirmation 
			user = authenticate(request, email=email, password=password)
			login(request, user)
			return redirect('/student/session')
		else:
			print('*** form is not valid ***')
		
		return render(request, 'register.html')

def help(request):
	return render(request, 'help.html')

def sign_in(request):
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

	return render(request, 'login.html')


@login_required(login_url='/login')
def reservation(request):
	if request.method == 'GET':
		return render(request, 'reservation.html')

	elif request.method == 'POST':
		# POST make a new reservation
		student_id = request.user.id
		student = Student.objects.get(id=student_id)
		exam_date = request.POST.get('date')
		exam_time = request.POST.get('time')
		university = request.POST.get('university')
		exam_name = request.POST.get('exam')
		exam_length = request.POST.get('exam_length')
		cost = int(exam_length) * 15

		if(request.POST.get('Lookup reservation schedules') == 'Submit'):
			context = {'available_schedules' : obtain_exam_schedules(exam_date, exam_time, exam_length)}
			print(context['available_schedules'])
			return render(request, 'reservation.html', context)
		# # to-do: create check to ensure the date/time is not in the past






@login_required(login_url='/login')
def cart(request):
	# Query and dispaly unpaid reservations (aka sessions)
	unpaid_reservations = Session.objects.filter(student_id = request.user.id).filter(payment_status = 'pending')
	context = {'unpaid_reservations':unpaid_reservations} 
	return render(request, 'cart.html', context)

@login_required(login_url='/login')
def checkout(request):
	# if request.method == 'POST':
	# 	payment_id = request.POST.get('payment_id')
	# 	payment_record = Payment.objects.get(id = payment_id)
	# 	payment_record.payment_status = 'paid'

	pending_sessions = Session.objects.filter(student_id = request.user.id).filter(payment_status = 'pending')
	session_total = 0
	for session in pending_sessions:
		session_total += session.cost
	context = {'total':session_total}


	return render(request, 'checkout.html', context)

@login_required(login_url='/login')
def delete_from_cart(request, order_id):
	session_id = order_id
	# session_record = int(request.POST.get('session_id'))
	session = Session.objects.get(id = session_id)
	if(session.student_id == request.user.id):
		session.session_status = 'cancelled'
		session.payment_status = 'cancelled'
		session.save()
	
	return redirect('/student/cart')

@login_required(login_url='/login')
def settings(request):
	student_record = Student.objects.get(id = request.user.id)

	settings_data = {
			'first_name':student_record.first_name, 'last_name':student_record.last_name,
			'street_address':student_record.street_address, 'postal_code':student_record.postal_code, 'country': student_record.country,
			'city':student_record.city, 'state':student_record.state, 'phone_number':student_record.phone_number,
			}

	if request.method == 'POST' and request.POST.get('Settings') == 'Submit':
		# check if the form has changed with
		student_record = Student.objects.get(id = request.user.id)
		form = StudentSettings(request.POST, initial = settings_data)
		if form.has_changed:
			print(f'fields that changed {form.changed_data}')
			for field in form.changed_data:
				print(f'field is: {field}')
				print(type(field))
				print(request.POST.get(field))
				setattr(student_record, field, str(request.POST.get(field))) 
				student_record.save()
			print('new user information saved')
		
		new_settings_data = {
			'first_name':student_record.first_name, 'last_name':student_record.last_name,
			'street_address':student_record.street_address, 'postal_code':student_record.postal_code, 'country': student_record.country,
			'city':student_record.city, 'state':student_record.state, 'phone_number':student_record.phone_number,
			}

		new_form = StudentSettings(initial = new_settings_data)
		context = {'form':new_form}
		return render(request, 'settings.html', context)

	else:
		form = StudentSettings(initial = settings_data)
		context = {'form':form}
		
		return render(request, 'settings.html', context)


@login_required(login_url='/login')
def session(request):
	# Query and dispaly current active reservations (aka paid sessions)
	current_reservations = Session.objects.filter(student_id = request.user.id).filter(payment_status = 'paid')
	context = {'current_reservations':current_reservations} 

	return render(request, 'session.html', context)

@login_required(login_url='/login')
def sign_out(request):

	logout(request)
	return redirect('/login')

# Returns the reset_password.html
class PasswordReset(auth_views.PasswordResetView):
    template_name = 'reset_password.html'
    success_url = reverse_lazy('login')

class PasswordResetConfirm(SuccessMessageMixin, auth_views.PasswordResetConfirmView):
    template_name = 'set_password.html'
    success_url = reverse_lazy('login')
    success_message = 'Your password has been changed.'