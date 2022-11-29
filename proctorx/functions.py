from .models import Session
import datetime
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def obtain_exam_schedules(date_input, time_input):
    suggestions=[]
    # Create date object
    date_split = date_input.split("-")
    year = int(date_split[0])
    month = int(date_split[1])
    day = int(date_split[2])
    time_split = time_input.split(":")
    hour = int(time_split[0])
    minute = int(time_split[1])

    # to-do: ensure hour doesn't go beyond 23

    if(minute > 30):
        # round up first suggestion to the next hour
        suggestions.append(datetime.datetime(year, month, day, hour + 1, 0, 0))
        suggestions.append(datetime.datetime(year, month, day, hour, 30, 0))
        suggestions.append(datetime.datetime(year, month, day, hour - 1, 30, 0))
        suggestions.append(datetime.datetime(year, month, day, hour - 1, 0, 0))
     
    elif(minute < 30):
        #round up first suggestion to the current hour
        suggestions.append(datetime.datetime(year, month, day, hour, 0, 0))
        suggestions.append(datetime.datetime(year, month, day, hour, 30, 0))
        suggestions.append(datetime.datetime(year, month, day, hour + 1, 0))
        suggestions.append(datetime.datetime(year, month, day, hour - 1, 30, 0))

    else:
        # keep the 30 minutes
        suggestions.append(datetime.datetime(year, month, day, hour, minute, 0))
        suggestions.append(datetime.datetime(year, month, day, hour + 1, 0, 0))
        suggestions.append(datetime.datetime(year, month, day, hour - 1, 30, 0))
        suggestions.append(datetime.datetime(year, month, day, hour - 1, 0, 0))


    return suggestions

def send_email(email_id, email_message, **kwargs):
    message = Mail(
    from_email = 'proctorsx@gmail.com',
    to_emails = 'proctorsx@gmail.com',
    subject = 'Testing Sendgrid from Proctor',
    plain_text_content = 'this is the plain text contenttt',
    html_content = '<h1>HEllo Proctor<h1>'
              )
    try: 
        sg = SendGridAPIClient(os.environ['SENDGRID_API_KEY'])
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e.message)
    
def email_password_reset_link(email_id, student_base_64, student_token):
    message = Mail(
    from_email = 'proctorsx@gmail.com',
    to_emails = email_id,
    subject = 'Activate your account',
    plain_text_content = 'this is the plain text contenttt',
    html_content = '<h1>Hello Proctor<h1>'
                    '<p>Use the following <a href=http://127.0.0.1:8000/set_password/'+ str(student_base_64) + '/' + str(student_token) + '>link</a> to activate your account<p>'
                    '<p>Use the following url if the link fails: http://127.0.0.1:8000/set_password/' + str(student_base_64) + '/' + str(student_token)
              )
    try: 
        sg = SendGridAPIClient(os.environ['SENDGRID_API_KEY'])
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e.message)

def email_activation_token(email_id, student_base_64, student_token):
    message = Mail(
    from_email = 'proctorsx@gmail.com',
    to_emails = email_id,
    subject = 'Activate your account',
    plain_text_content = 'this is the plain text contenttt',
    html_content = '<h1>Hello Proctor<h1>'
                    '<p>Use the following <a href=http://127.0.0.1:8000/activate_account/'+ str(student_base_64) + '/' + str(student_token) + '>link</a> to activate your account<p>'
                    '<p>Use the following url if the link fails: http://127.0.0.1:8000/set_password/' + str(student_base_64) + '/' + str(student_token)
              )
    try: 
        sg = SendGridAPIClient(os.environ['SENDGRID_API_KEY'])
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e.message)

def list_to_dict(list):
    keys = []
    values = []
    for element in list:
        keys.append(element.split('=')[0])
        values.append(element.split('=')[1])
    zip_obj = zip(keys, values)
    return dict(zip_obj)