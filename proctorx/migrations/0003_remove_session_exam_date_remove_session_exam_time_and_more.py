# Generated by Django 4.1.3 on 2022-12-05 23:22

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('proctorx', '0002_remove_student_username'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='session',
            name='exam_date',
        ),
        migrations.RemoveField(
            model_name='session',
            name='exam_time',
        ),
        migrations.AddField(
            model_name='session',
            name='exam_date_time',
            field=models.DateTimeField(default=datetime.datetime(2022, 12, 5, 18, 22, 48, 364899)),
        ),
    ]
