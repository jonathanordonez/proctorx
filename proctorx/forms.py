from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms
from django.forms import ModelForm
from .models import Student

class StudentForm(UserCreationForm):

    address_model_field = Student._meta.get_field('country')
    address = address_model_field.formfield()

    test = forms.CharField(label='Your name', max_length=100)
    class Meta:
        model = User
        test_field = forms.CharField(max_length=30)
        fields = ['username', 'email', 'password1', 'password2', 'test', 'address']


# class NewForm(forms.Form):
#     your_name = forms.CharField(label='Your name', max_length=100)
#     your_name2 = forms.CharField(label='Your name2', max_length=100)

# class InheritedStudent(ModelForm):
#     class Meta:
#         model = Student
#         fields = ['first_name', 'last_name']
