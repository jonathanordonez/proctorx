from django.db import models
from django.contrib.auth.models import User, AbstractUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
import datetime

class CustomAccountManager(BaseUserManager):

    def create_superuser(self, email, user_name, first_name, password, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)
        return self.create_user(email, user_name, first_name, password, **other_fields)

    def create_user(self, email, user_name, first_name, password, **other_fields):
        
        if not email:
            raise ValueError('Please provide an email')
        
        email = self.normalize_email(email)
        user = self.model(email = email, user_name = user_name, first_name = first_name, **other_fields)
        user.set_password(password)
        user.save()
        return user


class Student(AbstractUser, PermissionsMixin):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.CharField(max_length=50, unique=True)
    user_name = models.CharField(max_length=30, unique=True)
    country = models.CharField(max_length=30)
    city = models.CharField(max_length=30)
    state = models.CharField(max_length=30)
    time_zone = models.CharField(max_length=30)
    postal_code = models.CharField(max_length=10)
    phone_number = models.IntegerField(blank=True, null=True)
    street_address = models.CharField(max_length=50)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    registered_on = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['user_name', 'first_name']

    objects = CustomAccountManager()

    def __str__(self):
        return self.first_name



class Session(models.Model):
    session_status = (
    ('scheduled', 'scheduled'),
    ('completed', 'completed'),  
    ('cancelled', 'cancelled'),
    )

    payment_status = (
    ('paid', 'paid'),
    ('pending', 'pending'),
    ('rejected', 'rejected'),  
    )

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    exam_date = models.DateField(default=datetime.date.today())
    exam_time = models.TimeField(default=datetime.time(12,0,0))
    university = models.CharField(max_length=50)   
    exam_name = models.CharField(max_length=50)
    exam_length = models.IntegerField(choices=((1,1),(2,2),(3,3)), db_column = 'exam length (hrs)', default=1)
    session_status = models.CharField(choices=session_status, max_length=20)
    date_purchased = models.DateField(null=True, blank=True)
    cost = models.DecimalField(decimal_places=2, max_digits= 9)
    payment_status = models.CharField(choices=payment_status, max_length=20)

