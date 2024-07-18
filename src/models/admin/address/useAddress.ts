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

import {
	getAddress,
	IAddressNew,
	AddAddressRequestParams,
	addAddress,
	AddressDeleteRequestParams,
	deleteAddress,
	updateAddress,
	AddressUpdateRequestParams,
	GetAddressDetailRequestParams,
	getAddressById,
	GetAddressResponse,
	GetAddressByUserIdRequestParams,
	getAddressByUserID,
} from './Address';
import {AddressKeys} from './api';

/**
//  * Membership react-query wrapper
//  */
export function useAddress(
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetAddressResponse,
				XHRErrorResponse,
				GetAddressResponse,
				[AddressKeys.GetAddress]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetAddressResponse, XHRErrorResponse> {
	return useQuery([AddressKeys.GetAddress], () => getAddress(), {
		...queryOptions,
	});
}
// /**
//  * Facade over React Query Hook to add Course Information.
//  * @param reqParams - Request Parameters for POST body.
//  * @param queryOptions - Configuration Object for Mutation (optional).
//  * @returns A Hook with Mutation Results for Course Information.
//  */
export function useAddAddress(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<IAddressNew, XHRErrorResponse, AddAddressRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<IAddressNew, XHRErrorResponse, AddAddressRequestParams> {
	const queryClient = useQueryClient();
	return useMutation((reqParams: AddAddressRequestParams) => addAddress(reqParams), {
		mutationKey: [AddressKeys.AddAddress],
		retry: 2, // Try at least Thrice before giving up
		...queryOptions,
		onSuccess(data: IAddressNew, ...rest) {
			queryClient.invalidateQueries(AddressKeys.GetAddressbyUserId);
			return queryOptions?.onSuccess?.(data, ...rest);
		},
	});
}

/**
 * Facade over React Query Hook to delete Course Information.
 * @param reqParams - Request Parameters for DELETE body.
 * @param queryOptions - Configuration Object for Mutation (optional).
 * @returns A Hook with Mutation Results for Course Information.
 */
export function useDeleteAddress(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<void, XHRErrorResponse, AddressDeleteRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<void, XHRErrorResponse, AddressDeleteRequestParams> {
	const queryClient = useQueryClient();

	return useMutation((reqParams: {id: string}) => deleteAddress(reqParams), {
		mutationKey: [AddressKeys.DeleteAddress],
		retry: 1, // Try at least Thrice before giving up
		...queryOptions,
		onSuccess(...args) {
			queryClient.invalidateQueries(AddressKeys.GetAddressbyUserId);
			return queryOptions?.onSuccess?.(...args);
		},
	});
}
/**
 * Facade over React Query Hook to delete Course Information.
 * @param reqParams - Request Parameters for DELETE body.
 * @param queryOptions - Configuration Object for Mutation (optional).
 * @returns A Hook with Mutation Results for Course Information.
 */

export function useUpdateAddress(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<IAddressNew, XHRErrorResponse, AddressUpdateRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<IAddressNew, XHRErrorResponse, AddressUpdateRequestParams> {
	const queryClient = useQueryClient();
	return useMutation(
		(reqParams: AddressUpdateRequestParams) => updateAddress(reqParams),
		{
			mutationKey: [AddressKeys.UpdateAddress],
			retry: 1, // Try at least Thrice before giving up
			...queryOptions,
			onSuccess(data: IAddressNew, ...rest) {
				queryClient.invalidateQueries(AddressKeys.GetAddressbyUserId);
				return queryOptions?.onSuccess?.(data, ...rest);
			},
		},
	);
}

/**
 * Address get by ID
 */
export function useAddressGetById(
	queryParams: GetAddressDetailRequestParams,
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				IAddressNew,
				XHRErrorResponse,
				IAddressNew,
				[AddressKeys.GetAddressbyId, string]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<IAddressNew, XHRErrorResponse> {
	return useQuery(
		[AddressKeys.GetAddressbyId, queryParams.id],
		() => getAddressById(queryParams),
		{
			notifyOnChangeProps: 'tracked',
			refetchOnWindowFocus: true, // Frequency of Change would be Low
			...queryOptions,
		},
	);
}
export function useAddressByUserId(
	queryParams: GetAddressByUserIdRequestParams,
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				IAddressNew[],
				XHRErrorResponse,
				IAddressNew[],
				[AddressKeys.GetAddressbyUserId, string]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<IAddressNew[], XHRErrorResponse> {
	return useQuery(
		[AddressKeys.GetAddressbyUserId, queryParams.userId],
		() => getAddressByUserID(queryParams),
		{
			notifyOnChangeProps: 'tracked',
			refetchOnWindowFocus: true, // Frequency of Change would be Low
			...queryOptions,
		},
	);
}
