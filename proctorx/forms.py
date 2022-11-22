from django.contrib.auth.forms import UserCreationForm, SetPasswordForm
from django.contrib.auth import password_validation
from django import forms
from django.forms import ModelForm, Textarea, TextInput, PasswordInput
from .models import Student
from django.utils.translation import gettext_lazy as _

class StudentForm(UserCreationForm):

# Redefining password1 and password2 in order to customize their widets
    password1 = forms.CharField(
        label=_("Password"),
        strip=False,
        widget=forms.PasswordInput(attrs={"autocomplete": "new-password", "class": "form-control"}),
        help_text=password_validation.password_validators_help_text_html(),
    )

    password2 = forms.CharField(
        label=_("Password confirmation"),
        widget=forms.PasswordInput(attrs={"autocomplete": "new-password", "class": "form-control"}),
        strip=False,
        help_text=_("Enter the same password as before, for verification."),
    )

    class Meta:
        model = Student
        # test_field = forms.CharField(max_length=30)
        fields = ['first_name', 'last_name','email', 'password1', 'password2']
        widgets = {
            'first_name': TextInput(attrs={'class':'form-control'}),
            'last_name': TextInput(attrs={'class':'form-control'}),
            'email': TextInput(attrs={'class':'form-control'}),
        }

class StudentSettings(ModelForm):
    class Meta:
        model = Student
        fields = ['first_name', 'last_name', 'phone_number', 'street_address', 'city', 'state', 'country', 'postal_code']

class ChangeEmailForm(ModelForm):
    class Meta:
        model = Student
        fields = ['email']

class SetStudentPassword(SetPasswordForm):
    new_password1 = forms.CharField(
        label=_("Password"),
        widget=forms.PasswordInput(attrs={"autocomplete": "new-password", "class": "form-control"}),
        strip=False,
        help_text=password_validation.password_validators_help_text_html(),
    )
    new_password2 = forms.CharField(
        label=_("Password confirmation"),
        strip=False,
        widget=forms.PasswordInput(attrs={"autocomplete": "new-password", "class": "form-control"}),
    )
    class Meta:
        model = Student
        fields = ['password1', 'password2']
        