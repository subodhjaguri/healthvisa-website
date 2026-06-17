import {ajaxGet, getApiUrl} from '@healthvisa/utils';
import {DocumentAPI, Service} from './api';

export interface IDocument {
	id: string;
	title: string;
	description?: string;
	patientName?: string;
	userId: string;
	// `GET /documents` wraps the stored S3 key into this object.
	document?: {
		url: string;
		path: string;
		type: string;
	};
	type?: 'EHR' | 'prescription';
	createdAt: string;
	updatedAt: string;
	metadata?: any;
}

export type GetDocumentsResponse = IDocument[];

/**
 * EHR reports uploaded by users (type === 'EHR'), newest first. The backend
 * already resolves `document` into {url, path, type}, so the URL is ready to
 * open. Lab prescriptions (type === 'prescription') are intentionally excluded.
 */
export function getEhrDocuments(): Promise<GetDocumentsResponse> {
	return ajaxGet<GetDocumentsResponse>({
		url: getApiUrl(Service, DocumentAPI.GetDocuments),
		query: {
			filter: `{"where":{"type":"EHR"},"order":"createdAt DESC"}`,
		},
	});
}
