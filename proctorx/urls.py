from django.urls import path
from proctorx import views

urlpatterns = [
path('', views.homepage),
path('register', views.register),
path('help', views.help),
path('login', views.sign_in),
path('student/reservation', views.reservation),
path('student/session', views.session),
path('student/settings', views.settings),
path('student/cart', views.cart),
path('student/checkout', views.checkout),
path('logout', views.sign_out),
]

