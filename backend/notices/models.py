
from django.db import models
from django.core.validators import FileExtensionValidator
from core.models import User, StudentProfile, TeacherProfile, Section, Class

class NoticeCategory(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color code
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Notice(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    TARGET_CHOICES = [
        ('all', 'All Users'),
        ('students', 'All Students'),
        ('teachers', 'All Teachers'),
        ('parents', 'All Parents'),
        ('class', 'Specific Class'),
        ('section', 'Specific Section'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.ForeignKey(NoticeCategory, on_delete=models.CASCADE)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    target_audience = models.CharField(max_length=20, choices=TARGET_CHOICES, default='all')
    class_assigned = models.ForeignKey(Class, on_delete=models.CASCADE, null=True, blank=True)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, null=True, blank=True)
    attachment = models.FileField(
        upload_to='notices/attachments/',
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'jpg', 'png'])]
    )
    is_published = models.BooleanField(default=False)
    publish_date = models.DateTimeField(null=True, blank=True)
    expiry_date = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.priority}"

    @property
    def is_active(self):
        from django.utils import timezone
        now = timezone.now()
        if self.expiry_date:
            return self.is_published and now <= self.expiry_date
        return self.is_published

class NoticeRead(models.Model):
    notice = models.ForeignKey(Notice, on_delete=models.CASCADE, related_name='read_receipts')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    read_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['notice', 'user']

    def __str__(self):
        return f"{self.user.username} - {self.notice.title}"



from django.db import models
from django.core.validators import FileExtensionValidator


class NoticeAttachment(models.Model):
    notice = models.ForeignKey(Notice, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(
        upload_to='notices/attachments/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'jpg', 'png'])]
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    @property
    def filename(self):
        return self.file.name.split('/')[-1]

    def __str__(self):
        return self.filename