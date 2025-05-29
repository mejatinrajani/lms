
from django.contrib import admin
from .models import Resource

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'resource_type', 'subject', 'class_assigned', 'uploaded_by', 'is_public', 'created_at')
    list_filter = ('resource_type', 'subject', 'class_assigned', 'is_public', 'uploaded_by', 'created_at')
    search_fields = ('title', 'description', 'subject__name', 'uploaded_by__first_name', 'uploaded_by__last_name')
    ordering = ('-created_at',)
