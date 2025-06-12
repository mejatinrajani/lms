from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import AttendanceRecord, StudentProfile
from .serializers import AttendanceRecordSerializer, BulkAttendanceSerializer
from .permissions import IsTeacherOrPrincipal, IsDeveloperOrPrincipal
from .models import AttendanceStatus
from .serializers import AttendanceStatusSerializer

class AttendanceStatusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AttendanceStatus.objects.all().order_by('id')
    serializer_class = AttendanceStatusSerializer

class AttendanceRecordViewSet(viewsets.ModelViewSet):
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsDeveloperOrPrincipal()]
        elif self.action in ['create', 'bulk_mark']:
            return [IsTeacherOrPrincipal()]
        elif self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    def perform_create(self, serializer):
        teacher_profile = self.request.user.teacherprofile
        serializer.save(marked_by=teacher_profile)

    @action(detail=False, methods=['post'])
    def bulk_mark(self, request):
        serializer = BulkAttendanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        
        with transaction.atomic():
            for rec in data['attendance_data']:
                student_id = rec['student']
                status_id = rec['status']
                
                # Add subject_id retrieval
                subject_id = data.get('subject')
                
                # Create or update logic
                obj, created = AttendanceRecord.objects.update_or_create(
                    student_id=student_id,
                    date=data['date'],
                    subject_id=subject_id,
                    defaults={
                        'class_assigned_id': data['class_assigned'],
                        'section_id': data['section'],
                        'period': data['period'],
                        'status_id': status_id,
                        'remarks': rec.get('remarks', ''),
                        'marked_by': request.user.teacherprofile
                    }
                )
                
        return Response({'status': 'attendance marked'}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def class_report(self, request):
        class_id = request.query_params.get('class_id')
        section_id = request.query_params.get('section_id')
        date = request.query_params.get('date')
        
        if not all([class_id, section_id, date]):
            return Response({'error': 'Missing parameters'}, status=400)
            
        # Get attendance records with related data
        records = AttendanceRecord.objects.filter(
            class_assigned_id=class_id,
            section_id=section_id,
            date=date
        ).select_related('student__user', 'status')
        
        # Get all students in the class/section
        students = StudentProfile.objects.filter(
            class_assigned_id=class_id,
            section_id=section_id
        ).select_related('user')
        
        # Create mapping for quick lookup
        attendance_map = {record.student_id: record for record in records}
        
        report_data = []
        for student in students:
            record = attendance_map.get(student.id)
            if record:
                report_data.append({
                    'student_id': student.id,
                    'student_name': student.user.get_full_name(),
                    'status_code': record.status.short_code,
                    'status': record.status.name,
                    'remarks': record.remarks,
                })
            else:
                report_data.append({
                    'student_id': student.id,
                    'student_name': student.user.get_full_name(),
                    'status_code': '',
                    'status': 'Not Marked',
                    'remarks': '',
                })
        return Response({
            'date': date,
            'class_name': students.first().class_assigned.name if students.exists() else '',
            'section_name': students.first().section.name if students.exists() else '',
            'students': report_data,
            'summary': {
                'total_students': len(report_data),
                'marked': len([s for s in report_data if s['status'] != 'Not Marked']),
                'present': len([s for s in report_data if s['status_code'] == 'P']),
                'absent': len([s for s in report_data if s['status_code'] == 'A']),
                'late': len([s for s in report_data if s['status_code'] == 'L'])
            }
        })