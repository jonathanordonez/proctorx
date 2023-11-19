from django.urls import path, re_path
from proctorx import views

urlpatterns = [
path('sign_in', views.sign_in),
path('register', views.register),
path('get_csrf_token', views.get_csrf_token),

]

