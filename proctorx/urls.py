from django.urls import path, re_path
from proctorx import views

urlpatterns = [
path('sign_in', views.sign_in, name='sign_in'),
]

