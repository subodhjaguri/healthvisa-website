import {ajaxDelete, ajaxGet, ajaxPost, getApiUrl} from '@healthvisa/utils';
import {SymptomsAPI, Service} from './api';

export interface ISymptom {
	id: string;
	name: string;
	image: string;
	categoryId: string[];
	order?: number;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Response Model for `getSymptoms()` call
 */
export type GetSymptomsResponse = ISymptom[];

/**
 * Get all symptoms
 */
export function getSymptoms(): Promise<GetSymptomsResponse> {
	return ajaxGet<GetSymptomsResponse>({
		url: getApiUrl(Service, SymptomsAPI.GetSymptoms),
		query: {filter: '{"order": "order ASC"}'},
	});
}

export interface GetSymptomByIdRequestParams {
	/** Symptom Id */
	id: string;
}

/**
 * Type for get Symptom response
 */
export type GetSymptomByIdResponse = ISymptom;

/**
 * Get single Symptom by Id
 */
export function getSymptomById({
	id,
}: GetSymptomByIdRequestParams): Promise<GetSymptomByIdResponse> {
	return ajaxGet<GetSymptomByIdResponse>({
		url: getApiUrl(Service, `${SymptomsAPI.GetSymptomById}/${id}`),
	});
}

/**
 * Add Symptom
 */
export function addSymptom(data: FormData) {
	return ajaxPost<FormData, ISymptom>({
		data,
		url: getApiUrl(Service, SymptomsAPI.AddSymptom),
		headers: {
			'Content-Type': 'multipart/form-data',
			Accept: 'application/json',
			type: 'formData',
		},
	});
}

/**
 * Request Parameter for Deleting a Symptom
 */
export interface SymptomDeleteRequestParams {
	id: string;
}

export function deleteSymptom({id}: SymptomDeleteRequestParams): Promise<void> {
	return ajaxDelete<void>({
		url: `${getApiUrl(Service, SymptomsAPI.DeleteSymptom)}/${id}`,
	});
}

/**
 * Update Symptom
 */
export interface SymptomUpdateWithoutImageRequestParams {
	data: FormData;
}

export function updateSymptomWithoutImage(
	reqBody: SymptomUpdateWithoutImageRequestParams,
) {
	const {data} = reqBody;
	return ajaxPost<FormData, ISymptom>({
		data,
		url: getApiUrl(Service, SymptomsAPI.UpdateSymptomWithoutImage),
		headers: {
			'Content-Type': 'multipart/form-data',
			Accept: 'application/json',
			type: 'formData',
		},
	});
}

export interface SymptomUpdateRequestParams {
	data: FormData;
	id: string;
}

export function updateSymptomWithImage(reqBody: SymptomUpdateRequestParams) {
	const {data, id} = reqBody;
	return ajaxPost<FormData, ISymptom>({
		data,
		url: getApiUrl(Service, SymptomsAPI.UpdateSymptomWithImage),
		headers: {
			'Content-Type': 'multipart/form-data',
			Accept: 'application/json',
			type: 'formData',
		},
	});
}

export type GetCountResponse = {
	count: number;
};

/**
 * Get all symptoms count
 */
export function getSymptomsCount(): Promise<GetCountResponse> {
	return ajaxGet<GetCountResponse>({
		url: getApiUrl(Service, SymptomsAPI.GetSymptomsCount),
	});
}
