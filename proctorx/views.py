from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from .forms import StudentForm, StudentSettings, ChangeEmailForm, SetStudentPassword
from .functions import obtain_exam_schedules, email_password_reset_link, email_activation_token
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Session, Student
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

def homepage(request):
	if request.user.is_authenticated:
		print(f'user is {request.user} with type {type(request.user)}')
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
		# Register user
		form = StudentForm(request.POST)
		if (form.is_valid()):
			form.save()

			student_record = Student.objects.get(email=email)
			student_id_base64 = urlsafe_base64_encode(force_bytes(student_record.id))
			activation_token = account_activation_token.make_token(student_record)
			email_activation_token(email, student_id_base64, activation_token)

				# to do: mail confirmation message

			return redirect('/login')
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
					# # to-do: create check to ensure the date/time is not in the past
			return render(request, 'reservation.html', context)

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

# Returns the forgot_password.html
def change_password(request):
	if request.user.is_authenticated and request.method == 'GET':
		# load change password form
		form = PasswordChangeForm(user=request.user)
		context = {'form':form}
		return render(request, 'change_password.html', context=context)

	elif request.user.is_authenticated and request.method == 'POST':
		form = PasswordChangeForm(user=request.user, data=request.POST)
		if form.is_valid():
			form.save()
			update_session_auth_hash(request, form.user)
			# to-do: show message indicating password was changed successfully
			return redirect('/student/session')
		else:
			print('your form is not valid')
			# to-do: show message indicating form wasn't valid
			return redirect('/change_password')

	elif request.user.is_authenticated == False and request.method == 'GET':
		context = {'message': 'Enter your email address below to reset your password:',
					'form': ChangeEmailForm()}
		return render(request, 'change_password.html', context=context)

	elif request.user.is_authenticated == False and request.method == 'POST':
		student_record = Student.objects.filter(email=request.POST.get('email'))
		if len(student_record) > 0:
			student_record = student_record[0]
			student_id_base64 = urlsafe_base64_encode(force_bytes(student_record.id))
			student_token = password_reset_token.make_token(student_record)
			email_password_reset_link(student_record.email, student_id_base64, student_token)
		else:
			print(f'student with email {request.POST.get("email")} not found')

		context = {'message': 'You will receive a password reset link if your email exists in our db'}

		# to-do: message to let the customer know the email has been sent and to check his inbox
		#        redirect to login in 15 seconds and show timer
		
		return render(request, 'change_password.html', context=context)

	return render(request, 'change_password.html')

def set_password(request, uidb64, token):
	student_uid = force_str(urlsafe_base64_decode(uidb64))
	student_record = Student.objects.get(id=student_uid)
	
	if request.method == 'GET':
		if password_reset_token.check_token(student_record, token):
			form = SetStudentPassword(user=student_record)
			context = {'form':form}
			return render(request, 'set_password.html', context=context)
	

	elif request.method == 'POST':
		form = SetStudentPassword(user=student_record, data=request.POST)
		if form.is_valid():
			form.save()
			# to-do: show message indicating password was changed successfully
			return redirect('/student/session')
		else:
			print('form not valid')


	return render(request, 'set_password.html')

	# if student_record is not None and password_reset_token.check_token(student_record, token):
		# login(request, user)
	print(f'gets here {uidb64} {token}')
	return render(request, 'password_changed.html')

def activate_account(request, uidb64, token):
	student_id = force_str(urlsafe_base64_decode(uidb64))
	student_record = Student.objects.filter(id=student_id)

	if len(student_record) > 0:
		student_record[0].is_active = True
		student_record[0].save()

	else:
		print(f'student id received {student_id} does not exist')

	# to-do: show successful/unsuccessful message
	return redirect('login')
