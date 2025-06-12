
import api  from './api';

export interface FeeType {
  id: number;
  name: string;
  description: string;
  is_mandatory: boolean;
  due_frequency: string;
}

export interface FeeStructure {
  id: number;
  fee_type: number;
  fee_type_name: string;
  class_assigned: number;
  class_name: string;
  amount: string;
  academic_year: string;
  late_fee_percentage: string;
  created_at: string;
}

export interface FeeRecord {
  id: number;
  student: number;
  student_name: string;
  student_roll: string;
  fee_structure: number;
  fee_type_name: string;
  class_name: string;
  due_date: string;
  amount: string;
  paid_amount: string;
  late_fee: string;
  outstanding_amount: string;
  status: string;
  payment_date?: string;
  payment_method?: string;
  transaction_id?: string;
  remarks: string;
  is_overdue: boolean;
  payments: Payment[];
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  amount: string;
  payment_method: string;
  transaction_id: string;
  reference_number: string;
  payment_date: string;
  received_by: number;
  received_by_name: string;
  remarks: string;
  created_at: string;
}

export interface FeeSummary {
  total_amount: number;
  paid_amount: number;
  late_fee: number;
  outstanding_amount: number;
  pending_records: number;
  overdue_records: number;
}

export interface PaymentCreate {
  amount: string;
  payment_method: string;
  payment_date: string;
  transaction_id?: string;
  reference_number?: string;
  remarks?: string;
}

export const feesService = {
  // Fee Types
  getFeeTypes: () => api.get<FeeType[]>('/fees/types/'),
  createFeeType: (data: Partial<FeeType>) => api.post<FeeType>('/fees/types/', data),
  updateFeeType: (id: number, data: Partial<FeeType>) => api.put<FeeType>(`/fees/types/${id}/`, data),
  deleteFeeType: (id: number) => api.delete(`/fees/types/${id}/`),

  // Fee Structures
  getFeeStructures: (params?: { class?: number; academic_year?: string }) => 
    api.get<FeeStructure[]>('/fees/structures/', { params }),
  createFeeStructure: (data: Partial<FeeStructure>) => api.post<FeeStructure>('/fees/structures/', data),
  updateFeeStructure: (id: number, data: Partial<FeeStructure>) => 
    api.put<FeeStructure>(`/fees/structures/${id}/`, data),
  deleteFeeStructure: (id: number) => api.delete(`/fees/structures/${id}/`),

  // Fee Records
  getFeeRecords: (params?: { status?: string; student?: number }) => 
    api.get<FeeRecord[]>('/fees/records/', { params }),
  getFeeRecord: (id: number) => api.get<FeeRecord>(`/fees/records/${id}/`),
  createFeeRecord: (data: Partial<FeeRecord>) => api.post<FeeRecord>('/fees/records/', data),
  updateFeeRecord: (id: number, data: Partial<FeeRecord>) => 
    api.put<FeeRecord>(`/fees/records/${id}/`, data),
  deleteFeeRecord: (id: number) => api.delete(`/fees/records/${id}/`),

  // Payments
  makePayment: (feeRecordId: number, paymentData: PaymentCreate) => 
    api.post(`/fees/records/${feeRecordId}/make_payment/`, paymentData),
  getPayments: () => api.get<Payment[]>('/fees/payments/'),
  getPayment: (id: number) => api.get<Payment>(`/fees/payments/${id}/`),

  // Summary
  getFeeSummary: () => api.get<FeeSummary>('/fees/records/summary/'),
};
