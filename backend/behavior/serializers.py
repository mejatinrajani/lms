from rest_framework import serializers
from .models import BehaviorLog, BehaviorCategory
from core.serializers import StudentProfileSerializer, TeacherProfileSerializer

class BehaviorCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BehaviorCategory
        fields = ['id', 'name', 'description', 'is_positive', 'color', 'points']

class BehaviorLogSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    reported_by_name = serializers.CharField(source='reported_by.full_name', read_only=True)
    class_name = serializers.CharField(source='student.class_assigned.name', read_only=True)
    section_name = serializers.CharField(source='student.section.name', read_only=True)

    class Meta:
        model = BehaviorLog
        fields = [
            'id', 'student', 'student_name', 'student_roll',
            'class_name', 'section_name', 'category',
            'category_name', 'description', 'date_occurred',
            'severity', 'action_taken', 'reported_by',
            'reported_by_name', 'created_at'
        ]
        read_only_fields = ['reported_by', 'created_at']