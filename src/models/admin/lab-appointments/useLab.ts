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
import {LabAPI, LabKeys} from './api';
import {
	addDiagnostic,
	deleteDiagnostic,
	DiagnosticDeleteRequestParams,
	DiagnosticUpdateRequestParams,
	DiagnosticUpdateWithoutImageRequestParams,
	getDiagnosticById,
	GetDiagnosticItemResponse,
	getDiagnosticItems,
	GetLabAppointmentResponse,
	getLabAppointments,
	GetLabsResponse,
	getLabs,
	getLabById,
	addLab,
	updateLabWithImage,
	updateLabWithoutImage,
	deleteLab,
	ILab,
	LabUpdateRequestParams,
	LabUpdateWithoutImageRequestParams,
	LabDeleteRequestParams,
	IDiagnosticItem,
	LabAppointmentUpdateRequestParams,
	updateDiagnosticWithImage,
	updateDiagnosticWithoutImage,
	updateLabAppointment,
} from './Lab';

export function useGetLabAppointments(
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetLabAppointmentResponse,
				XHRErrorResponse,
				GetLabAppointmentResponse,
				[LabKeys.GetLabAppointments]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetLabAppointmentResponse, XHRErrorResponse> {
	return useQuery([LabKeys.GetLabAppointments], () => getLabAppointments(), {
		refetchOnWindowFocus: true,
		...queryOptions,
	});
}

// /**
//  * Categories react-query wrapper
//  */
export function useDiagnosticItems(
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetDiagnosticItemResponse,
				XHRErrorResponse,
				GetDiagnosticItemResponse,
				[LabAPI.GetDiagnostics]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetDiagnosticItemResponse, XHRErrorResponse> {
	return useQuery([LabAPI.GetDiagnostics], () => getDiagnosticItems(), {
		keepPreviousData: true, // Pagination Involved
		notifyOnChangeProps: 'tracked',
		refetchOnMount: false, // Restrict query to run on mount as prefetch is already done at server side.
		refetchOnWindowFocus: false, // Frequency of Change would be Low
		staleTime: 300000, // 5 minutes
		cacheTime: 3600000, // 1 hour
		...queryOptions,
	});
}

export function useGetLabs(
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetLabsResponse,
				XHRErrorResponse,
				GetLabsResponse,
				[LabKeys.GetLabs]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetLabsResponse, XHRErrorResponse> {
	return useQuery([LabKeys.GetLabs], () => getLabs(), {
		refetchOnWindowFocus: true,
		staleTime: 60000, // 1 min — labs rarely change
		...queryOptions,
	});
}

export function useDiagnosticById(
	id: string,
): UseQueryResult<IDiagnosticItem, XHRErrorResponse> {
	return useQuery(
		[LabKeys.GetDiagnosticById, id],
		() => getDiagnosticById(id),
		{refetchOnWindowFocus: true, enabled: !!id},
	);
}

export function useAddDiagnostic(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<IDiagnosticItem, XHRErrorResponse, FormData>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<IDiagnosticItem, XHRErrorResponse, FormData> {
	const queryClient = useQueryClient();
	return useMutation((data: FormData) => addDiagnostic(data), {
		retry: 0,
		mutationKey: [LabKeys.AddDiagnostic],
		...queryOptions,
		onSuccess(data, ...rest) {
			queryClient.invalidateQueries([LabAPI.GetDiagnostics]);
			return queryOptions?.onSuccess?.(data, ...rest);
		},
	});
}

export function useUpdateDiagnostic(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<
				IDiagnosticItem,
				XHRErrorResponse,
				DiagnosticUpdateRequestParams
			>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<
	IDiagnosticItem,
	XHRErrorResponse,
	DiagnosticUpdateRequestParams
> {
	const queryClient = useQueryClient();
	return useMutation(
		(req: DiagnosticUpdateRequestParams) => updateDiagnosticWithImage(req),
		{
			retry: 0,
			mutationKey: [LabKeys.UpdateDiagnosticWithImage],
			...queryOptions,
			onSuccess(data, ...rest) {
				queryClient.invalidateQueries([LabAPI.GetDiagnostics]);
				return queryOptions?.onSuccess?.(data, ...rest);
			},
		},
	);
}

export function useUpdateDiagnosticWithoutImage(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<
				IDiagnosticItem,
				XHRErrorResponse,
				DiagnosticUpdateWithoutImageRequestParams
			>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<
	IDiagnosticItem,
	XHRErrorResponse,
	DiagnosticUpdateWithoutImageRequestParams
> {
	const queryClient = useQueryClient();
	return useMutation(
		(req: DiagnosticUpdateWithoutImageRequestParams) =>
			updateDiagnosticWithoutImage(req),
		{
			retry: 0,
			mutationKey: [LabKeys.UpdateDiagnosticWithoutImage],
			...queryOptions,
			onSuccess(data, ...rest) {
				queryClient.invalidateQueries([LabAPI.GetDiagnostics]);
				return queryOptions?.onSuccess?.(data, ...rest);
			},
		},
	);
}

export function useDeleteDiagnostic(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<void, XHRErrorResponse, DiagnosticDeleteRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<void, XHRErrorResponse, DiagnosticDeleteRequestParams> {
	const queryClient = useQueryClient();
	return useMutation((req: {id: string}) => deleteDiagnostic(req), {
		mutationKey: [LabKeys.DeleteDiagnostic],
		retry: 2,
		...queryOptions,
		onSuccess(data, ...rest) {
			queryClient.invalidateQueries([LabAPI.GetDiagnostics]);
			return queryOptions?.onSuccess?.(data, ...rest);
		},
	});
}

export function useLabById(
	id: string,
): UseQueryResult<ILab, XHRErrorResponse> {
	return useQuery([LabKeys.GetLabById, id], () => getLabById(id), {
		refetchOnWindowFocus: true,
		enabled: !!id,
	});
}

export function useAddLab(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<ILab, XHRErrorResponse, FormData>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<ILab, XHRErrorResponse, FormData> {
	const queryClient = useQueryClient();
	return useMutation((data: FormData) => addLab(data), {
		retry: 0,
		mutationKey: [LabKeys.AddLab],
		...queryOptions,
		onSuccess(data, ...rest) {
			queryClient.invalidateQueries([LabKeys.GetLabs]);
			return queryOptions?.onSuccess?.(data, ...rest);
		},
	});
}

export function useUpdateLab(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<ILab, XHRErrorResponse, LabUpdateRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<ILab, XHRErrorResponse, LabUpdateRequestParams> {
	const queryClient = useQueryClient();
	return useMutation((req: LabUpdateRequestParams) => updateLabWithImage(req), {
		retry: 0,
		mutationKey: [LabKeys.UpdateLabWithImage],
		...queryOptions,
		onSuccess(data, ...rest) {
			queryClient.invalidateQueries([LabKeys.GetLabs]);
			return queryOptions?.onSuccess?.(data, ...rest);
		},
	});
}

export function useUpdateLabWithoutImage(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<
				ILab,
				XHRErrorResponse,
				LabUpdateWithoutImageRequestParams
			>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<ILab, XHRErrorResponse, LabUpdateWithoutImageRequestParams> {
	const queryClient = useQueryClient();
	return useMutation(
		(req: LabUpdateWithoutImageRequestParams) => updateLabWithoutImage(req),
		{
			retry: 0,
			mutationKey: [LabKeys.UpdateLabWithoutImage],
			...queryOptions,
			onSuccess(data, ...rest) {
				queryClient.invalidateQueries([LabKeys.GetLabs]);
				return queryOptions?.onSuccess?.(data, ...rest);
			},
		},
	);
}

export function useDeleteLab(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<void, XHRErrorResponse, LabDeleteRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<void, XHRErrorResponse, LabDeleteRequestParams> {
	const queryClient = useQueryClient();
	return useMutation((req: {id: string}) => deleteLab(req), {
		mutationKey: [LabKeys.DeleteLab],
		retry: 2,
		...queryOptions,
		onSuccess(data, ...rest) {
			queryClient.invalidateQueries([LabKeys.GetLabs]);
			return queryOptions?.onSuccess?.(data, ...rest);
		},
	});
}

export function useUpdateLabAppointment(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<any, XHRErrorResponse, LabAppointmentUpdateRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<any, XHRErrorResponse, LabAppointmentUpdateRequestParams> {
	const queryClient = useQueryClient();
	return useMutation(
		(reqParams: LabAppointmentUpdateRequestParams) => updateLabAppointment(reqParams),
		{
			mutationKey: [LabKeys.UpdateLabAppointments],
			retry: 2, // Try at least Thrice before giving up
			...queryOptions,
			onSuccess(data: any, ...rest) {
				queryClient.invalidateQueries(LabKeys.UpdateLabAppointments);
				return queryOptions?.onSuccess?.(data, ...rest);
			},
		},
	);
}
