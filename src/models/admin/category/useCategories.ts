import {XHRErrorResponse} from '@healthvisa/utils';
import {
	UseQueryOptions,
	UseQueryResult,
	useQuery,
	UseMutationOptions,
	UseMutationResult,
	useQueryClient,
	useMutation,
} from 'react-query';
import {CategoriesKeys} from './api';
import {
	addCategory,
	CategoryDeleteRequestParams,
	CategoryUpdateRequestParams,
	CategoryUpdateWithoutImageRequestParams,
	deleteCategory,
	getCategories,
	getCategoriesByTags,
	getCategoriesCount,
	GetCategoriesResponse,
	getCategoryById,
	GetCategoryByIdRequestParams,
	GetCategoryByIdResponse,
	GetCategoryRequestParams,
	GetCountResponse,
	ICategoryNew,
	updateCategoryWithImage,
	updateCategoryWithoutImage,
} from './Categories';

// /**
//  * Categories react-query wrapper
//  */
export function useCategories(
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetCategoriesResponse,
				XHRErrorResponse,
				GetCategoriesResponse,
				[CategoriesKeys.GetCategories]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetCategoriesResponse, XHRErrorResponse> {
	return useQuery([CategoriesKeys.GetCategories], () => getCategories(), {
		...queryOptions,
	});
}

export function useCategoriesByTags(
	queryParams: GetCategoryRequestParams,
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetCategoriesResponse,
				XHRErrorResponse,
				GetCategoriesResponse,
				[CategoriesKeys.GetCategories, string[]]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetCategoriesResponse, XHRErrorResponse> {
	return useQuery(
		[CategoriesKeys.GetCategories, queryParams.tags],
		() => getCategoriesByTags(queryParams),
		{
			...queryOptions,
		},
	);
}

export function useCategoryById(
	// eslint-disable-next-line default-param-last
	queryParams: GetCategoryByIdRequestParams,
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetCategoryByIdResponse,
				XHRErrorResponse,
				GetCategoryByIdResponse,
				[CategoriesKeys.GetCategoriesById, string]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetCategoryByIdResponse, XHRErrorResponse> {
	return useQuery(
		[CategoriesKeys.GetCategoriesById, queryParams.id],
		() => getCategoryById(queryParams),
		{
			...queryOptions,
		},
	);
}
export function useDeleteCategory(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<void, XHRErrorResponse, CategoryDeleteRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<void, XHRErrorResponse, CategoryDeleteRequestParams> {
	const queryClient = useQueryClient();

	return useMutation((reqParams: {id: string}) => deleteCategory(reqParams), {
		mutationKey: [CategoriesKeys.DeleteCategory],
		retry: 2, // Try at least Thrice before giving up
		...queryOptions,
		onSuccess(...args) {
			queryClient.invalidateQueries(CategoriesKeys.GetCategories);
			return queryOptions?.onSuccess?.(...args);
		},
	});
}

export function useAddCategory(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<ICategoryNew, XHRErrorResponse, FormData>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<ICategoryNew, XHRErrorResponse, FormData> {
	const queryClient = useQueryClient();
	return useMutation((reqParams: FormData) => addCategory(reqParams), {
		retry: 0, // Try at least Thrice before giving up
		mutationKey: [CategoriesKeys.AddCategory],
		...queryOptions,
		onSuccess(data: ICategoryNew, ...rest) {
			queryClient.invalidateQueries(CategoriesKeys.GetCategories);
			return queryOptions?.onSuccess?.(data, ...rest);
		},
	});
}

export function useUpdateCategory(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<
				ICategoryNew,
				XHRErrorResponse,
				CategoryUpdateRequestParams
			>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<ICategoryNew, XHRErrorResponse, CategoryUpdateRequestParams> {
	const queryClient = useQueryClient();
	return useMutation(
		(reqParams: CategoryUpdateRequestParams) => updateCategoryWithImage(reqParams),
		{
			retry: 0, // Try at least Thrice before giving up
			mutationKey: [CategoriesKeys.UpdateCategoryWithImage],

			...queryOptions,
			onSuccess(data: ICategoryNew, ...rest) {
				// queryClient.setQueryData<UploadUserDocumentResponse>([CourseKeys.CourseAdd, data.id], data);
				queryClient.invalidateQueries([CategoriesKeys.GetCategories]);
				return queryOptions?.onSuccess?.(data, ...rest);
			},
		},
	);
}

export function useUpdateCategoryWithoutImage(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<
				any,
				XHRErrorResponse,
				CategoryUpdateWithoutImageRequestParams
			>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<any, XHRErrorResponse, CategoryUpdateWithoutImageRequestParams> {
	const queryClient = useQueryClient();
	return useMutation(
		(reqParams: CategoryUpdateWithoutImageRequestParams) =>
			updateCategoryWithoutImage(reqParams),
		{
			mutationKey: [CategoriesKeys.UpdateCategoryWithoutImage],
			retry: 2, // Try at least Thrice before giving up
			...queryOptions,
			onSuccess(data: any, ...rest) {
				queryClient.invalidateQueries([CategoriesKeys.GetCategories]);
				return queryOptions?.onSuccess?.(data, ...rest);
			},
		},
	);
}

// /**
//  * Categories react-query wrapper
//  */
export function useCategoriesCount(
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetCountResponse,
				XHRErrorResponse,
				GetCountResponse,
				[CategoriesKeys.GetCategoriesCount]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetCountResponse, XHRErrorResponse> {
	return useQuery([CategoriesKeys.GetCategoriesCount], () => getCategoriesCount(), {
		...queryOptions,
	});
}
