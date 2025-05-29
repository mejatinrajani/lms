
from rest_framework import serializers
from .models import Resource

class ResourceSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    class_name = serializers.CharField(source='class_assigned.name', read_only=True)
    class_section = serializers.CharField(source='class_assigned.section', read_only=True)
    
    class Meta:
        model = Resource
        fields = ['id', 'title', 'description', 'resource_type', 'file', 'external_link',
                 'class_assigned', 'class_name', 'class_section', 'subject', 'subject_name',
                 'uploaded_by', 'uploaded_by_name', 'is_public', 'created_at', 'updated_at']
