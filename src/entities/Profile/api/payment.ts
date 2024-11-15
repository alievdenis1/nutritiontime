import useApi from '@/shared/lib/api/use-api'
import type { SubscriptionPayment, CreatePaymentRequest, CreatePaymentResponse } from '../model'

interface CalculateAmountResponse {
 amount: string;
 currency: string;
}

export function calculateAmount(params: {
 payment_type: string;
 months: number;
}) {
 // Убираем обертку params
 return useApi<CalculateAmountResponse>('get', '/payments/calculate', {
  params: {
   payment_type: params.payment_type,
   months: params.months
  }
 })
}

export function cancelPayment(paymentId: number) {
 return useApi<{ message: string }>('post', `/payments/${paymentId}/cancel`)
}

export function createPayment(params: CreatePaymentRequest) {
 return useApi<CreatePaymentResponse>('post', '/payments/prepare', { data: params })
}

export function getUserPayments() {
 return useApi<SubscriptionPayment[]>('get', '/payments')
}