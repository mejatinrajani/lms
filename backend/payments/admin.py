
from django.contrib import admin
from .models import PaymentGateway, PaymentTransaction, PaymentPlan, StudentPaymentPlan, PaymentReminder

@admin.register(PaymentGateway)
class PaymentGatewayAdmin(admin.ModelAdmin):
    list_display = ['name', 'school', 'is_active', 'created_at']
    list_filter = ['name', 'is_active', 'school']
    search_fields = ['school__name']

@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'student', 'payment_type', 'amount', 'status', 'due_date', 'paid_date']
    list_filter = ['status', 'payment_type', 'gateway', 'created_at']
    search_fields = ['transaction_id', 'student__user__username', 'student__roll_number']
    readonly_fields = ['transaction_id', 'created_at', 'updated_at']

@admin.register(PaymentPlan)
class PaymentPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'school', 'plan_type', 'amount', 'is_active']
    list_filter = ['plan_type', 'is_active', 'school']
    search_fields = ['name', 'school__name']

@admin.register(StudentPaymentPlan)
class StudentPaymentPlanAdmin(admin.ModelAdmin):
    list_display = ['student', 'payment_plan', 'start_date', 'end_date', 'is_active']
    list_filter = ['is_active', 'payment_plan__plan_type']
    search_fields = ['student__user__username', 'student__roll_number']
