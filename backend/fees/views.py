from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Sum, Count
from django.db import transaction
from django.utils import timezone
from decimal import Decimal
from .models import FeeType, FeeStructure, FeeRecord, Payment
from .serializers import (
    FeeTypeSerializer, FeeStructureSerializer, FeeRecordSerializer, 
    PaymentSerializer, PaymentCreateSerializer
)
from core.permissions import IsDeveloper, IsPrincipal, IsTeacher, IsStudent, IsParent

class FeeTypeViewSet(viewsets.ModelViewSet):
    queryset = FeeType.objects.all()
    serializer_class = FeeTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsDeveloper | IsPrincipal]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

class FeeStructureViewSet(viewsets.ModelViewSet):
    queryset = FeeStructure.objects.all()
    serializer_class = FeeStructureSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsDeveloper | IsPrincipal]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = FeeStructure.objects.select_related('fee_type', 'class_assigned')
        class_id = self.request.query_params.get('class', None)
        academic_year = self.request.query_params.get('academic_year', None)

        if class_id:
            queryset = queryset.filter(class_assigned_id=class_id)
        if academic_year:
            queryset = queryset.filter(academic_year=academic_year)

        return queryset

class FeeRecordViewSet(viewsets.ModelViewSet):
    queryset = FeeRecord.objects.all()
    serializer_class = FeeRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsDeveloper | IsPrincipal]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = FeeRecord.objects.select_related(
            'student', 'fee_structure__fee_type', 'student__class_assigned'
        ).prefetch_related('payments')

        user = self.request.user

        if hasattr(user, 'student_profile'):
            queryset = queryset.filter(student=user.student_profile)
        elif hasattr(user, 'parent_profile'):
            queryset = queryset.filter(student__parent=user.parent_profile)
        elif user.user_type in ['principal', 'developer']:
            # Can see all records
            pass
        else:
            queryset = queryset.none()

        # Additional filtering
        status = self.request.query_params.get('status', None)
        student_id = self.request.query_params.get('student', None)

        if status:
            queryset = queryset.filter(status=status)
        if student_id and user.user_type in ['principal', 'developer']:
            queryset = queryset.filter(student_id=student_id)

        return queryset

    @action(detail=True, methods=['post'])
    def make_payment(self, request, pk=None):
        """Make a payment for a fee record"""
        fee_record = self.get_object()
        serializer = PaymentCreateSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        amount = data['amount']

        if amount <= 0:
            return Response({'error': 'Payment amount must be positive'}, status=status.HTTP_400_BAD_REQUEST)

        if amount > fee_record.outstanding_amount:
            return Response({
                'error': f'Payment amount ({amount}) cannot exceed outstanding amount ({fee_record.outstanding_amount})'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                # Create payment record
                payment = Payment.objects.create(
                    fee_record=fee_record,
                    amount=amount,
                    payment_method=data['payment_method'],
                    payment_date=data['payment_date'],
                    transaction_id=data.get('transaction_id', ''),
                    reference_number=data.get('reference_number', ''),
                    remarks=data.get('remarks', ''),
                    received_by=request.user
                )

                # Update fee record
                fee_record.paid_amount += amount
                if fee_record.paid_amount >= (fee_record.amount + fee_record.late_fee):
                    fee_record.status = 'paid'
                    fee_record.payment_date = data['payment_date']
                elif fee_record.paid_amount > 0:
                    fee_record.status = 'partial'
                fee_record.save()

                return Response({
                    'message': 'Payment recorded successfully',
                    'payment': PaymentSerializer(payment).data,
                    'fee_record': FeeRecordSerializer(fee_record).data
                }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get fee summary for current user"""
        user = request.user

        if hasattr(user, 'student_profile'):
            records = FeeRecord.objects.filter(student=user.student_profile)
        elif hasattr(user, 'parent_profile'):
            records = FeeRecord.objects.filter(student__parent=user.parent_profile)
        else:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

        total_due = records.aggregate(
            total=Sum('amount'), 
            paid=Sum('paid_amount'),
            late_fee=Sum('late_fee')
        )

        pending_count = records.filter(status='pending').count()
        overdue_count = records.filter(status='overdue').count()

        return Response({
            'total_amount': total_due['total'] or 0,
            'paid_amount': total_due['paid'] or 0,
            'late_fee': total_due['late_fee'] or 0,
            'outstanding_amount': (total_due['total'] or 0) + (total_due['late_fee'] or 0) - (total_due['paid'] or 0),
            'pending_records': pending_count,
            'overdue_records': overdue_count
        })

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Payment.objects.select_related(
            'fee_record__student', 'received_by'
        )

        user = self.request.user

        if hasattr(user, 'student_profile'):
            queryset = queryset.filter(fee_record__student=user.student_profile)
        elif hasattr(user, 'parent_profile'):
            queryset = queryset.filter(fee_record__student__parent=user.parent_profile)
        elif user.user_type in ['principal', 'developer']:
            # Can see all payments
            pass
        else:
            queryset = queryset.none()

        return queryset

    def perform_create(self, serializer):
        serializer.save(received_by=self.request.user)