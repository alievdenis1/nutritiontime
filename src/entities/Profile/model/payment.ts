// model/payment.ts

// Обновляем типы платежей
export type PaymentType = 'ton' | 'usdt' | 'yummy' | 'gram' | 'upay';

// Обновляем интерфейс SubscriptionPayment
export interface SubscriptionPayment {
 id: number
 telegram_id: number
 status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED'
 payment_url: string | null
 wallet_address: string | null
 message_id: number | null
 expires_at: string
 ton_transaction_hash: string | null
 completed_at: string | null
 amount_ton: string | null
 amount_usdt: string | null // Добавлено
 amount_gram: string | null // Добавлено
 amount_yummy: string | null // Добавлено
 crypto_amount: string | null;  // Добавлено
 crypto_currency: string | null; // Добавлено
 amount_rub: string
 payment_comment: string | null
 payment_type: PaymentType
 payment_status: string
 created_at: string
 updated_at: string
 months: number
}

export interface CreatePaymentRequest {
 telegram_id: number;
 payment_type: PaymentType;
 months: number;
}

export interface CreatePaymentResponse {
 paymentUrl: string;
 payment_id: number;
}