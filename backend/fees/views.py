
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def fees_status(request):
    return Response({'status': 'Fees module is working'})
