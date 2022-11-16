from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.forms import ModelForm, Textarea, TextInput
from .models import Student

class StudentForm(UserCreationForm):

    # Other methods to add form fields 
    # address_model_field = Student._meta.get_field('country')
    # address = address_model_field.formfield()
    # test = forms.CharField(label='Your name', max_length=100)

    class Meta:
        model = Student
        # test_field = forms.CharField(max_length=30)
        fields = ['first_name', 'last_name','email', 'password1', 'password2']



class StudentSettings(ModelForm):
    street_address1 = TextInput( attrs={
        'maxlength':30,
        'required':False,
        'help_text':'Use puns liberally',}
    )

    class Meta:
        model = Student
        fields = ['first_name', 'last_name', 'phone_number', 'street_address', 'city', 'state', 'country', 'postal_code']
