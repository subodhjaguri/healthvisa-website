import {Services} from '@healthvisa/utils';

/**
 * Unique Keys for Lab Appointment.
 */
export enum LabKeys {
	GetLabAppointments = 'getLabAppointments',
	GetDiagnostics = 'getDiagnostics',
	GetDiagnosticById = 'getDiagnosticById',
	GetLabById = 'getLabById',
	AddLab = 'addLab',
	UpdateLabWithImage = 'updateLab',
	UpdateLabWithoutImage = 'updateLabWithoutImage',
	DeleteLab = 'deleteLab',
	AddDiagnostic = 'addDiagnostic',
	UpdateDiagnosticWithImage = 'updateDiagnostic',
	UpdateDiagnosticWithoutImage = 'updateDiagnosticWithoutImage',
	DeleteDiagnostic = 'deleteDiagnostic',
	GetLabs = 'getLabs',
	UpdateLabAppointments = 'updateLabAppointments',
}

/**
 * API Endpoint for Lab.
 */
export enum LabAPI {
	GetLabAppointments = '/lab-appointments',
	GetDiagnostics = '/diagnostic-items',
	GetDiagnosticById = '/diagnostic-items',
	DeleteDiagnostic = '/diagnostic-items',
	// Upload under "uploads/" so the app's awsServerUrl + image resolves.
	AddDiagnostic = '/diagnostic-item/upload/uploads%2Fdiagnostic-items%2F',
	UpdateDiagnosticWithImage = '/diagnostic-item/update/uploads%2Fdiagnostic-items%2F',
	UpdateDiagnosticWithoutImage = '/diagnostic-item/update/uploads%2Fdiagnostic-items%2F',
	GetLabs = '/labs',
	GetLabById = '/labs',
	DeleteLab = '/labs',
	AddLab = '/lab/upload/uploads%2Flabs%2F',
	UpdateLabWithImage = '/lab/update/uploads%2Flabs%2F',
	UpdateLabWithoutImage = '/lab/update/uploads%2Flabs%2F',
	UpdateLabAppointments = '/lab-appointments',
}

export const Service: Services = 'product';
