
from django.db import models
from core.models import User, Class, School

class Notice(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='notices')
    target_classes = models.ManyToManyField(Class, blank=True, related_name='notices')
    attachment = models.FileField(upload_to='notices/', blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_notices')
    is_active = models.BooleanField(default=True)
    publish_date = models.DateTimeField()
    expiry_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-publish_date']

    def __str__(self):
        return f"{self.title} - {self.school.name}"
