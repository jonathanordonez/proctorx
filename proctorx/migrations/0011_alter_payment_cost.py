# Generated by Django 4.1.3 on 2022-11-12 23:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('proctorx', '0010_alter_payment_date_purchased'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='cost',
            field=models.DecimalField(decimal_places=2, max_digits=9),
        ),
    ]
