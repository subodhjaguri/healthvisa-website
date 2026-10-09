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

/** The current status is included so a controlled Select can display it. */
export const availableAppointmentStatuses = (current: string): string[] => {
	const next: Record<string, string[]> = {
		placed: ['appointment booked', 'rejected', 'cancelled'],
		'appointment booked': ['completed', 'cancelled'],
		completed: [],
		rejected: [],
		cancelled: [],
	};
	return [current, ...(next[current] ?? [])];
};

export const appointmentStatusColor: Record<string, string> = {
	placed: 'blue',
	'appointment booked': 'cyan',
	completed: 'green',
	cancelled: 'red',
	rejected: 'orange',
};
