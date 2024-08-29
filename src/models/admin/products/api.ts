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
	AddProduct = '/product/upload/Product%2F',
	DeleteProduct = '/products',
	UpdateProductWithImage = '/product/update/Product%2F',
	UpdateProductWithoutImage = '/product/update/Product%2F',
}

export const Service: Services = 'product';
