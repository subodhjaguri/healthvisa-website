import {ajaxGet, ajaxPatch, ajaxPost, getApiUrl} from '@healthvisa/utils';
import {LabAPI, Service} from './api';

export interface IItems {
	id: string;
	name: string;
	desc: string;
	img: string;
	type: string;
	metadata: any;
	price: number;
	quantity: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface ILabAppointment {
	userId: string;
	labId: string;
	diagnosticId: string;
	id: string;
	tests: string[];
	visit: string;
	date: string;
	slots: string[];
	prescription: string;
	amount: number;
	status: string;
	healthPackage: string;
	optionSelected: string;
	createdAt: string;
	updatedAt: string;
	metadata: any;
}

export type GetLabAppointmentResponse = ILabAppointment[];
/**
 * Get all Lab appointmentss
 */
export function getLabAppointments(): Promise<GetLabAppointmentResponse> {
	return ajaxGet<GetLabAppointmentResponse>({
		url: getApiUrl(Service, LabAPI.GetLabAppointments),
		query: {
			filter: `{"order": "createdAt DESC"}`,
		},
	});
}

export type VisitType = 'home' | 'lab' | 'center';

export interface IDiagnosticItem {
	name: string;
	id: string;
	image: string;
	discount: number;
	availableVisits: VisitType[];
	labs: string[];
	createdAt: string;
	updatedAt: string;
	metadata: any;
}
/**
 * Response Model for `getCategories()` call
 */

export type GetDiagnosticItemResponse = IDiagnosticItem[];
/**
 * Get all diagnostic Items
 */
export function getDiagnosticItems(): Promise<GetDiagnosticItemResponse> {
	return ajaxGet<GetDiagnosticItemResponse>({
		url: getApiUrl(Service, LabAPI.GetDiagnostics),
	});
}

// Update Lab appointment status
export interface LabAppointmentUpdateRequestParams {
	id: string;
	status?: string;
	metadata?: any;
}

export function updateLabAppointment({
	...requestBody
}: LabAppointmentUpdateRequestParams): Promise<any> {
	const {id, status, metadata} = requestBody;

	// Use Record<string, unknown> or explicitly define the types for the data object
	const data: Record<string, unknown> = {
		id,
		status,
		metadata,
	};

	return ajaxPatch<Record<string, unknown>, any>({
		data,
		url: `${getApiUrl(Service, LabAPI.UpdateLabAppointments)}/${id}`,
	});
}
