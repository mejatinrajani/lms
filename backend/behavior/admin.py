from django.contrib import admin
from .models import BehaviorCategory, BehaviorLog, BehaviorPoints

@admin.register(BehaviorCategory)
class BehaviorCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_positive', 'points', 'description')
    list_filter = ('is_positive',)
    search_fields = ('name',)

@admin.register(BehaviorLog)
class BehaviorLogAdmin(admin.ModelAdmin):
    list_display = ('student', 'category', 'severity', 'date_occurred', 'reported_by', 'parent_notified')
    list_filter = ('category', 'severity', 'date_occurred', 'parent_notified')
    search_fields = ('student__full_name', 'category__name', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(BehaviorPoints)
class BehaviorPointsAdmin(admin.ModelAdmin):
    list_display = ('student', 'total_points', 'positive_points', 'negative_points', 'last_updated')
    search_fields = ('student__full_name',)
    readonly_fields = ('last_updated',)