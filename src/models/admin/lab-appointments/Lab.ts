import {
	ajaxDelete,
	ajaxGet,
	ajaxPatch,
	ajaxPost,
	getApiUrl,
} from '@healthvisa/utils';
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

export interface ILab {
	id: string;
	name: string;
	shortAddress?: string;
	fullAddress: string;
	description: string;
	certificate?: string;
	image?: string;
	availability?: string;
}

export type GetLabsResponse = ILab[];

export function getLabs(): Promise<GetLabsResponse> {
	return ajaxGet<GetLabsResponse>({
		url: getApiUrl(Service, LabAPI.GetLabs),
		query: {filter: '{"order": "createdAt DESC"}'},
	});
}

export function getLabById(id: string): Promise<ILab> {
	return ajaxGet<ILab>({
		url: `${getApiUrl(Service, LabAPI.GetLabById)}/${id}`,
	});
}

const labMultipartHeaders = {
	'Content-Type': 'multipart/form-data',
	Accept: 'application/json',
	type: 'formData',
};

export function addLab(data: FormData) {
	return ajaxPost<FormData, ILab>({
		data,
		url: getApiUrl(Service, LabAPI.AddLab),
		headers: labMultipartHeaders,
	});
}

export interface LabUpdateRequestParams {
	id: string;
	data: FormData;
}
export function updateLabWithImage({data}: LabUpdateRequestParams) {
	return ajaxPost<FormData, ILab>({
		data,
		url: getApiUrl(Service, LabAPI.UpdateLabWithImage),
		headers: labMultipartHeaders,
	});
}

export interface LabUpdateWithoutImageRequestParams {
	data: FormData;
}
export function updateLabWithoutImage({
	data,
}: LabUpdateWithoutImageRequestParams) {
	return ajaxPost<FormData, ILab>({
		data,
		url: getApiUrl(Service, LabAPI.UpdateLabWithoutImage),
		headers: labMultipartHeaders,
	});
}

export interface LabDeleteRequestParams {
	id: string;
}
export function deleteLab({id}: LabDeleteRequestParams): Promise<void> {
	return ajaxDelete<void>({
		url: `${getApiUrl(Service, LabAPI.DeleteLab)}/${id}`,
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
		query: {filter: '{"order": "createdAt DESC"}'},
	});
}

export function getDiagnosticById(id: string): Promise<IDiagnosticItem> {
	return ajaxGet<IDiagnosticItem>({
		url: `${getApiUrl(Service, LabAPI.GetDiagnosticById)}/${id}`,
	});
}

const multipartHeaders = {
	'Content-Type': 'multipart/form-data',
	Accept: 'application/json',
	type: 'formData',
};

/** Create a diagnostic (multipart, with image). */
export function addDiagnostic(data: FormData) {
	return ajaxPost<FormData, IDiagnosticItem>({
		data,
		url: getApiUrl(Service, LabAPI.AddDiagnostic),
		headers: multipartHeaders,
	});
}

export interface DiagnosticUpdateRequestParams {
	id: string;
	data: FormData;
}

/** Update a diagnostic with a new image. */
export function updateDiagnosticWithImage({data}: DiagnosticUpdateRequestParams) {
	return ajaxPost<FormData, IDiagnosticItem>({
		data,
		url: getApiUrl(Service, LabAPI.UpdateDiagnosticWithImage),
		headers: multipartHeaders,
	});
}

export interface DiagnosticUpdateWithoutImageRequestParams {
	data: FormData;
}

/** Update a diagnostic without changing the image. */
export function updateDiagnosticWithoutImage({
	data,
}: DiagnosticUpdateWithoutImageRequestParams) {
	return ajaxPost<FormData, IDiagnosticItem>({
		data,
		url: getApiUrl(Service, LabAPI.UpdateDiagnosticWithoutImage),
		headers: multipartHeaders,
	});
}

export interface DiagnosticDeleteRequestParams {
	id: string;
}
export function deleteDiagnostic({
	id,
}: DiagnosticDeleteRequestParams): Promise<void> {
	return ajaxDelete<void>({
		url: `${getApiUrl(Service, LabAPI.DeleteDiagnostic)}/${id}`,
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
