
from django.db import models
from django.contrib.auth import get_user_model
from core.models import School, Class, Subject
import uuid

User = get_user_model()

class Message(models.Model):
    MESSAGE_TYPES = [
        ('individual', 'Individual'),
        ('group', 'Group'),
        ('broadcast', 'Broadcast'),
        ('announcement', 'Announcement'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipients = models.ManyToManyField(User, related_name='received_messages', blank=True)
    subject = models.CharField(max_length=200)
    content = models.TextField()
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default='individual')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='messages')
    class_recipients = models.ManyToManyField(Class, blank=True, related_name='messages')
    attachment = models.FileField(upload_to='message_attachments/', blank=True, null=True)
    is_read = models.BooleanField(default=False)
    is_urgent = models.BooleanField(default=False)
    scheduled_send = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-sent_at']

class MessageRead(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='read_status')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    read_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['message', 'user']

class ParentTeacherMeeting(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rescheduled', 'Rescheduled'),
    ]
    
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='teacher_meetings')
    parent = models.ForeignKey(User, on_delete=models.CASCADE, related_name='parent_meetings')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='student_meetings')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='meetings')
    subject = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    scheduled_date = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=30)
    meeting_link = models.URLField(blank=True)
    meeting_room = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-scheduled_date']

class ChatRoom(models.Model):
    ROOM_TYPES = [
        ('class', 'Class Chat'),
        ('subject', 'Subject Chat'),
        ('private', 'Private Chat'),
        ('group', 'Group Chat'),
    ]
    
    name = models.CharField(max_length=100)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='chat_rooms')
    members = models.ManyToManyField(User, related_name='chat_rooms')
    class_related = models.ForeignKey(Class, on_delete=models.CASCADE, null=True, blank=True)
    subject_related = models.ForeignKey(Subject, on_delete=models.CASCADE, null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_chat_rooms')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ChatMessage(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_messages')
    content = models.TextField()
    attachment = models.FileField(upload_to='chat_attachments/', blank=True, null=True)
    reply_to = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    is_edited = models.BooleanField(default=False)
    edited_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['sent_at']
