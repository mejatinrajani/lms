
from rest_framework import serializers
from .models import Notice

class NoticeSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    school_name = serializers.CharField(source='school.name', read_only=True)
    
    class Meta:
        model = Notice
        fields = ['id', 'title', 'content', 'priority', 'school', 'school_name',
                 'target_classes', 'attachment', 'created_by', 'created_by_name',
                 'is_active', 'publish_date', 'expiry_date', 'created_at']
