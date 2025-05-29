from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta
from .models import AttendanceRecord, AttendanceSummary

@receiver(post_save, sender=AttendanceRecord)
def update_attendance_summary(sender, instance, created, **kwargs):
    # Get the first day of the month for the attendance record
    month_start = instance.date.replace(day=1)
    
    # Get or create the summary for this student and month
    summary, created = AttendanceSummary.objects.get_or_create(
        student=instance.student,
        month=month_start,
        defaults={
            'total_days': 0,
            'present_days': 0,
            'absent_days': 0,
            'late_days': 0,
            'excused_days': 0,
            'attendance_percentage': 0
        }
    )
    
    # Recalculate all stats for the month
    records = AttendanceRecord.objects.filter(
        student=instance.student,
        date__month=instance.date.month,
        date__year=instance.date.year
    )
    
    summary.total_days = records.count()
    summary.present_days = records.filter(status='present').count()
    summary.absent_days = records.filter(status='absent').count()
    summary.late_days = records.filter(status='late').count()
    summary.excused_days = records.filter(status='excused').count()
    
    if summary.total_days > 0:
        summary.attendance_percentage = round(
            (summary.present_days / summary.total_days) * 100, 
            2
        )
    
    summary.save()