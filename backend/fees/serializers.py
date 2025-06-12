
from rest_framework import serializers
from .models import FeeType, FeeStructure, FeeRecord, Payment
from core.serializers import StudentProfileSerializer

class FeeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeType
        fields = ['id', 'name', 'description', 'is_mandatory', 'due_frequency']

class FeeStructureSerializer(serializers.ModelSerializer):
    fee_type_name = serializers.CharField(source='fee_type.name', read_only=True)
    class_name = serializers.CharField(source='class_assigned.name', read_only=True)

    class Meta:
        model = FeeStructure
        fields = [
            'id', 'fee_type', 'fee_type_name', 'class_assigned', 'class_name',
            'amount', 'academic_year', 'late_fee_percentage', 'created_at'
        ]

class PaymentSerializer(serializers.ModelSerializer):
    received_by_name = serializers.CharField(source='received_by.get_full_name', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'amount', 'payment_method', 'transaction_id',
            'reference_number', 'payment_date', 'received_by',
            'received_by_name', 'remarks', 'created_at'
        ]
        read_only_fields = ['received_by', 'created_at']

class FeeRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)
    fee_type_name = serializers.CharField(source='fee_structure.fee_type.name', read_only=True)
    class_name = serializers.CharField(source='student.class_assigned.name', read_only=True)
    outstanding_amount = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    payments = PaymentSerializer(many=True, read_only=True)

    class Meta:
        model = FeeRecord
        fields = [
            'id', 'student', 'student_name', 'student_roll',
            'fee_structure', 'fee_type_name', 'class_name',
            'due_date', 'amount', 'paid_amount', 'late_fee',
            'outstanding_amount', 'status', 'payment_date',
            'payment_method', 'transaction_id', 'remarks',
            'is_overdue', 'payments', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class PaymentCreateSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    payment_method = serializers.ChoiceField(choices=Payment.PAYMENT_METHODS)
    payment_date = serializers.DateField()
    transaction_id = serializers.CharField(required=False, allow_blank=True)
    reference_number = serializers.CharField(required=False, allow_blank=True)
    remarks = serializers.CharField(required=False, allow_blank=True)
