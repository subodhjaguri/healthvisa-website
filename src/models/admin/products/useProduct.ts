import {
	UseQueryOptions,
	UseQueryResult,
	useQuery,
	useMutation,
	UseMutationOptions,
	UseMutationResult,
	useQueryClient,
} from 'react-query';

import {XHRErrorResponse} from '@healthvisa/utils';
import {
	addProduct,
	deleteProduct,
	GetCountResponse,
	getProduct,
	getProductByCategory,
	getProductById,
	GetProductByIdRequestParams,
	GetProductByIdResponse,
	GetProductRequestParams,
	GetProductResponse,
	getProductsCount,
	IProductNew,
	ProductDeleteRequestParams,
	ProductUpdateRequestParams,
	ProductUpdateWithoutImageRequestParams,
	updateProductWithImage,
	updateProductWithoutImage,
} from './Product';
import {ProductKeys} from './api';

// /**
//  * Product react-query wrapper
//  */
export function useProduct(
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetProductResponse,
				XHRErrorResponse,
				GetProductResponse,
				[ProductKeys.GetProduct]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetProductResponse, XHRErrorResponse> {
	return useQuery([ProductKeys.GetProduct], () => getProduct(), {
		...queryOptions,
	});
}

export function useProductByCategory(
	queryParams: GetProductRequestParams,
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetProductResponse,
				XHRErrorResponse,
				GetProductResponse,
				[ProductKeys.GetProduct, string]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetProductResponse, XHRErrorResponse> {
	return useQuery(
		[ProductKeys.GetProduct, queryParams.categoryId],
		() => getProductByCategory(queryParams),
		{
			keepPreviousData: true, // Pagination Involved
			notifyOnChangeProps: 'tracked',
			refetchOnWindowFocus: false, // Frequency of Change would be Low
			...queryOptions,
		},
	);
}

/**
 * Facade over React Query Hook to get City by ID Information.
 * @param queryParams - Query Parameters for Searching.
 * @param queryOptions - Configuration Object for Query (optional).
 * @returns A Hook with Query Results for Task Course Information.
 */
export function useProductById(
	// eslint-disable-next-line default-param-last
	queryParams: GetProductByIdRequestParams,
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetProductByIdResponse,
				XHRErrorResponse,
				GetProductByIdResponse,
				[ProductKeys.ProductById, string]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetProductByIdResponse, XHRErrorResponse> {
	return useQuery(
		[ProductKeys.ProductById, queryParams.id],
		() => getProductById(queryParams),
		{
			notifyOnChangeProps: 'tracked',
			refetchOnWindowFocus: true, // Frequency of Change would be Low
			...queryOptions,
		},
	);
}

export function useDeleteProduct(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<void, XHRErrorResponse, ProductDeleteRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<void, XHRErrorResponse, ProductDeleteRequestParams> {
	const queryClient = useQueryClient();

	return useMutation((reqParams: {id: string}) => deleteProduct(reqParams), {
		mutationKey: [ProductKeys.DeleteProduct],
		retry: 2, // Try at least Thrice before giving up
		...queryOptions,
		onSuccess(...args) {
			queryClient.invalidateQueries(ProductKeys.GetProduct);
			return queryOptions?.onSuccess?.(...args);
		},
	});
}

export function useAddProduct(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<IProductNew, XHRErrorResponse, FormData>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<IProductNew, XHRErrorResponse, FormData> {
	const queryClient = useQueryClient();
	return useMutation((reqParams: FormData) => addProduct(reqParams), {
		retry: 0, // Try at least Thrice before giving up
		mutationKey: [ProductKeys.AddProduct],
		...queryOptions,
		onSuccess(data: IProductNew, ...rest) {
			queryClient.invalidateQueries(ProductKeys.GetProduct);
			return queryOptions?.onSuccess?.(data, ...rest);
		},
	});
}

export function useUpdateProduct(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<IProductNew, XHRErrorResponse, ProductUpdateRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<IProductNew, XHRErrorResponse, ProductUpdateRequestParams> {
	const queryClient = useQueryClient();
	return useMutation(
		(reqParams: ProductUpdateRequestParams) => updateProductWithImage(reqParams),
		{
			retry: 0, // Try at least Thrice before giving up
			mutationKey: [ProductKeys.UpdateProductWithImage],

			...queryOptions,
			onSuccess(data: IProductNew, ...rest) {
				// queryClient.setQueryData<UploadUserDocumentResponse>([CourseKeys.CourseAdd, data.id], data);
				queryClient.invalidateQueries([ProductKeys.GetProduct]);
				return queryOptions?.onSuccess?.(data, ...rest);
			},
		},
	);
}

export function useUpdateProductWithoutImage(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<
				any,
				XHRErrorResponse,
				ProductUpdateWithoutImageRequestParams
			>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<any, XHRErrorResponse, ProductUpdateWithoutImageRequestParams> {
	const queryClient = useQueryClient();
	return useMutation(
		(reqParams: ProductUpdateWithoutImageRequestParams) =>
			updateProductWithoutImage(reqParams),
		{
			mutationKey: [ProductKeys.UpdateProductWithoutImage],
			retry: 2, // Try at least Thrice before giving up
			...queryOptions,
			onSuccess(data: any, ...rest) {
				queryClient.invalidateQueries([ProductKeys.GetProduct]);
				return queryOptions?.onSuccess?.(data, ...rest);
			},
		},
	);
}

// /**
//  * Categories react-query wrapper
//  */
export function useProductCount(
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetCountResponse,
				XHRErrorResponse,
				GetCountResponse,
				[ProductKeys.GetProductCount]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetCountResponse, XHRErrorResponse> {
	return useQuery([ProductKeys.GetProductCount], () => getProductsCount(), {
		...queryOptions,
	});
}
