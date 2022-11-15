from django.contrib import admin
from .models import Student
from django.contrib.auth.admin import UserAdmin



class UserAdminConfig(UserAdmin):
    ordering = ('-registered_on',)
    list_display = ('email', 'user_name', 'first_name', 'is_active', 'is_staff')

admin.site.register(Student, UserAdminConfig)