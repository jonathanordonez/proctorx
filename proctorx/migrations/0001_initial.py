# Generated by Django 4.1.3 on 2022-11-11 17:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('email_address', models.CharField(max_length=50)),
                ('country', models.CharField(max_length=30)),
                ('city', models.CharField(max_length=30)),
                ('state', models.CharField(max_length=30)),
                ('time_zone', models.CharField(max_length=30)),
                ('postal_code', models.CharField(max_length=10)),
                ('phone_number', models.IntegerField(max_length=10)),
                ('street_address', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_purchased', models.DateField()),
                ('exam_date', models.DateField()),
                ('university', models.CharField(max_length=50)),
                ('exam_name', models.CharField(max_length=50)),
                ('session_status', models.CharField(choices=[('scheduled', 'scheduled'), ('completed', 'completed'), ('cancelled', 'cancelled')], max_length=20)),
                ('cost', models.FloatField()),
                ('payment_status', models.CharField(choices=[('paid', 'paid'), ('pending', 'pending'), ('rejected', 'rejected')], max_length=20)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='proctorx.student')),
            ],
        ),
    ]
