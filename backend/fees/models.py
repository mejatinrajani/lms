
from django.db import models
from decimal import Decimal
from core.models import User, StudentProfile

class FeeType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_mandatory = models.BooleanField(default=True)
    due_frequency = models.CharField(max_length=20, choices=[
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('half_yearly', 'Half Yearly'),
        ('yearly', 'Yearly'),
        ('one_time', 'One Time'),
    ], default='monthly')

    def __str__(self):
        return self.name

class FeeStructure(models.Model):
    fee_type = models.ForeignKey(FeeType, on_delete=models.CASCADE)
    class_assigned = models.ForeignKey('core.Class', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    academic_year = models.CharField(max_length=9)  # e.g., "2023-2024"
    late_fee_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('5.00'))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['fee_type', 'class_assigned', 'academic_year']

    def __str__(self):
        return f"{self.fee_type.name} - {self.class_assigned.name} - {self.amount}"

class FeeRecord(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
        ('cancelled', 'Cancelled'),
        ('partial', 'Partially Paid'),
    ]

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    fee_structure = models.ForeignKey(FeeStructure, on_delete=models.CASCADE)
    due_date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    late_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_date = models.DateField(null=True, blank=True)
    payment_method = models.CharField(max_length=50, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True)
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def outstanding_amount(self):
        return self.amount + self.late_fee - self.paid_amount

    @property
    def is_overdue(self):
        from django.utils import timezone
        return timezone.now().date() > self.due_date and self.status != 'paid'

    def __str__(self):
        return f"{self.student.full_name} - {self.fee_structure.fee_type.name} - {self.status}"

class Payment(models.Model):
    PAYMENT_METHODS = [
        ('cash', 'Cash'),
        ('bank_transfer', 'Bank Transfer'),
        ('cheque', 'Cheque'),
        ('online', 'Online Payment'),
        ('card', 'Card Payment'),
    ]

    fee_record = models.ForeignKey(FeeRecord, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    transaction_id = models.CharField(max_length=100, blank=True)
    reference_number = models.CharField(max_length=100, blank=True)
    payment_date = models.DateField()
    received_by = models.ForeignKey(User, on_delete=models.CASCADE)
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.fee_record.student.full_name} - {self.amount} - {self.payment_date}"
