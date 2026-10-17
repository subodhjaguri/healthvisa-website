import {ajaxGet, ajaxPost, getApiUrl} from '@healthvisa/utils';
import {PaymentAPI, Service} from './api';

export interface IPaymentRefund {
	merchantRefundId: string;
	/** Paise. */
	amount: number;
	state: 'PENDING' | 'COMPLETED' | 'FAILED';
	reason?: string;
	by?: string;
	at: string;
	errorCode?: string;
}

/** One online payment attempt (amounts in paise, as stored by the API). */
export interface IPayment {
	id: string;
	merchantOrderId: string;
	purpose: 'membership' | 'order' | 'lab';
	refId: string;
	userId: string;
	amount: number;
	state: string;
	applyState?: string;
	applyAttempts?: number;
	applyError?: string | null;
	transactionId?: string;
	paymentMode?: string;
	gatewayAmount?: number;
	refundState?: string;
	refundedAmount?: number;
	refunds?: IPaymentRefund[];
	errorCode?: string;
	metadata?: {label?: string};
	createdAt: string;
	updatedAt?: string;
}

export interface IPaymentEvent {
	id: string;
	kind: string;
	detail?: string;
	data?: Record<string, unknown>;
	createdAt: string;
}

export function getPayments(): Promise<IPayment[]> {
	return ajaxGet<IPayment[]>({
		url: getApiUrl(Service, PaymentAPI.Payments),
		query: {filter: '{"order": "createdAt DESC", "limit": 1000}'},
	});
}

export function getPayment(id: string): Promise<IPayment & {events: IPaymentEvent[]}> {
	return ajaxGet<IPayment & {events: IPaymentEvent[]}>({
		url: `${getApiUrl(Service, PaymentAPI.Payments)}/${id}`,
	});
}

/** Ask PhonePe again now (also finishes a half-applied payment). */
export function recheckPayment(id: string): Promise<IPayment> {
	return ajaxPost<Record<string, never>, IPayment>({
		data: {},
		url: `${getApiUrl(Service, PaymentAPI.Payments)}/${id}/recheck`,
	});
}

/** Refund in ₹ (omit `amount` for everything left). */
export function refundPayment(id: string, body: {amount?: number; reason: string}): Promise<IPayment> {
	return ajaxPost<typeof body, IPayment>({
		data: body,
		url: `${getApiUrl(Service, PaymentAPI.Payments)}/${id}/refund`,
	});
}

export function checkRefunds(id: string): Promise<IPayment> {
	return ajaxPost<Record<string, never>, IPayment>({
		data: {},
		url: `${getApiUrl(Service, PaymentAPI.Payments)}/${id}/refund-check`,
	});
}
