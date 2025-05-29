
from django.db import models
from core.models import School, Class, Subject, TeacherProfile
from django.core.validators import MinValueValidator, MaxValueValidator

class TimeSlot(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='time_slots')
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_break = models.BooleanField(default=False)
    break_name = models.CharField(max_length=50, blank=True)
    order = models.PositiveIntegerField()
    
    class Meta:
        ordering = ['order']
        unique_together = ['school', 'order']

class Timetable(models.Model):
    DAYS_OF_WEEK = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]
    
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='academic_timetables')
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='academic_timetables')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='academic_timetables', null=True, blank=True)
    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE, related_name='academic_timetables', null=True, blank=True)
    day_of_week = models.CharField(max_length=10, choices=DAYS_OF_WEEK)
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE, related_name='academic_timetables')
    room_number = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['class_assigned', 'day_of_week', 'time_slot']
        ordering = ['day_of_week', 'time_slot__order']

class TeacherAvailability(models.Model):
    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE, related_name='availability')
    day_of_week = models.CharField(max_length=10, choices=Timetable.DAYS_OF_WEEK)
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE)
    is_available = models.BooleanField(default=True)
    reason = models.CharField(max_length=200, blank=True)
    
    class Meta:
        unique_together = ['teacher', 'day_of_week', 'time_slot']
