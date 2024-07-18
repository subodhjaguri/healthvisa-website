import {Services} from '@healthvisa/utils';

/**
 * Unique Keys for Lab Appointment.
 */
export enum LabKeys {
	GetLabAppointments = 'getLabAppointments',
	GetDiagnostics = 'getDiagnostics',
	UpdateLabAppointments = 'updateLabAppointments',
}

/**
 * API Endpoint for Lab.
 */
export enum LabAPI {
	GetLabAppointments = '/lab-appointments',
	GetDiagnostics = '/diagnostic-items',
	UpdateLabAppointments = '/lab-appointments',
}

export const Service: Services = 'product';
