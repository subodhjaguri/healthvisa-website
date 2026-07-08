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
import {ReferralKeys} from './api';
import {
	addReferralCode,
	AddReferralCodeRequestParams,
	deleteReferralCode,
	getReferralCodes,
	GetReferralCodesResponse,
	IReferralCode,
	updateReferralCode,
	UpdateReferralCodeRequestParams,
} from './Referral';

export function useGetReferralCodes(
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetReferralCodesResponse,
				XHRErrorResponse,
				GetReferralCodesResponse,
				[ReferralKeys.GetReferralCodes]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetReferralCodesResponse, XHRErrorResponse> {
	return useQuery([ReferralKeys.GetReferralCodes], () => getReferralCodes(), {
		refetchOnWindowFocus: true,
		...queryOptions,
	});
}

export function useAddReferralCode(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<
				IReferralCode,
				XHRErrorResponse,
				AddReferralCodeRequestParams
			>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<IReferralCode, XHRErrorResponse, AddReferralCodeRequestParams> {
	const queryClient = useQueryClient();
	return useMutation(
		(data: AddReferralCodeRequestParams) => addReferralCode(data),
		{
			mutationKey: [ReferralKeys.AddReferralCode],
			...queryOptions,
			onSuccess: (...args) => {
				queryClient.invalidateQueries([ReferralKeys.GetReferralCodes]);
				return queryOptions?.onSuccess?.(...args);
			},
		},
	);
}

export function useUpdateReferralCode(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<
				IReferralCode,
				XHRErrorResponse,
				UpdateReferralCodeRequestParams
			>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<
	IReferralCode,
	XHRErrorResponse,
	UpdateReferralCodeRequestParams
> {
	const queryClient = useQueryClient();
	return useMutation(
		(data: UpdateReferralCodeRequestParams) => updateReferralCode(data),
		{
			mutationKey: [ReferralKeys.UpdateReferralCode],
			...queryOptions,
			onSuccess: (...args) => {
				queryClient.invalidateQueries([ReferralKeys.GetReferralCodes]);
				return queryOptions?.onSuccess?.(...args);
			},
		},
	);
}

export function useDeleteReferralCode(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<void, XHRErrorResponse, {id: string}>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<void, XHRErrorResponse, {id: string}> {
	const queryClient = useQueryClient();
	return useMutation((req: {id: string}) => deleteReferralCode(req), {
		mutationKey: [ReferralKeys.DeleteReferralCode],
		...queryOptions,
		onSuccess: (...args) => {
			queryClient.invalidateQueries([ReferralKeys.GetReferralCodes]);
			return queryOptions?.onSuccess?.(...args);
		},
	});
}
