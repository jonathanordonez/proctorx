from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.http import HttpResponse
from .forms import StudentForm, StudentSettings, ChangeEmailForm, SetStudentPassword, ChangeStudentPassword
from .functions import obtain_exam_schedules, email_password_reset_link, email_activation_token, get_cart_items_number, make_payment
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Student, Order
from .models import Session as StudentSession
from .tokens import account_activation_token, password_reset_token
from django.utils.http import urlsafe_base64_decode
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils.encoding import force_str
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.contrib.sessions.models import Session
from django.views.decorators.csrf import csrf_exempt
from django.core.serializers import serialize
import datetime
import json
import re

def is_user_authenticated(request):
    if request.user.is_authenticated:

        return JsonResponse({'is_authenticated': True,'first_name':request.user.first_name, 'last_name': request.user.last_name, 
                             'email':request.user.email, 'country':request.user.country, 'city':request.user.city,
                             'state':request.user.state,'time_zone':request.user.time_zone,'postal_code':request.user.postal_code,
                             'phone_number':request.user.phone_number,'street_address':request.user.street_address})
    else:
        return JsonResponse({'is_authenticated': False}) 

def sign_in(request):
    data = json.loads((request.body.decode('ascii')))
    email = data['email']
    password = data['password']

    user = authenticate(request, email=email, password=password)

    if(user):
        print('user authenticated: ',user)
        login(request, user)
        return JsonResponse({'status': 'success'})

    else:
        return JsonResponse({'status': 'failure'})
    
def sign_out(request):
    logout(request)
    return HttpResponse(status=200)

def register(request):
    data = json.loads((request.body.decode('ascii')))
    email = data['email']
    student_exists = Student.objects.filter(email=email)
    if (len(student_exists)>0):
        print('this email exists already ',)
        message = {'status':'failure','message':'Email address already exists'}
        response = JsonResponse(message)
        return response
    
    data = {
    'first_name': data['firstName'],
    'last_name': data['lastName'],
    'email': data['email'],
    'password1': data['password'],
    'password2': data['password2']
    }

    form = StudentForm(data)
    if (form.is_valid()):
        try:
            user = form.save()
            user.is_active = True
            user.save()
            json_data = {"status":"successful","description":f"Student created: {email}"}
        except Exception as e:
            print(f"An error occurred while saving the form: {e}")
            json_data = {"status":"failure","description":f"Unable to create student: {email}"}

    else:
        json_data = {"status":"failure","description":f"Unable to create student: {email}"}
    
    response = JsonResponse(json_data)
    response["Access-Control-Allow-Credentials"] = 'true'
    return response
   
def get_csrf_token(request):

    if request.session.session_key:
        return JsonResponse({'status':'failure', 'description':'Session already exists. Therefore, csrftoken cookie should already be in the browser cookies. Clear all cookies in the browser if the issue persists.'});
    request.session.create() # Create a Django session and adds 'sessionid' cookie to the browser
    get_token(request) # Adds 'csrftoken' cookie to the browser
    response = JsonResponse({'status':'successful'})
    response["Access-Control-Allow-Credentials"] = 'true'
    return response

def set_user_details(request):
    data = json.loads((request.body.decode('ascii')))
    if request.user.is_authenticated:
        try:
            student = Student.objects.get(email=request.user.email)
            student.first_name = data['first_name']
            student.last_name = data['last_name']
            student.phone_number = data['phone_number']
            student.street_address = data['street_address']
            student.city = data['city']
            student.state = data['state']
            student.country = data['country']
            student.postal_code = data['postal_code']
            student.save()
            response = JsonResponse({'status':'success'})
        except Exception as e:
            response = JsonResponse({'status':'failure', 'description': 'Error occurred when updating Student information'})
    else:
        response = JsonResponse({'status':'failure', 'description': 'User is not authenticated'})
    
    return response

