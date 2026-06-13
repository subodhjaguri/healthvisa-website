import {XHRErrorResponse} from '@healthvisa/utils';
import {
	useMutation,
	UseMutationOptions,
	UseMutationResult,
	useQuery,
	useQueryClient,
	UseQueryOptions,
	UseQueryResult,
} from 'react-query';
import {NewsKeys} from './api';
import {
	addNews,
	deleteNews,
	getNews,
	getNewsById,
	GetNewsResponse,
	INews,
	setNewsActive,
	updateNews,
} from './News';

export function useGetNews(
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetNewsResponse,
				XHRErrorResponse,
				GetNewsResponse,
				[NewsKeys.GetNews]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetNewsResponse, XHRErrorResponse> {
	return useQuery([NewsKeys.GetNews], () => getNews(), {
		refetchOnWindowFocus: true,
		...queryOptions,
	});
}

export function useNewsById(
	id: string,
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				INews,
				XHRErrorResponse,
				INews,
				[NewsKeys.GetNewsById, string]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<INews, XHRErrorResponse> {
	return useQuery([NewsKeys.GetNewsById, id], () => getNewsById(id), {
		enabled: !!id,
		...queryOptions,
	});
}

export function useAddNews(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<INews, XHRErrorResponse, FormData>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<INews, XHRErrorResponse, FormData> {
	const queryClient = useQueryClient();
	return useMutation((data: FormData) => addNews(data), {
		mutationKey: [NewsKeys.AddNews],
		...queryOptions,
		onSuccess: (...args) => {
			queryClient.invalidateQueries([NewsKeys.GetNews]);
			return queryOptions?.onSuccess?.(...args);
		},
	});
}

export function useUpdateNews(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<INews, XHRErrorResponse, FormData>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<INews, XHRErrorResponse, FormData> {
	const queryClient = useQueryClient();
	return useMutation((data: FormData) => updateNews(data), {
		mutationKey: [NewsKeys.UpdateNews],
		...queryOptions,
		onSuccess: (...args) => {
			queryClient.invalidateQueries([NewsKeys.GetNews]);
			return queryOptions?.onSuccess?.(...args);
		},
	});
}

export function useDeleteNews(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<void, XHRErrorResponse, {id: string}>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<void, XHRErrorResponse, {id: string}> {
	const queryClient = useQueryClient();
	return useMutation((req: {id: string}) => deleteNews(req), {
		mutationKey: [NewsKeys.DeleteNews],
		...queryOptions,
		onSuccess: (...args) => {
			queryClient.invalidateQueries([NewsKeys.GetNews]);
			return queryOptions?.onSuccess?.(...args);
		},
	});
}

export function useSetNewsActive(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<
				void,
				XHRErrorResponse,
				{id: string; isActive: boolean}
			>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<void, XHRErrorResponse, {id: string; isActive: boolean}> {
	const queryClient = useQueryClient();
	return useMutation(
		(req: {id: string; isActive: boolean}) => setNewsActive(req),
		{
			mutationKey: [NewsKeys.SetNewsActive],
			...queryOptions,
			onSuccess: (...args) => {
				queryClient.invalidateQueries([NewsKeys.GetNews]);
				return queryOptions?.onSuccess?.(...args);
			},
		},
	);
}
