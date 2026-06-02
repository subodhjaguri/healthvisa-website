import {Services} from '@healthvisa/utils';

/**
 * Unique Keys for User Authentication.
 */
export enum ProductKeys {
	GetProduct = 'GetProduct',
	ProductById = 'productById',
	AddProduct = 'addProduct',
	DeleteProduct = 'deleteProduct',
	UpdateProductWithImage = 'updateProduct',
	UpdateProductWithoutImage = 'updateWithoutImage',
	GetProductCount = 'productcount',
}

/**
 * API Endpoint for Authentication.
 */
export enum ProductAPI {
	GetProduct = '/products',
	GetProductCount = '/products/count',
	ProductById = '/products',
	// Upload under the "uploads/" prefix so the read URL (S3_INITIAL_PATH + image)
	// resolves; backend stores the image field relative to that prefix.
	AddProduct = '/product/upload/uploads%2Fdoctors%2F',
	DeleteProduct = '/products',
	UpdateProductWithImage = '/product/update/uploads%2Fdoctors%2F',
	UpdateProductWithoutImage = '/product/update/uploads%2Fdoctors%2F',
}

export const Service: Services = 'product';