def change_password(request):
    data = json.loads((request.body.decode('ascii')))
    if request.user.is_authenticated:
        old_password = data['old_password']
        new_password = data['new_password']
        if not request.user.check_password(old_password):
            return JsonResponse({'status':'failure', 'details':'Old password is incorrect'})
        try:
            request.user.set_password(new_password)
            request.user.save()
            user = authenticate(request, email=request.user.email, password=new_password)
            if user is not None:
                print('logged in user: ' , user)
                login(request, request.user)
                return JsonResponse({'status':'success'})
            else:
                return JsonResponse({'status': 'failure', 'details': 'Authentication failed'})
        except Exception as e:
            return JsonResponse({'status':'failure', 'details':'Error in changing the user password'})
    else:
        return JsonResponse({'status':'failure', 'details':'User is not authenticated'})

def get_sessions(request):
    if request.user.is_authenticated:
        try:
            sessions = StudentSession.objects.filter(student=request.user)
            if(len(sessions)>0):
                data = serialize('json', sessions)
                return JsonResponse({'status':'success','data':data})
            else:
                return JsonResponse({'status':'success','data':[]})
            
        except Exception as e:
            print(e)
            return JsonResponse({'status':'failure','description':'Error in querying database'})
    else:
        return JsonResponse({'status':'failure','description':'User is not authenticated'})

def add_to_cart(request):
    data = json.loads((request.body.decode('ascii')))
    print( data)
    exam_date = data['dateSelected'].split(' ')[0].split('-')
    exam_time = data['dateSelected'].split(' ')[1].split(':')
    exam_date_time = datetime.datetime(int(exam_date[0]), int(
        exam_date[1]), int(exam_date[2]), int(exam_time[0]), int(exam_time[1]))
    exam_length = int(data['lengthSelected'].split(' ')[0])
    # print(exam_date)
    # print(exam_time)
    # print(exam_date_time)
    # print(exam_length)
    
    StudentSession.objects.create(student_id=request.user.id, exam_date_time=exam_date_time, university=data['university'], exam_name=data['exam'],
                            exam_length=exam_length, session_status='Cart', date_purchased=None, cost=exam_length * 35, payment_status='pending')
    return JsonResponse({'status':'success', 'message': 'Added to cart'})

