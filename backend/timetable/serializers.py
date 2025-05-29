
from rest_framework import serializers
from .models import TimeSlot, Timetable, TeacherAvailability
from core.serializers import SubjectSerializer, TeacherProfileSerializer, ClassSerializer

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ['id', 'start_time', 'end_time', 'is_break', 'break_name', 'order']

class TimetableSerializer(serializers.ModelSerializer):
    subject_details = SubjectSerializer(source='subject', read_only=True)
    teacher_details = TeacherProfileSerializer(source='teacher', read_only=True)
    class_details = ClassSerializer(source='class_assigned', read_only=True)
    time_slot_details = TimeSlotSerializer(source='time_slot', read_only=True)
    
    class Meta:
        model = Timetable
        fields = [
            'id', 'class_assigned', 'subject', 'teacher', 'day_of_week',
            'time_slot', 'room_number', 'is_active', 'created_at',
            'subject_details', 'teacher_details', 'class_details', 'time_slot_details'
        ]

class TeacherAvailabilitySerializer(serializers.ModelSerializer):
    teacher_details = TeacherProfileSerializer(source='teacher', read_only=True)
    time_slot_details = TimeSlotSerializer(source='time_slot', read_only=True)
    
    class Meta:
        model = TeacherAvailability
        fields = [
            'id', 'teacher', 'day_of_week', 'time_slot', 'is_available',
            'reason', 'teacher_details', 'time_slot_details'
        ]
