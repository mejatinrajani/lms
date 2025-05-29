
from django.contrib import admin
from .models import BehaviorLog

@admin.register(BehaviorLog)
class BehaviorLogAdmin(admin.ModelAdmin):
    list_display = ('student', 'behavior_type', 'title', 'date_recorded', 'reported_by', 'parent_notified')
    list_filter = ('behavior_type', 'date_recorded', 'parent_notified')