def sessions(request):
    is_cart = request.GET.get('cart')
    
    if is_cart:
        cart_sessions = StudentSession.objects.filter(student_id = request.user.id)
        if len(cart_sessions) > 0:
            cart_sessions_array = list(cart_sessions.values())
            print(cart_sessions_array)
            return JsonResponse({'status':'success', 'cart_sessions':cart_sessions_array })
        else:
            return JsonResponse({'status':'success', 'cart_sessions':[] })
    elif not is_cart:
        return

    data = {
        "state": True,
        "page": 10,
        "total_pages": 10,
        "response": [
            {
                "id": 180696724,
                "id_prog_viaje_detalle": None,
                "fecha": "2023-11-07",
                "empresa": "ARENA VERDE S.A.C.",
                "ruc": "10426099280",
                "proveedor": "SANTAMARIA SANDOVAL PEDRO",
                "placa": "M1V-877",
                "tipobus": "CAMIONETA",
                "conductordoc": "75403630",
                "conductor": "CARLOS VIDAL SANTISTEBAN BALLENA",
                "ruta": "MORROPE-GARITA LOTE CENTRO",
                "origen": "MORROPE",
                "destino": "GARITA LOTE CENTRO",
                "horaingreso": "05:50",
                "horasalida": "17:44",
                "horavalidacion": "07:00",
                "fechainicioviaje": "2023-11-07T00:00:00Z",
                "horapartida": "05:30",
                "fechafinviaje": None,
                "horaretorno": "",
                "tipoproveedor": "TERCERO",
                "estado": 3,
                "validado": "SI",
                "liquidado": "SI",
                "comentario": "",
                "cultivo": "SERVICIOS GENERALES",
                "area": "SOPORTE",
                "denominacionceco": "CAMPO",
                "propietario": "SANTAMARIA SANDOVAL PEDRO",
                "propietarioruc": "42609928",
                "responsable": "LEONARDO LUCERO SEGUNDO MANUEL",
                "rutaacceso": "LA COLORADA",
                "solicitante": "ANGELES SANCHEZ LUIS ALBERTO",
                "subzona": "ZONA 1-B",
                "turnoida": "DÍA",
                "turnovuelta": "",
                "zona": "ZONA 1",
                "b_activacionunidad": "NO",
                "departamento": "LAMBAYEQUE",
                "distrito": "MORROPE",
                "duracion": 2,
                "fundonombre": "FUNDO LOTE CENTRO",
                "horallegada": "18:30:00",
                "provincia": "LAMBAYEQUE",
                "versionmovil": "2.0.3"
            },
            {
                "id": 180696725,
                "id_prog_viaje_detalle": None,
                "fecha": "2023-11-07",
                "empresa": "ARENA VERDE S.A.C.",
                "ruc": "10426099280",
                "proveedor": "SANTAMARIA SANDOVAL PEDRO",
                "placa": "T5O-803",
                "tipobus": "CAMIONETA",
                "conductordoc": "46749680",
                "conductor": "ANGEL YOVERA DAMIAN",
                "ruta": "CAMPAMENTO-FUNDO LOTE NORTE",
                "origen": "CAMPAMENTO",
                "destino": "FUNDO LOTE NORTE",
                "horaingreso": "06:37",
                "horasalida": "18:24",
                "horavalidacion": "08:48",
                "fechainicioviaje": "2023-11-07T00:00:00Z",
                "horapartida": "05:30",
                "fechafinviaje": None,
                "horaretorno": "",
                "tipoproveedor": "TERCERO",
                "estado": 3,
                "validado": "SI",
                "liquidado": "SI",
                "comentario": "",
                "cultivo": "SERVICIOS GENERALES",
                "area": "SOPORTE",
                "denominacionceco": "CAMPO",
                "propietario": "SANTISTEBAN",
                "propietarioruc": "76343 83 6",
                "responsable": "LEONARDO",
                "rutaacceso": "DIRECTO",
                "solicitante": "ANGELES SANCHEZ",
                "subzona": "ZONA 1-A",
                "turnoida": "DÍA",
                "turnovuelta": "",
                "zona": "ZONA 1",
                "b_activacionunidad": "NO",
                "departamento": "LAMBAYEQUE",
                "distrito": "MORROPE",
                "duracion": 0,
                "fundonombre": "FUNDO LN",
                "horallegada": "06:30:00",
                "provincia": "LAMBAYEQUE",
                "versionmovil": "2.0.3"
            },
            {
                "id": 180696726,
                "id_prog_viaje_detalle": None,
                "fecha": "2023-11-07",
                "empresa": "AGROVISION PERU S.A.C.",
                "ruc": "20554556192",
                "proveedor": "AGROVISION PERU S.A.C.",
                "placa": "T5M-105",
                "tipobus": "MINIBUS",
                "conductordoc": "16763212",
                "conductor": "HENRRY AQUINO SOSA",
                "ruta": "CAMPAMENTO-FUNDO C5/C6",
                "origen": "CAMPAMENTO",
                "destino": "FUNDO C5/C6",
                "horaingreso": "05:26",
                "horasalida": "06:25",
                "horavalidacion": "05:31",            
                "fechainicioviaje": "2023-11-07T00:00:00Z",
                "horapartida": "05:30",
                "fechafinviaje": None,
                "horaretorno": "",
                "tipoproveedor": "PROPIO",
                "estado": 3,
                "validado": "SI",
                "liquidado": "NO",
                "comentario": "",
                "cultivo": "SERVICIOS GENERALES",
                "area": "CALIFICADOS",
                "denominacionceco": "CAMPO",
                "propietario": "SCOTIABANK PERU SAA",
                "propietarioruc": "20100043140",
                "responsable": "ROCHA BECERRA JOSE FRANCISCO",
                "rutaacceso": "DIRECTO",
                "solicitante": "LEONARDO LUCERO SEGUNDO MANUEL",
                "subzona": "ZONA 1-A",
                "turnoida": "DÍA",
                "turnovuelta": "",
                "zona": "ZONA 1",
                "b_activacionunidad": "NO",
                "departamento": "LAMBAYEQUE",
                "distrito": "MORROPE",
                "duracion": 1,
                "fundonombre": "FUNDO C5/C6",
                "horallegada": "06:30:00",
                "provincia": "LAMBAYEQUE",
                "versionmovil": "2.0.3"
            }
        ]
    }
    return JsonResponse(data)