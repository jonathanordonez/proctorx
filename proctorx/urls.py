from django.urls import path, re_path
from proctorx import views

urlpatterns = [
path('', views.homepage, name='homepage'),
path('register', views.register),
path('help', views.help),
path('login', views.sign_in, name = 'login'),
path('student/reservation', views.reservation),
path('student/session', views.session),
path('student/settings', views.settings),
path('student/cart', views.cart),
path('student/checkout', views.checkout),
path('student/cart/<order_id>', views.delete_from_cart),
path('logout', views.sign_out),
path('change_password', views.change_password, name='change_password'),
re_path(r'^set_password/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,20}-[0-9A-Za-z]{1,40})$',
                views.set_password, name='set_password'),
re_path(r'^activate_account/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,20}-[0-9A-Za-z]{1,40})$',
                views.activate_account, name='activate_account')

]

