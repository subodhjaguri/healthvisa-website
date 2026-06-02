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
	// Upload under "uploads/" so the read URL (S3_INITIAL_PATH + image) resolves;
	// backend stores the image field relative to that prefix.
	AddCategory = '/category/upload/uploads%2Fcategories%2F',
	DeleteCategory = '/categories',
	UpdateCategoryWithImage = '/category/update/uploads%2Fcategories%2F',
	UpdateCategoryWithoutImage = '/category/update/uploads%2Fcategories%2F',
	GetCategoriesCount = '/categories/count',
}

export const Service: Services = 'product';
