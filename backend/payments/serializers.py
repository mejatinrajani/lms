
from rest_framework import serializers
from .models import PaymentTransaction, PaymentGateway, PaymentPlan, StudentPaymentPlan
from core.serializers import StudentProfileSerializer

class PaymentGatewaySerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentGateway
        fields = ['id', 'name', 'is_active', 'created_at']

class PaymentTransactionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    student_roll_number = serializers.CharField(source='student.roll_number', read_only=True)
    
    class Meta:
        model = PaymentTransaction
        fields = [
            'id', 'transaction_id', 'student', 'student_name', 'student_roll_number',
            'gateway_transaction_id', 'payment_type', 'amount', 'currency', 
            'status', 'description', 'due_date', 'paid_date', 'created_at'
        ]
        read_only_fields = ['transaction_id', 'created_at']

class PaymentPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentPlan
        fields = [
            'id', 'name', 'plan_type', 'amount', 'description', 
            'is_active', 'created_at'
        ]

class StudentPaymentPlanSerializer(serializers.ModelSerializer):
    payment_plan_details = PaymentPlanSerializer(source='payment_plan', read_only=True)
    student_details = StudentProfileSerializer(source='student', read_only=True)
    
    class Meta:
        model = StudentPaymentPlan
        fields = [
            'id', 'student', 'payment_plan', 'start_date', 'end_date',
            'is_active', 'created_at', 'payment_plan_details', 'student_details'
        ]

class PaymentInitiateSerializer(serializers.Serializer):
    student_id = serializers.IntegerField()
    payment_type = serializers.ChoiceField(choices=PaymentTransaction.PAYMENT_TYPE_CHOICES)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    gateway = serializers.CharField()
    description = serializers.CharField(required=False)
    due_date = serializers.DateField()
