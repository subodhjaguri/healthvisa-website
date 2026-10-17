import {Services} from '@healthvisa/utils';

/**
 * Unique Keys for online payments (PhonePe).
 */
export enum PaymentKeys {
	GetPayments = 'getPayments',
	GetPayment = 'getPayment',
}

/**
 * API Endpoints for online payments.
 */
export enum PaymentAPI {
	Payments = '/payments',
}

export const Service: Services = 'order';
