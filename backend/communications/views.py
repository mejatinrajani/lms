from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def communications_status(request):
    return Response({'status': 'Communications module is working'})