
from django.db import models
from core.models import User, StudentProfile

class BehaviorLog(models.Model):
    BEHAVIOR_TYPE_CHOICES = [
        ('positive', 'Positive'),
        ('negative', 'Negative'),
        ('neutral', 'Neutral'),
    ]
    
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='behavior_logs')
    behavior_type = models.CharField(max_length=20, choices=BEHAVIOR_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    date_recorded = models.DateField()
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_behaviors')
    action_taken = models.TextField(blank=True, null=True)
    parent_notified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_recorded']

    def __str__(self):
        return f"{self.student.user.get_full_name()} - {self.title}"
