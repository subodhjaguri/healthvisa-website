import {Services} from '@healthvisa/utils';

/**
 * Unique Keys for Lab Appointment.
 */
export enum LabKeys {
	GetLabAppointments = 'getLabAppointments',
	GetDiagnostics = 'getDiagnostics',
	GetLabs = 'getLabs',
	UpdateLabAppointments = 'updateLabAppointments',
}

/**
 * API Endpoint for Lab.
 */
export enum LabAPI {
	GetLabAppointments = '/lab-appointments',
	GetDiagnostics = '/diagnostic-items',
	GetLabs = '/labs',
	UpdateLabAppointments = '/lab-appointments',
}

export const Service: Services = 'product';
