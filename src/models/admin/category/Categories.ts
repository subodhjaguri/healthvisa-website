import {ajaxDelete, ajaxGet, ajaxPost, getApiUrl} from '@healthvisa/utils';
import {CategoriesAPI, Service} from './api';

export interface ITags {
	tags: 'string';
}

export interface ICategoryNew {
	id: string;
	category: string;
	description: string;
	image: {
		url: string;
		path: string;
	};
	status: boolean;
	tags: ITags[];
	createdby: string;
	createdAt: Date;
	updatedAt: Date;
}
/**
 * Response Model for `getCategories()` call
 */

export type GetCategoryRequestParams = {tags: string[]};

export type GetCategoriesResponse = ICategoryNew[];
/**
 * Get all getCategories
 */
export function getCategories(): Promise<GetCategoriesResponse> {
	return ajaxGet<GetCategoriesResponse>({
		url: getApiUrl(Service, CategoriesAPI.GetCategories),
	});
}

export function getCategoriesByTags({
	tags,
}: GetCategoryRequestParams): Promise<GetCategoriesResponse> {
	return ajaxGet<GetCategoriesResponse>({
		url: getApiUrl(Service, CategoriesAPI.GetCategories),
		query: {
			filter: `{"where": {"tags": ${JSON.stringify(tags)}}}`,
		},
	});
}

export interface GetCategoryByIdRequestParams {
	/** Category Id */
	id: string;
}
/*
 * Type for get Category response
 * */
export type GetCategoryByIdResponse = ICategoryNew;
/**

/**
 * Get single Category by Id
 */
export function getCategoryById({
	id,
}: GetCategoryByIdRequestParams): Promise<GetCategoryByIdResponse> {
	return ajaxGet<GetCategoryByIdResponse>({
		url: getApiUrl(Service, `${CategoriesAPI.GetCategoriesById}/${id}`),
	});
}

/**
 * Add Category
 */
export function addCategory(data: FormData) {
	return ajaxPost<FormData, ICategoryNew>({
		data,
		url: getApiUrl(Service, CategoriesAPI.AddCategory),
		headers: {
			'Content-Type': 'multipart/form-data',
			Accept: 'application/json',
			type: 'formData',
		},
	});
}

// for Delete Category

/**
 * Request Parameter for Deleting a Category
 */

export interface CategoryDeleteRequestParams {
	id: string;
}
export function deleteCategory({id}: CategoryDeleteRequestParams): Promise<void> {
	return ajaxDelete<void>({
		url: `${getApiUrl(Service, CategoriesAPI.DeleteCategory)}/${id}`,
	});
}

/**
 * Update Category
 */

export interface CategoryUpdateWithoutImageRequestParams {
	data: FormData;
}

export function updateCategoryWithoutImage(
	reqBody: CategoryUpdateWithoutImageRequestParams,
) {
	const {data} = reqBody;
	return ajaxPost<FormData, ICategoryNew>({
		data,
		url: getApiUrl(Service, CategoriesAPI.UpdateCategoryWithoutImage),
		headers: {
			'Content-Type': 'multipart/form-data',
			Accept: 'application/json',
			type: 'formData',
		},
	});
}

export interface CategoryUpdateRequestParams {
	data: FormData;
	id: string;
}

export function updateCategoryWithImage(reqBody: CategoryUpdateRequestParams) {
	const {data, id} = reqBody;
	return ajaxPost<FormData, ICategoryNew>({
		data,
		url: getApiUrl(Service, CategoriesAPI.UpdateCategoryWithImage),
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
 * Get all getCategories count
 */
export function getCategoriesCount(): Promise<GetCountResponse> {
	return ajaxGet<GetCountResponse>({
		url: getApiUrl(Service, CategoriesAPI.GetCategoriesCount),
	});
}
