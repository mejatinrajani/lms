from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from . import models

@api_view(['GET'])
def resources_status(request):
    return Response({'status': 'Resources module is working'})

from rest_framework import generics, permissions
from .models import Resource
from .serializers import ResourceSerializer

class ResourceListCreateView(generics.ListCreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Resource.objects.select_related('uploaded_by', 'subject', 'class_assigned')
        
        user = self.request.user
        if user.role == 'teacher':
            queryset = queryset.filter(uploaded_by=user)
        elif user.role == 'student':
            if hasattr(user, 'student_profile'):
                queryset = queryset.filter(
                    models.Q(class_assigned=user.student_profile.class_assigned) |
                    models.Q(is_public=True)
                )
        elif user.role == 'parent':
            if hasattr(user, 'parent_profile'):
                children_classes = user.parent_profile.children.values_list('class_assigned', flat=True)
                queryset = queryset.filter(
                    models.Q(class_assigned__in=children_classes) |
                    models.Q(is_public=True)
                )
        
        # Additional filters
        subject_id = self.request.query_params.get('subject', None)
        class_id = self.request.query_params.get('class', None)
        resource_type = self.request.query_params.get('type', None)
        
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if class_id:
            queryset = queryset.filter(class_assigned_id=class_id)
        if resource_type:
            queryset = queryset.filter(resource_type=resource_type)
            
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class ResourceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]