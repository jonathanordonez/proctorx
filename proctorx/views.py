from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .forms import StudentForm
from .functions import obtain_exam_schedules
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Session
from django.contrib.auth.models import User


def homepage(request):
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
		username = request.POST.get('username')
		password = request.POST.get('password1')
		# Register user
		form = StudentForm(request.POST)
		if (form.is_valid()):
			form.save()
			print(f'received username: {username} and password {password} ')
			user = authenticate(request, username=username, password=password)
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
		username = request.POST.get('username')
		password =request.POST.get('password')
		user = authenticate(request, username=username, password=password)

		if user is not None:
			login(request, user)
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
		student = User.objects.filter(id=student_id)
		exam_date = request.POST.get('date')
		exam_time = request.POST.get('time')
		university = request.POST.get('university')
		exam_name = request.POST.get('exam')
		exam_length = request.POST.get('exam_length')
		Session.objects.create(student = student, exam_date = exam_date, exam_time = exam_time, 
		exam_length = exam_length, university = university, exam_name = exam_name, session_status = 'scheduled')


# student = models.ForeignKey(Student, on_delete=models.CASCADE)
#     exam_date = models.DateField()
#     exam_time = models.TimeField()
#     university = models.CharField(max_length=50)   
#     exam_name = models.CharField(max_length=50)
#     session_status


		context = {}
		return render(request, 'reservation.html', context=context)

@login_required(login_url='/login')
def cart(request):
	return render(request, 'cart.html')

@login_required(login_url='/login')
def checkout(request):
	return render(request, 'checkout.html')

@login_required(login_url='/login')
def settings(request):
	return render(request, 'settings.html')

@login_required(login_url='/login')
def session(request):
	# GET user's active sessions


	return render(request, 'session.html')

@login_required(login_url='/login')
def sign_out(request):
	logout(request)
	return redirect('/login')