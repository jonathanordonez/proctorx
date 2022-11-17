from django.urls import path, re_path
from proctorx import views

urlpatterns = [
path('', views.homepage),
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
path('forgot_password', views.forgot_password, name='forgot_password'),
path('change_password', views.change_password, name='change_password'),

# re_path(r'^change_password/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,40})$',
#                 views.change_password, name='change_password')


# re_path(r'^activate_account/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,40})$',
#                 views.changed_password_confirmation, name='changed_password_confirmation'),
]

