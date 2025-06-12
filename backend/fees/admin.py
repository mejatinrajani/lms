
from django.contrib import admin
from .models import FeeType, FeeStructure, FeeRecord, Payment

@admin.register(FeeType)
class FeeTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_mandatory', 'due_frequency')
    list_filter = ('is_mandatory', 'due_frequency')
    search_fields = ('name',)

@admin.register(FeeStructure)
class FeeStructureAdmin(admin.ModelAdmin):
    list_display = ('fee_type', 'class_assigned', 'amount', 'academic_year', 'created_at')
    list_filter = ('academic_year', 'fee_type')
    search_fields = ('fee_type__name', 'class_assigned__name')

@admin.register(FeeRecord)
class FeeRecordAdmin(admin.ModelAdmin):
    list_display = ('student', 'fee_structure', 'amount', 'paid_amount', 'status', 'due_date')
    list_filter = ('status', 'due_date', 'fee_structure__fee_type')
    search_fields = ('student__full_name', 'student__roll_number')
    readonly_fields = ('outstanding_amount', 'is_overdue')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('fee_record', 'amount', 'payment_method', 'payment_date', 'received_by')
    list_filter = ('payment_method', 'payment_date')
    search_fields = ('fee_record__student__full_name', 'transaction_id', 'reference_number')
