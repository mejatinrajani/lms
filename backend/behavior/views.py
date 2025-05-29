
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def behavior_status(request):
    return Response({'status': 'Behavior module is working'})
