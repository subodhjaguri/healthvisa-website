import {
	ajaxDelete,
	ajaxGet,
	ajaxPatch,
	ajaxPost,
	getApiUrl,
} from '@healthvisa/utils';
import {NewsAPI, Service} from './api';

export interface INews {
	id: string;
	title: string;
	description: string; // HTML body (rendered by the app)
	writtenBy: string;
	publishedDate: string;
	images: string[];
	mainImage?: string;
	metadata?: any;
	isActive?: boolean;
	isDeleted?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export type GetNewsResponse = INews[];

/**
 * Admin list — ALL non-deleted news (active + inactive), newest first.
 * (The app list separately requests active-only.)
 */
export function getNews(): Promise<GetNewsResponse> {
	return ajaxGet<GetNewsResponse>({
		url: getApiUrl(Service, NewsAPI.GetNews),
		query: {filter: '{"order":"publishedDate DESC"}'},
	});
}

export function getNewsById(id: string): Promise<INews> {
	return ajaxGet<INews>({
		url: `${getApiUrl(Service, NewsAPI.GetNews)}/${id}`,
	});
}

const newsMultipartHeaders = {
	'Content-Type': 'multipart/form-data',
	Accept: 'application/json',
	type: 'formData',
};

export function addNews(data: FormData) {
	return ajaxPost<FormData, INews>({
		data,
		url: getApiUrl(Service, NewsAPI.AddNews),
		headers: newsMultipartHeaders,
	});
}

export function updateNews(data: FormData) {
	return ajaxPost<FormData, INews>({
		data,
		url: getApiUrl(Service, NewsAPI.UpdateNews),
		headers: newsMultipartHeaders,
	});
}

export function deleteNews({id}: {id: string}): Promise<void> {
	return ajaxDelete<void>({
		url: `${getApiUrl(Service, NewsAPI.GetNews)}/${id}`,
	});
}

/** Toggle visibility in the app via PATCH /news/{id}. */
export function setNewsActive({
	id,
	isActive,
}: {
	id: string;
	isActive: boolean;
}) {
	return ajaxPatch<Record<string, unknown>, void>({
		data: {isActive},
		url: `${getApiUrl(Service, NewsAPI.GetNews)}/${id}`,
	});
}
