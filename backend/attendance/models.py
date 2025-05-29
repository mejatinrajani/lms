
from django.db import models
from core.models import User, Class, Subject, StudentProfile

class AttendanceRecord(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
        ('excused', 'Excused'),
    ]
    
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='attendance_records')
    class_session = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='attendance_records')
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    marked_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='marked_attendance')
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['student', 'class_session', 'subject', 'date']
        ordering = ['-date', 'student__user__first_name']

    def __str__(self):
        return f"{self.student.user.get_full_name()} - {self.date} - {self.status}"

class AttendanceSummary(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='attendance_summaries')
    month = models.DateField()  # First day of the month
    total_days = models.IntegerField()
    present_days = models.IntegerField()
    absent_days = models.IntegerField()
    late_days = models.IntegerField()
    excused_days = models.IntegerField()
    attendance_percentage = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['student', 'month']
        ordering = ['-month']

    def __str__(self):
        return f"{self.student.user.get_full_name()} - {self.month.strftime('%B %Y')} - {self.attendance_percentage}%"
