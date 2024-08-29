import {ajaxDelete, ajaxGet, ajaxPatch, ajaxPost, getApiUrl} from '@healthvisa/utils';
import {ProductAPI, Service} from './api';

export interface PurchaseField {
	type: string;
	name: string;
	order: number;
	metadata: any;
}

export interface IProductNew {
	id: string;
	name: string;
	description: string;
	categoryId: string;
	image: {
		url: string;
		path: string;
	};
	gallery: string[];
	price: number;
	discountPrice: number;
	metadata: object;
	isDeleted: boolean;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
	type: string;
	purchaseFields: PurchaseField[];
}
/**
 * Response Model for `getProduct()` call
 */

export type GetProductRequestParams = {categoryId: string};

export type GetProductResponse = IProductNew[];
/**
 * Get all Products
 */
export function getProduct(): Promise<GetProductResponse> {
	return ajaxGet<GetProductResponse>({
		url: getApiUrl(Service, ProductAPI.GetProduct),
	});
}

export function getProductByCategory({
	categoryId,
}: GetProductRequestParams): Promise<GetProductResponse> {
	return ajaxGet<GetProductResponse>({
		url: getApiUrl(Service, ProductAPI.GetProduct),
		query: {
			filter: `{"where": {"categoryId":${JSON.stringify(categoryId)}}}`,
		},
	});
}

export interface GetProductByIdRequestParams {
	/** Product Id */
	id: string;
}

/*
 * Type for get Product response
 * */
export type GetProductByIdResponse = IProductNew;
/**

/**
 * Get single Product by Id
 */
export function getProductById({
	id,
}: GetProductByIdRequestParams): Promise<GetProductByIdResponse> {
	return ajaxGet<GetProductByIdResponse>({
		url: getApiUrl(Service, `${ProductAPI.ProductById}/${id}`),
	});
}

/**
 * Add Product
 */
export function addProduct(data: FormData) {
	return ajaxPost<FormData, IProductNew>({
		data,
		url: getApiUrl(Service, ProductAPI.AddProduct),
		headers: {
			'Content-Type': 'multipart/form-data',
			Accept: 'application/json',
			type: 'formData',
		},
	});
}

// for Delete Product

/**
 * Request Parameter for Deleting a Product
 */

export interface ProductDeleteRequestParams {
	id: string;
}
export function deleteProduct({id}: ProductDeleteRequestParams): Promise<void> {
	return ajaxDelete<void>({
		url: `${getApiUrl(Service, ProductAPI.DeleteProduct)}/${id}`,
	});
}

// export interface ProductUpdateWithoutImageRequestParams {
// 	id: string;
// 	name: string;
// 	description: string;
// 	categoryId: string;
// 	price: number;
// 	discountPrice: number;
// 	type: string;
// 	purchaseFields: [];
// }

// export function updateProductWithoutImage({
// 	...requestBody
// }: ProductUpdateWithoutImageRequestParams): Promise<any> {
// 	const {
// 		id,
// 		name,
// 		description,
// 		categoryId,
// 		price,
// 		discountPrice,
// 		type,
// 		purchaseFields,
// 	} = requestBody;
// 	const data: Record<string, Primitive> = {
// 		id,
// 		name,
// 		description,
// 		categoryId,
// 		price,
// 		discountPrice,
// 		type,
// 		purchaseFields,
// 	};

// 	return ajaxPost<Record<string, Primitive>, any>({
// 		data,
// 		// url: `${getApiUrl(Service, ProductAPI.UpdateProductWithoutImage)}/${id}`,
// 		url: `${getApiUrl(Service, ProductAPI.UpdateProductWithoutImage)}`,
// 	});
// }

/**
 * Update Product
 */

export interface ProductUpdateWithoutImageRequestParams {
	data: FormData;
}

export function updateProductWithoutImage(
	reqBody: ProductUpdateWithoutImageRequestParams,
) {
	const {data} = reqBody;
	return ajaxPost<FormData, IProductNew>({
		data,
		url: getApiUrl(Service, ProductAPI.UpdateProductWithoutImage),
		headers: {
			'Content-Type': 'multipart/form-data',
			Accept: 'application/json',
			type: 'formData',
		},
	});
}

export interface ProductUpdateRequestParams {
	data: FormData;
	id: string;
}

export function updateProductWithImage(reqBody: ProductUpdateRequestParams) {
	const {data, id} = reqBody;
	return ajaxPost<FormData, IProductNew>({
		data,
		url: getApiUrl(Service, ProductAPI.UpdateProductWithImage),
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
 * Get all products count
 */
export function getProductsCount(): Promise<GetCountResponse> {
	return ajaxGet<GetCountResponse>({
		url: getApiUrl(Service, ProductAPI.GetProductCount),
	});
}
