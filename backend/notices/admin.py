from django.contrib import admin
from .models import Notice, NoticeAttachment

@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'priority', 'is_published', 'created_at')
    list_filter = ('priority', 'is_published', 'created_at', 'category')
    search_fields = ('title', 'content')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(NoticeAttachment)
class NoticeAttachmentAdmin(admin.ModelAdmin):
    list_display = ('notice', 'filename', 'uploaded_at')
    list_filter = ('uploaded_at',)
    search_fields = ('filename', 'notice__title')