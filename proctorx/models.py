from django.db import models
from django.contrib.auth.models import User
import datetime

class Student(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email_address = models.CharField(max_length=50)
    country = models.CharField(max_length=30)
    city = models.CharField(max_length=30)
    state = models.CharField(max_length=30)
    time_zone = models.CharField(max_length=30)
    postal_code = models.CharField(max_length=10)
    phone_number = models.IntegerField()
    street_address = models.CharField(max_length=50)

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

    student = models.ForeignKey(User, on_delete=models.CASCADE)
    exam_date = models.DateField(default=datetime.date.today())
    exam_time = models.TimeField(default=datetime.time(12,0,0))
    university = models.CharField(max_length=50)   
    exam_name = models.CharField(max_length=50)
    exam_length = models.IntegerField(choices=((1,1),(2,2),(3,3)), db_column = 'exam length (hrs)', default=1)
    session_status = models.CharField(choices=session_status, max_length=20)
    date_purchased = models.DateField(null=True, blank=True)
    cost = models.DecimalField(decimal_places=2, max_digits= 9)
    payment_status = models.CharField(choices=payment_status, max_length=20)

