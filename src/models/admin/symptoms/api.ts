import {Services} from '@healthvisa/utils';

/**
 * Unique Keys for Symptoms.
 */
export enum SymptomsKeys {
	GetSymptoms = 'GetSymptoms',
	GetSymptomById = 'GetSymptomById',
	AddSymptom = 'addSymptom',
	DeleteSymptom = 'deleteSymptom',
	UpdateSymptomWithImage = 'updateSymptom',
	UpdateSymptomWithoutImage = 'updateWithoutImageSymptom',
	GetSymptomsCount = '/symptoms/count',
}

/**
 * API Endpoints for Symptoms.
 */
export enum SymptomsAPI {
	GetSymptoms = '/symptoms',
	GetSymptomById = '/symptoms',
	AddSymptom = '/symptom/upload/uploads%2FSymptoms%2F',
	DeleteSymptom = '/symptoms',
	UpdateSymptomWithImage = '/symptom/update/uploads%2FSymptoms%2F',
	UpdateSymptomWithoutImage = '/symptom/update/uploads%2FSymptoms%2F',
	GetSymptomsCount = '/symptoms/count',
}

export const Service: Services = 'product';
