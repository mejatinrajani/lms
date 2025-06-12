
from rest_framework import serializers
from .models import Notice, NoticeCategory, NoticeAttachment
from core.serializers import UserSerializer

class NoticeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NoticeCategory
        fields = ['id', 'name', 'color', 'description']

class NoticeAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoticeAttachment
        fields = ['id', 'file', 'filename', 'file_size', 'uploaded_at']

class NoticeSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    attachments = NoticeAttachmentSerializer(many=True, read_only=True)
    target_classes_names = serializers.SerializerMethodField()
    target_sections_names = serializers.SerializerMethodField()

    class Meta:
        model = Notice
        fields = [
            'id', 'title', 'content', 'category', 'category_name',
            'priority', 'is_global', 'target_classes', 'target_classes_names',
            'target_sections', 'target_sections_names', 'target_roles',
            'is_published', 'publish_date', 'expiry_date', 'created_by',
            'created_by_name', 'attachments', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    def get_target_classes_names(self, obj):
        return [cls.name for cls in obj.target_classes.all()]

    def get_target_sections_names(self, obj):
        return [f"{section.class_assigned.name}-{section.name}" for section in obj.target_sections.all()]
