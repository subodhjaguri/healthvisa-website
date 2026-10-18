/**
 * Online payment state of a doctor or lab booking (`paymentStatus`, set by the
 * API). Bookings made before online payment have none: shown as offline.
 */
export const BOOKING_PAYMENT: Record<string, {label: string; color: string}> = {
	paid: {label: 'Paid online', color: 'green'},
	pending: {label: 'Paying online…', color: 'gold'},
	unpaid: {label: 'Awaiting payment', color: 'blue'},
	failed: {label: 'Payment failed', color: 'red'},
	offline: {label: 'Pay at visit', color: 'default'},
	refund_pending: {label: 'Refund in progress', color: 'gold'},
	refunded: {label: 'Refunded', color: 'default'},
	refund_failed: {label: 'Refund failed', color: 'red'},
};

export const bookingPayment = (paymentStatus?: string) =>
	BOOKING_PAYMENT[paymentStatus ?? 'offline'] ?? BOOKING_PAYMENT.offline;

/** Filter options, in the order an admin cares about them. */
export const BOOKING_PAYMENT_OPTIONS = Object.values(BOOKING_PAYMENT).map(({label}) => ({
	value: label,
	label,
}));

/** Confirming one of these needs "pay at visit" (it isn't paid yet). */
export const needsPayAtVisit = (paymentStatus?: string) =>
	paymentStatus === 'unpaid' || paymentStatus === 'failed';

/** Shown before cancelling or rejecting a booking paid online. */
export const refundNotice = (paymentStatus: string | undefined, amount: string) =>
	paymentStatus === 'paid'
		? `This booking was paid online: the member gets a full refund of ${amount}.`
		: undefined;
