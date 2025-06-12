from django.db import models
from core.models import User, StudentProfile, TeacherProfile, Subject, Section, Class


class AttendanceStatus(models.Model):
    name = models.CharField(max_length=20, unique=True)  # e.g., Present
    short_code = models.CharField(max_length=2, unique=True)  # e.g., 'P', 'A', 'L', 'E'
    is_present = models.BooleanField(default=False)
    color_code = models.CharField(max_length=7, default='#3B82F6')  # For UI, e.g., '#FF0000'

    def __str__(self):
        return self.name

class AttendanceRecord(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, null=True, blank=True)
    date = models.DateField()
    period = models.IntegerField(default=1)
    status = models.ForeignKey(AttendanceStatus, on_delete=models.CASCADE)
    remarks = models.TextField(blank=True)
    marked_by = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE)
    marked_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['student', 'date', 'subject']

    def __str__(self):
        return f"{self.student.full_name} - {self.date} - {self.status}"

class AttendanceSummary(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    month = models.IntegerField()
    year = models.IntegerField()
    total_days = models.IntegerField(default=0)
    present_days = models.IntegerField(default=0)
    absent_days = models.IntegerField(default=0)
    late_days = models.IntegerField(default=0)
    excused_days = models.IntegerField(default=0)
    attendance_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    class Meta:
        unique_together = ['student', 'month', 'year']

    def __str__(self):
        return f"{self.student.full_name} - {self.month}/{self.year} - {self.attendance_percentage}%"

class TeacherAttendance(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('half_day', 'Half Day'),
        ('leave', 'On Leave'),
    ]

    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    check_in_time = models.TimeField(null=True, blank=True)
    check_out_time = models.TimeField(null=True, blank=True)
    remarks = models.TextField(blank=True)
    marked_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['teacher', 'date']

    def __str__(self):
        return f"{self.teacher.full_name} - {self.date} - {self.status}"