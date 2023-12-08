from django.urls import path, re_path
from proctorx import views

urlpatterns = [
path('is_user_authenticated', views.is_user_authenticated),
path('sign_in', views.sign_in),
path('sign_out', views.sign_out),
path('register', views.register),
path('get_csrf_token', views.get_csrf_token),
path('set_user_details', views.set_user_details),
path('change_password', views.change_password),
path('get_sessions', views.get_sessions),
path('add_to_cart', views.add_to_cart),
path('sessions', views.sessions),


path('get_json1', views.get_json1),
path('get_json2', views.get_json2),
path('get_json3', views.get_json3),
path('get_json5', views.get_json5),

]

