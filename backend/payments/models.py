
from django.db import models
from django.contrib.auth import get_user_model
from core.models import School, StudentProfile
import uuid

User = get_user_model()

class PaymentGateway(models.Model):
    GATEWAY_CHOICES = [
        ('stripe', 'Stripe'),
        ('razorpay', 'Razorpay'),
        ('paytm', 'Paytm'),
        ('paypal', 'PayPal'),
    ]
    
    name = models.CharField(max_length=50, choices=GATEWAY_CHOICES)
    is_active = models.BooleanField(default=True)
    api_key = models.CharField(max_length=200)
    secret_key = models.CharField(max_length=200)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='payment_gateways')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['school', 'name']

class PaymentTransaction(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    PAYMENT_TYPE_CHOICES = [
        ('tuition_fee', 'Tuition Fee'),
        ('admission_fee', 'Admission Fee'),
        ('exam_fee', 'Exam Fee'),
        ('transport_fee', 'Transport Fee'),
        ('library_fee', 'Library Fee'),
        ('sports_fee', 'Sports Fee'),
        ('activity_fee', 'Activity Fee'),
        ('other', 'Other'),
    ]
    
    transaction_id = models.UUIDField(default=uuid.uuid4, unique=True)
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='payments')
    gateway_transaction_id = models.CharField(max_length=200, blank=True)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='INR')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    gateway = models.ForeignKey(PaymentGateway, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    due_date = models.DateField()
    paid_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']

class PaymentPlan(models.Model):
    PLAN_TYPE_CHOICES = [
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('half_yearly', 'Half Yearly'),
        ('yearly', 'Yearly'),
        ('one_time', 'One Time'),
    ]
    
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='payment_plans')
    name = models.CharField(max_length=100)
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['school', 'name']

class StudentPaymentPlan(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='payment_plans')
    payment_plan = models.ForeignKey(PaymentPlan, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['student', 'payment_plan']

class PaymentReminder(models.Model):
    transaction = models.ForeignKey(PaymentTransaction, on_delete=models.CASCADE, related_name='reminders')
    reminder_date = models.DateTimeField()
    message = models.TextField()
    is_sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
