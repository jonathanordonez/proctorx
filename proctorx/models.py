from django.db import models

class Student(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email_address = models.CharField(max_length=50)
    country = models.CharField(max_length=30)
    city = models.CharField(max_length=30)
    state = models.CharField(max_length=30)
    time_zone = models.CharField(max_length=30)
    postal_code = models.CharField(max_length=10)
    phone_number = models.IntegerField(max_length=10)
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

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    date_purchased = models.DateField()
    exam_date = models.DateField()
    university = models.CharField(max_length=50)   
    exam_name = models.CharField(max_length=50)
    session_status = models.CharField(choices=session_status, max_length=20)
    cost = models.FloatField()
    payment_status = models.CharField(choices=payment_status, max_length=20)



