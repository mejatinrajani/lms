
from django.db import models
from django.core.validators import FileExtensionValidator
from core.models import User, TeacherProfile, Subject, Section, Class

class ResourceCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # Icon class name

    def __str__(self):
        return self.name

class Resource(models.Model):
    RESOURCE_TYPES = [
        ('document', 'Document'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('image', 'Image'),
        ('link', 'External Link'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES)
    category = models.ForeignKey(ResourceCategory, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE, null=True, blank=True)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, null=True, blank=True)
    file = models.FileField(
        upload_to='resources/files/',
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'ppt', 'pptx', 'mp4', 'mp3', 'jpg', 'png', 'gif'])]
    )
    external_url = models.URLField(blank=True)
    uploaded_by = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE)
    is_public = models.BooleanField(default=False)  # If True, visible to all classes
    download_count = models.IntegerField(default=0)
    file_size = models.BigIntegerField(null=True, blank=True)  # Size in bytes
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.subject.name}"

    @property
    def file_size_mb(self):
        if self.file_size:
            return round(self.file_size / (1024 * 1024), 2)
        return 0

class ResourceAccess(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='access_logs')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    accessed_at = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length=20)  # 'view', 'download'

    def __str__(self):
        return f"{self.user.username} - {self.resource.title} - {self.action}"
