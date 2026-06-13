import {Services} from '@healthvisa/utils';

/**
 * Unique Keys for Health News.
 */
export enum NewsKeys {
	GetNews = 'getNews',
	GetNewsById = 'getNewsById',
	AddNews = 'addNews',
	UpdateNews = 'updateNews',
	DeleteNews = 'deleteNews',
	SetNewsActive = 'setNewsActive',
}

/**
 * API Endpoints for Health News.
 */
export enum NewsAPI {
	GetNews = '/news',
	// Upload under "uploads/" so the app's `awsServerUrl + image` resolves.
	AddNews = '/news/upload/uploads%2FNews%2F',
	UpdateNews = '/news/update/uploads%2FNews%2F',
}

export const Service: Services = 'card';
