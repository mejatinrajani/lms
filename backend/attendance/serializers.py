
from rest_framework import serializers
from .models import AttendanceRecord, AttendanceSummary
from core.serializers import StudentProfileSerializer

class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)
    marked_by_name = serializers.CharField(source='marked_by.get_full_name', read_only=True)
    class_name = serializers.CharField(source='class_session.name', read_only=True)
    class_section = serializers.CharField(source='class_session.section', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    
    class Meta:
        model = AttendanceRecord
        fields = ['id', 'student', 'student_name', 'student_roll', 'class_session', 
                 'class_name', 'class_section', 'subject', 'subject_name', 'date', 
                 'status', 'marked_by', 'marked_by_name', 'remarks', 'created_at']

class AttendanceBulkCreateSerializer(serializers.Serializer):
    class_session = serializers.IntegerField()
    subject = serializers.IntegerField(required=False, allow_null=True)
    date = serializers.DateField()
    attendance_data = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )
    
    def validate_attendance_data(self, value):
        for record in value:
            if 'student_id' not in record or 'status' not in record:
                raise serializers.ValidationError(
                    "Each attendance record must have 'student_id' and 'status'"
                )
            if record['status'] not in ['present', 'absent', 'late', 'excused']:
                raise serializers.ValidationError(
                    "Status must be one of: present, absent, late, excused"
                )
        return value

class AttendanceSummarySerializer(serializers.ModelSerializer):
    student_data = StudentProfileSerializer(source='student', read_only=True)
    month_name = serializers.SerializerMethodField()
    
    class Meta:
        model = AttendanceSummary
        fields = ['id', 'student', 'student_data', 'month', 'month_name', 
                 'total_days', 'present_days', 'absent_days', 'late_days', 
                 'excused_days', 'attendance_percentage', 'created_at']
    
    def get_month_name(self, obj):
        return obj.month.strftime('%B %Y')
