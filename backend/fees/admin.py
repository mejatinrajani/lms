
from django.contrib import admin
from .models import FeeStructure, FeePayment

@admin.register(FeeStructure)
class FeeStructureAdmin(admin.ModelAdmin):
    list_display = ('class_level', 'academic_year', 'total_fee', 'created_at')
    
@admin.register(FeePayment)
class FeePaymentAdmin(admin.ModelAdmin):
    list_display = ('student', 'amount_due', 'amount_paid', 'status', 'due_date')
    list_filter = ('status', 'due_date')
