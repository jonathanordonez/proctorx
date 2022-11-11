from django.shortcuts import render
#from django.contrib.auth.forms import UserCreationForm
from .forms import StudentForm

def homepage(request):
	return render(request, 'homepage.html')

def register(request):
	form = StudentForm()
	context = {'form':form}
	return render(request, 'register.html', context=context)

def help(request):
	return render(request, 'help.html')

def login(request):
	return render(request, 'login.html')

def reservation(request):
	return render(request, 'reservation.html')

def cart(request):
	return render(request, 'cart.html')

def checkout(request):
	return render(request, 'checkout.html')

def settings(request):
	return render(request, 'settings.html')

def session(request):
	return render(request, 'session.html')
