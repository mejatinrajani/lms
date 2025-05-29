
from rest_framework import serializers
from .models import BehaviorLog

class BehaviorLogSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    reported_by_name = serializers.CharField(source='reported_by.get_full_name', read_only=True)
    
    class Meta:
        model = BehaviorLog
        fields = '__all__'
