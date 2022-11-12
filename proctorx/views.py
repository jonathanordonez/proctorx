from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .forms import StudentForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required


def homepage(request):
	return render(request, 'homepage.html')

def register(request):
	if (request.method == 'GET'):
		# Show user registrarion form
		form = StudentForm()
		context = {'form':form}
		return render(request, 'register.html', context=context)

	elif (request.method == 'POST'):
		# Register user
		form = StudentForm(request.POST)
		if (form.is_valid()):
			print('*** form is valid ***')
			form.save()
			print('user created')
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
	return render(request, 'reservation.html')

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
	return render(request, 'session.html')

@login_required(login_url='/login')
def sign_out(request):
	logout(request)
	return redirect('/login')