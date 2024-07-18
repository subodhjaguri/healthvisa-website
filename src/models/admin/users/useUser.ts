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
	addMembershipTransaction,
	AddMembershipTransactionRequestParams,
	addUser,
	AddUserPostResponse,
	deleteUser,
	EHRRequestParams,
	GetNewMemberResponse,
	getNewMembers,
	getUser,
	getUserById,
	GetUserByIdRequestParams,
	GetUserByIdResponse,
	GetUserResponse,
	giveEHRAccess,
	IUserNew,
	MembershipTransactionResponse,
	NewMemberUpdateRequestParams,
	updateNewMember,
	updateUser,
	UserDeleteRequestParams,
	UserUpdateRequestParams,
} from './User';
import {UserKeys} from './api';

export function useUser(
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetUserResponse,
				XHRErrorResponse,
				GetUserResponse,
				[UserKeys.GetUser]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetUserResponse, XHRErrorResponse> {
	return useQuery([UserKeys.GetUser], () => getUser(), {
		...queryOptions,
	});
}

export function useDeleteUser(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<void, XHRErrorResponse, UserDeleteRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<void, XHRErrorResponse, UserDeleteRequestParams> {
	const queryClient = useQueryClient();

	return useMutation((reqParams: {id: string}) => deleteUser(reqParams), {
		mutationKey: [UserKeys.DeleteUser],
		retry: 2, // Try at least Thrice before giving up
		...queryOptions,
		onSuccess(...args) {
			queryClient.invalidateQueries(UserKeys.GetUser);
			return queryOptions?.onSuccess?.(...args);
		},
	});
}

export function useAddUser(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<
				AddUserPostResponse,
				XHRErrorResponse,
				AddUserPostResponse
			>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<AddUserPostResponse, XHRErrorResponse, AddUserPostResponse> {
	const queryClient = useQueryClient();
	return useMutation((reqParams: AddUserPostResponse) => addUser(reqParams), {
		mutationKey: [UserKeys.AddUser],
		// retry: 2, // Try at least Thrice before giving up
		...queryOptions,
		onSuccess(data: AddUserPostResponse, ...rest) {
			// queryClient.setQueryData<AddUserPostResponse>([CourseKeys.CourseAdd, data.id], data);
			queryClient.invalidateQueries(UserKeys.GetUser);
			return queryOptions?.onSuccess?.(data, ...rest);
		},
	});
}

export function useUserById(
	// eslint-disable-next-line default-param-last
	queryParams: GetUserByIdRequestParams,
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetUserByIdResponse,
				XHRErrorResponse,
				GetUserByIdResponse,
				[UserKeys.GetUserById, string]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetUserByIdResponse, XHRErrorResponse> {
	return useQuery(
		[UserKeys.GetUserById, queryParams.id],
		() => getUserById(queryParams),
		{
			notifyOnChangeProps: 'tracked',
			refetchOnWindowFocus: true, // Frequency of Change would be Low
			...queryOptions,
		},
	);
}

export function useUpdateUser(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<IUserNew, XHRErrorResponse, UserUpdateRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<IUserNew, XHRErrorResponse, UserUpdateRequestParams> {
	const queryClient = useQueryClient();
	return useMutation((reqParams: UserUpdateRequestParams) => updateUser(reqParams), {
		mutationKey: [UserKeys.UpdateUser],
		retry: 2, // Try at least Thrice before giving up
		...queryOptions,
		onSuccess(data: IUserNew, ...rest) {
			queryClient.invalidateQueries(UserKeys.GetUser);
			return queryOptions?.onSuccess?.(data, ...rest);
		},
	});
}

export function useGetNewMembers(
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetNewMemberResponse,
				XHRErrorResponse,
				GetNewMemberResponse,
				[UserKeys.GetNewMembers]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetNewMemberResponse, XHRErrorResponse> {
	return useQuery([UserKeys.GetNewMembers], () => getNewMembers(), {
		...queryOptions,
	});
}

export function useUpdateNewMember(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<any, XHRErrorResponse, NewMemberUpdateRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<any, XHRErrorResponse, NewMemberUpdateRequestParams> {
	const queryClient = useQueryClient();
	return useMutation(
		(reqParams: NewMemberUpdateRequestParams) => updateNewMember(reqParams),
		{
			mutationKey: [UserKeys.UpdateNewMember],
			retry: 2, // Try at least Thrice before giving up
			...queryOptions,
			onSuccess(data: any, ...rest) {
				queryClient.invalidateQueries(UserKeys.UpdateNewMember);
				return queryOptions?.onSuccess?.(data, ...rest);
			},
		},
	);
}

export function useSelectMembership(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<
				MembershipTransactionResponse,
				XHRErrorResponse,
				AddMembershipTransactionRequestParams
			>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<
	MembershipTransactionResponse,
	XHRErrorResponse,
	AddMembershipTransactionRequestParams
> {
	return useMutation(
		(reqParams: AddMembershipTransactionRequestParams) =>
			addMembershipTransaction(reqParams),
		{
			mutationKey: [UserKeys.AddMembershipTransaction],
			// retry: 2, // Try at least Thrice before giving up
			...queryOptions,
			onSuccess(data: MembershipTransactionResponse, ...rest) {
				// queryClient.invalidateQueries({queryKey: [OrderKeys.ItemCount]});
				return queryOptions?.onSuccess?.(data, ...rest);
			},
		},
	);
}

export function useAllowEHRUser(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<IUserNew, XHRErrorResponse, EHRRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<IUserNew, XHRErrorResponse, EHRRequestParams> {
	const queryClient = useQueryClient();
	return useMutation((reqParams: EHRRequestParams) => giveEHRAccess(reqParams), {
		mutationKey: [UserKeys.UpdateUser],
		retry: 2, // Try at least Thrice before giving up
		...queryOptions,
		onSuccess(data: IUserNew, ...rest) {
			// queryClient.invalidateQueries(UserKeys.GetNewMembers);
			return queryOptions?.onSuccess?.(data, ...rest);
		},
	});
}
