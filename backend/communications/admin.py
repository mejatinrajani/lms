
from django.contrib import admin
from .models import Message, MessageRead, ParentTeacherMeeting, ChatRoom, ChatMessage

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['subject', 'sender', 'message_type', 'priority', 'sent_at']
    list_filter = ['message_type', 'priority', 'school', 'sent_at']
    search_fields = ['subject', 'sender__username']

@admin.register(ParentTeacherMeeting)
class ParentTeacherMeetingAdmin(admin.ModelAdmin):
    list_display = ['teacher', 'parent', 'student', 'scheduled_date', 'status']
    list_filter = ['status', 'school', 'scheduled_date']
    search_fields = ['teacher__username', 'parent__username', 'student__username']

@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ['name', 'room_type', 'school', 'created_by', 'created_at']
    list_filter = ['room_type', 'school', 'is_active']
    search_fields = ['name', 'created_by__username']

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['room', 'sender', 'sent_at', 'is_edited']
    list_filter = ['room', 'sent_at', 'is_edited']
    search_fields = ['sender__username', 'content']
