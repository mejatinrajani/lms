
from django.contrib import admin
from .models import Resource, ResourceAccess

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'resource_type', 'uploaded_by', 'is_public', 'created_at')
    list_filter = ('resource_type', 'is_public', 'subject', 'created_at')
    search_fields = ('title', 'description')
    # filter_horizontal = ('allowed_classes',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(ResourceAccess)
class ResourceAccessAdmin(admin.ModelAdmin):
    list_display = ('resource', 'user', 'accessed_at')
    list_filter = ('accessed_at',)
    search_fields = ('resource__title', 'user__username')
