/** Status of a doctor or lab appointment (same lifecycle for both). */
export const APPOINTMENT_STATUSES = [
	'placed',
	'appointment booked',
	'completed',
	'cancelled',
	'rejected',
];

export const APPOINTMENT_STATUS_OPTIONS = APPOINTMENT_STATUSES.map((s) => ({
	value: s,
	label: s,
}));
