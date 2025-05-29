
from django.contrib import admin
from .models import Notice

@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ('title', 'priority', 'school', 'created_by', 'is_active', 'publish_date')
    list_filter = ('priority', 'school', 'is_active', 'publish_date')
    search_fields = ('title', 'content')
    filter_horizontal = ('target_classes',)
