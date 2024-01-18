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
path('add_to_cart', views.add_to_cart),
path('sessions', views.sessions),
path('delete_cart_session', views.delete_cart_session),
path('cart_items_quantity', views.cart_items_quantity),
path('pay_cart_session', views.pay_cart_session),
path('upcoming_sessions', views.upcoming_sessions),


]

