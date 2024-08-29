import {Services} from '@healthvisa/utils';

/**
 * Unique Keys for User Authentication.
 */
export enum CategoriesKeys {
	GetCategories = 'GetCategories',
	GetCategoriesById = 'GetCategoriesById',
	AddCategory = 'addCategory',
	DeleteCategory = 'deleteCategory',
	UpdateCategoryWithImage = 'updateCategory',
	UpdateCategoryWithoutImage = 'updateWithoutImage',
	GetCategoriesCount = '/categories/count',
}

/**
 * API Endpoint for Authentication.
 */
export enum CategoriesAPI {
	GetCategories = '/categories',
	GetCategoriesById = '/categories',
	AddCategory = '/category/upload/Category%2F',
	DeleteCategory = '/categories',
	UpdateCategoryWithImage = '/category/update/Category%2F',
	UpdateCategoryWithoutImage = '/category/update/Category%2F',
	GetCategoriesCount = '/categories/count',
}

export const Service: Services = 'product';
