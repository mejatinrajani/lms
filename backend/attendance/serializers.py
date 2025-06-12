from rest_framework import serializers
from .models import AttendanceRecord, AttendanceStatus, AttendanceSummary

class AttendanceStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceStatus
        fields = ['id', 'name', 'short_code', 'is_present', 'color_code']

class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    class_name = serializers.CharField(source='class_assigned.name', read_only=True)
    section_name = serializers.CharField(source='section.name', read_only=True)
    marked_by_name = serializers.CharField(source='marked_by.full_name', read_only=True)
    status_details = AttendanceStatusSerializer(source='status', read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = [
            'id', 'student', 'student_name',
            'subject', 'subject_name', 'class_assigned', 'class_name',
            'section', 'section_name', 'date', 'period',
            'status', 'status_details', 'remarks',
            'marked_by', 'marked_by_name', 'marked_at', 'updated_at'
        ]
        read_only_fields = ['marked_by', 'marked_at', 'updated_at']

class BulkAttendanceSerializer(serializers.Serializer):
    date = serializers.DateField()
    period = serializers.IntegerField()
    subject = serializers.IntegerField(required=False, allow_null=True)  # Made optional
    class_assigned = serializers.IntegerField()
    section = serializers.IntegerField()
    attendance_data = serializers.ListField(
        child=serializers.DictField(child=serializers.IntegerField())
    )

    def validate_attendance_data(self, value):
        for record in value:
            if 'student' not in record or 'status' not in record:
                raise serializers.ValidationError("Each record must have 'student' and 'status'.")
        return value

class AttendanceSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceSummary
        fields = '__all__'