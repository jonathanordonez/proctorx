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
path('reset_password', views.reset_password, name='reset_password'),
# path('reset/<uidb64>/<token>/', views.PasswordResetConfirm.as_view(), name='password_reset_confirm'),
re_path(r'^activate_account/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,40})$',
                views.changed_password, name='changed_password'),
]

