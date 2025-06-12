
import api from './api';

export interface PaymentTransaction {
  id: string;
  transaction_id: string;
  student: number;
  student_name: string;
  student_roll_number: string;
  payment_type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  due_date: string;
  paid_date?: string;
  created_at: string;
}

export interface PaymentPlan {
  id: number;
  name: string;
  plan_type: string;
  amount: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface PaymentInitiateRequest {
  student_id: number;
  payment_type: string;
  amount: number;
  gateway: string;
  description?: string;
  due_date: string;
}

export const paymentService = {
  // Payment Transactions
  getTransactions: () => api.get<PaymentTransaction[]>('/payments/transactions/'),
  
  initiatePayment: (data: PaymentInitiateRequest) => 
    api.post('/payments/transactions/initiate_payment/', data),
  
  confirmPayment: (transactionId: string, gatewayTransactionId: string) =>
    api.post('/payments/transactions/confirm_payment/', {
      transaction_id: transactionId,
      gateway_transaction_id: gatewayTransactionId
    }),
  
  // Payment Plans
  getPaymentPlans: () => api.get<PaymentPlan[]>('/payments/plans/'),
  
  createPaymentPlan: (data: Partial<PaymentPlan>) => 
    api.post<PaymentPlan>('/payments/plans/', data),
  
  updatePaymentPlan: (id: number, data: Partial<PaymentPlan>) =>
    api.put<PaymentPlan>(`/payments/plans/${id}/`, data),
  
  deletePaymentPlan: (id: number) => api.delete(`/payments/plans/${id}/`),
  
  // Student Payment Plans
  getStudentPaymentPlans: () => api.get('/payments/student-plans/'),
  
  assignPaymentPlan: (studentId: number, planId: number, startDate: string) =>
    api.post('/payments/student-plans/', {
      student: studentId,
      payment_plan: planId,
      start_date: startDate
    }),
};
