from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
from .models import AttendanceRecord, AttendanceSummary
from .serializers import AttendanceRecordSerializer, AttendanceBulkCreateSerializer, AttendanceSummarySerializer
from core.models import StudentProfile, Class, Subject

class AttendanceRecordListView(generics.ListAPIView):
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = AttendanceRecord.objects.select_related(
            'student__user', 'class_session', 'subject', 'marked_by'
        )
        
        # Filter by parameters
        class_id = self.request.query_params.get('class', None)
        subject_id = self.request.query_params.get('subject', None)
        date = self.request.query_params.get('date', None)
        student_id = self.request.query_params.get('student', None)
        
        if class_id:
            queryset = queryset.filter(class_session_id=class_id)
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if date:
            queryset = queryset.filter(date=date)
        if student_id:
            queryset = queryset.filter(student_id=student_id)
            
        return queryset.order_by('-date', 'student__user__first_name')

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_attendance_bulk(request):
    """Mark attendance for multiple students at once"""
    serializer = AttendanceBulkCreateSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        class_session = Class.objects.get(id=data['class_session'])
        subject = None
        if data.get('subject'):
            subject = Subject.objects.get(id=data['subject'])
        
        attendance_records = []
        for record_data in data['attendance_data']:
            student = StudentProfile.objects.get(id=record_data['student_id'])
            
            # Update existing or create new
            attendance, created = AttendanceRecord.objects.update_or_create(
                student=student,
                class_session=class_session,
                subject=subject,
                date=data['date'],
                defaults={
                    'status': record_data['status'],
                    'marked_by': request.user,
                    'remarks': record_data.get('remarks', '')
                }
            )
            attendance_records.append(attendance)
        
        serializer = AttendanceRecordSerializer(attendance_records, many=True)
        return Response({
            'message': f'Attendance marked for {len(attendance_records)} students',
            'records': serializer.data
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def attendance_statistics(request):
    """Get attendance statistics"""
    class_id = request.query_params.get('class', None)
    student_id = request.query_params.get('student', None)
    start_date = request.query_params.get('start_date', None)
    end_date = request.query_params.get('end_date', None)
    
    queryset = AttendanceRecord.objects.all()
    
    if class_id:
        queryset = queryset.filter(class_session_id=class_id)
    if student_id:
        queryset = queryset.filter(student_id=student_id)
    if start_date:
        queryset = queryset.filter(date__gte=start_date)
    if end_date:
        queryset = queryset.filter(date__lte=end_date)
    
    # Calculate statistics
    total_records = queryset.count()
    present_count = queryset.filter(status='present').count()
    absent_count = queryset.filter(status='absent').count()
    late_count = queryset.filter(status='late').count()
    excused_count = queryset.filter(status='excused').count()
    
    attendance_percentage = (present_count / total_records * 100) if total_records > 0 else 0
    
    return Response({
        'total_records': total_records,
        'present_count': present_count,
        'absent_count': absent_count,
        'late_count': late_count,
        'excused_count': excused_count,
        'attendance_percentage': round(attendance_percentage, 2),
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def class_attendance_report(request, class_id):
    """Get attendance report for a class"""
    try:
        class_obj = Class.objects.get(id=class_id)
        students = StudentProfile.objects.filter(class_assigned=class_obj)
        
        date = request.query_params.get('date', timezone.now().date())
        
        report_data = []
        for student in students:
            try:
                attendance = AttendanceRecord.objects.get(
                    student=student,
                    class_session=class_obj,
                    date=date
                )
                status = attendance.status
                remarks = attendance.remarks
            except AttendanceRecord.DoesNotExist:
                status = 'not_marked'
                remarks = ''
            
            report_data.append({
                'student_id': student.id,
                'student_name': student.user.get_full_name(),
                'roll_number': student.roll_number,
                'status': status,
                'remarks': remarks
            })
        
        return Response({
            'class_info': {
                'id': class_obj.id,
                'name': class_obj.name,
                'section': class_obj.section,
            },
            'date': date,
            'attendance_data': report_data
        })
        
    except Class.DoesNotExist:
        return Response({'error': 'Class not found'}, status=status.HTTP_404_NOT_FOUND)

class AttendanceSummaryListView(generics.ListAPIView):
    queryset = AttendanceSummary.objects.all()
    serializer_class = AttendanceSummarySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = AttendanceSummary.objects.select_related('student__user', 'student__class_assigned')
        
        student_id = self.request.query_params.get('student', None)
        class_id = self.request.query_params.get('class', None)
        
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        if class_id:
            queryset = queryset.filter(student__class_assigned_id=class_id)
            
        return queryset.order_by('-month')

from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def attendance_status(request):
    return Response({'status': 'Attendance module is working'})