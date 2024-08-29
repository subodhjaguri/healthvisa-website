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
	GetDiagnosticItemResponse,
	getDiagnosticItems,
	GetLabAppointmentResponse,
	getLabAppointments,
	LabAppointmentUpdateRequestParams,
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
