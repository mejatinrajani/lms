from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import AttendanceRecord, AttendanceSummary

@receiver(post_save, sender=AttendanceRecord)
def update_attendance_summary(sender, instance, created, **kwargs):
    month = instance.date.month
    year = instance.date.year

    summary, _ = AttendanceSummary.objects.get_or_create(
        student=instance.student,
        month=month,
        year=year,
        defaults={
            'total_days': 0,
            'present_days': 0,
            'absent_days': 0,
            'late_days': 0,
            'excused_days': 0,
            'attendance_percentage': 0
        }
    )

    records = AttendanceRecord.objects.filter(
        student=instance.student,
        date__month=month,
        date__year=year
    )

    summary.total_days = records.count()
    summary.present_days = records.filter(status__short_code='P').count()
    summary.absent_days = records.filter(status__short_code='A').count()
    summary.late_days = records.filter(status__short_code='L').count()
    summary.excused_days = records.filter(status__short_code='E').count()

    if summary.total_days > 0:
        summary.attendance_percentage = round(
            (summary.present_days / summary.total_days) * 100, 2
        )
    else:
        summary.attendance_percentage = 0

    summary.save()