
from rest_framework import serializers
from .models import Resource, ResourceCategory
from core.serializers import TeacherProfileSerializer

class ResourceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceCategory
        fields = ['id', 'name', 'description', 'color']

class ResourceSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.full_name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    class_name = serializers.CharField(source='class_assigned.name', read_only=True)
    section_name = serializers.CharField(source='section.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    file_size_mb = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'description', 'file', 'file_type',
            'file_size', 'file_size_mb', 'subject', 'subject_name',
            'class_assigned', 'class_name', 'section', 'section_name',
            'category', 'category_name', 'tags', 'is_public',
            'download_count', 'uploaded_by', 'uploaded_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['uploaded_by', 'file_size', 'download_count', 'created_at', 'updated_at']

    def get_file_size_mb(self, obj):
        return round(obj.file_size / (1024 * 1024), 2) if obj.file_size else 0
