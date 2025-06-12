from rest_framework import serializers
from .models import TimeSlot, Timetable

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ['id', 'period_number', 'start_time', 'end_time']

class TimetableSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_assigned.name', read_only=True)
    section_name = serializers.CharField(source='section.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = Timetable
        fields = [
            'id', 'class_assigned', 'class_name',
            'section', 'section_name', 'day_of_week', 'time_slot',
            'subject', 'teacher', 'room_number', 'academic_year',
            'is_active', 'created_by', 'created_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']