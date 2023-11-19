from django.db import models
from django.contrib.auth.models import User, AbstractUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
import datetime

class CustomAccountManager(BaseUserManager):

    def create_superuser(self, email, first_name, password, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)
        return self.create_user(email, first_name, password, **other_fields)

    def create_user(self, email, first_name, password, **other_fields):
        
        if not email:
            raise ValueError('Please provide an email')
        
        email = self.normalize_email(email)
        user = self.model(email = email, first_name = first_name, **other_fields)
        user.set_password(password)
        user.save()
        return user


class Student(AbstractUser, PermissionsMixin):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.CharField(max_length=50, unique=True)
    country = models.CharField(max_length=30, blank=True, null=True)
    city = models.CharField(max_length=30, blank=True, null=True)
    state = models.CharField(max_length=30, blank=True, null=True)
    time_zone = models.CharField(max_length=30, blank=True, null=True)
    postal_code = models.CharField(max_length=10, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    street_address = models.CharField(max_length=50, blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    username = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['email, first_name, last_name ']

    objects = CustomAccountManager()

    def __str__(self):
        return self.first_name


class Order(models.Model):
    date_placed = models.DateTimeField(default=datetime.datetime.now())
    total = models.DecimalField(decimal_places=2, max_digits= 9)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)

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
    exam_date_time = models.DateTimeField(default=datetime.datetime.now())
    university = models.CharField(max_length=50)   
    exam_name = models.CharField(max_length=50)
    exam_length = models.IntegerField(choices=((1,1),(2,2),(3,3)), db_column = 'exam length (hrs)', default=1)
    session_status = models.CharField(choices=session_status, max_length=20)
    date_purchased = models.DateField(null=True, blank=True)
    cost = models.DecimalField(decimal_places=2, max_digits= 9)
    payment_status = models.CharField(choices=payment_status, max_length=20)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True)

