from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def sign_in(request):
    data = json.loads((request.body.decode('ascii')))
    print(data['email'])
    return JsonResponse({'test': 'test'})