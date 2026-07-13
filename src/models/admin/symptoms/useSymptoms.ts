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
import {SymptomsKeys} from './api';
import {
	addSymptom,
	SymptomDeleteRequestParams,
	SymptomUpdateRequestParams,
	SymptomUpdateWithoutImageRequestParams,
	deleteSymptom,
	getSymptoms,
	getSymptomsCount,
	GetSymptomsResponse,
	getSymptomById,
	GetSymptomByIdRequestParams,
	GetSymptomByIdResponse,
	GetCountResponse,
	ISymptom,
	updateSymptomWithImage,
	updateSymptomWithoutImage,
} from './Symptoms';

export function useSymptoms(
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetSymptomsResponse,
				XHRErrorResponse,
				GetSymptomsResponse,
				[SymptomsKeys.GetSymptoms]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetSymptomsResponse, XHRErrorResponse> {
	return useQuery([SymptomsKeys.GetSymptoms], () => getSymptoms(), {
		...queryOptions,
	});
}

export function useSymptomById(
	queryParams: GetSymptomByIdRequestParams,
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetSymptomByIdResponse,
				XHRErrorResponse,
				GetSymptomByIdResponse,
				[SymptomsKeys.GetSymptomById, string]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetSymptomByIdResponse, XHRErrorResponse> {
	return useQuery(
		[SymptomsKeys.GetSymptomById, queryParams.id],
		() => getSymptomById(queryParams),
		{
			...queryOptions,
		},
	);
}

export function useDeleteSymptom(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<void, XHRErrorResponse, SymptomDeleteRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<void, XHRErrorResponse, SymptomDeleteRequestParams> {
	const queryClient = useQueryClient();

	return useMutation((reqParams: {id: string}) => deleteSymptom(reqParams), {
		mutationKey: [SymptomsKeys.DeleteSymptom],
		retry: 2,
		...queryOptions,
		onSuccess(...args) {
			queryClient.invalidateQueries(SymptomsKeys.GetSymptoms);
			return queryOptions?.onSuccess?.(...args);
		},
	});
}

export function useAddSymptom(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<ISymptom, XHRErrorResponse, FormData>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<ISymptom, XHRErrorResponse, FormData> {
	const queryClient = useQueryClient();
	return useMutation((reqParams: FormData) => addSymptom(reqParams), {
		retry: 0,
		mutationKey: [SymptomsKeys.AddSymptom],
		...queryOptions,
		onSuccess(data: ISymptom, ...rest) {
			queryClient.invalidateQueries(SymptomsKeys.GetSymptoms);
			return queryOptions?.onSuccess?.(data, ...rest);
		},
	});
}

export function useUpdateSymptom(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<
				ISymptom,
				XHRErrorResponse,
				SymptomUpdateRequestParams
			>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<ISymptom, XHRErrorResponse, SymptomUpdateRequestParams> {
	const queryClient = useQueryClient();
	return useMutation(
		(reqParams: SymptomUpdateRequestParams) => updateSymptomWithImage(reqParams),
		{
			retry: 0,
			mutationKey: [SymptomsKeys.UpdateSymptomWithImage],
			...queryOptions,
			onSuccess(data: ISymptom, ...rest) {
				queryClient.invalidateQueries(SymptomsKeys.GetSymptoms);
				queryClient.invalidateQueries([SymptomsKeys.GetSymptomById, data.id]);
				return queryOptions?.onSuccess?.(data, ...rest);
			},
		},
	);
}

export function useUpdateSymptomWithoutImage(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<
				ISymptom,
				XHRErrorResponse,
				SymptomUpdateWithoutImageRequestParams
			>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<
	ISymptom,
	XHRErrorResponse,
	SymptomUpdateWithoutImageRequestParams
> {
	const queryClient = useQueryClient();
	return useMutation(
		(reqParams: SymptomUpdateWithoutImageRequestParams) =>
			updateSymptomWithoutImage(reqParams),
		{
			retry: 0,
			mutationKey: [SymptomsKeys.UpdateSymptomWithoutImage],
			...queryOptions,
			onSuccess(data: ISymptom, ...rest) {
				queryClient.invalidateQueries(SymptomsKeys.GetSymptoms);
				queryClient.invalidateQueries([SymptomsKeys.GetSymptomById, data.id]);
				return queryOptions?.onSuccess?.(data, ...rest);
			},
		},
	);
}
