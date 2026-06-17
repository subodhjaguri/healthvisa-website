import {Services} from '@healthvisa/utils';

/**
 * Unique Keys for Documents (user-uploaded EHR reports).
 */
export enum DocumentKeys {
	GetDocuments = 'getDocuments',
}

/**
 * API Endpoint for Documents.
 */
export enum DocumentAPI {
	GetDocuments = '/documents',
}

export const Service: Services = 'card';
