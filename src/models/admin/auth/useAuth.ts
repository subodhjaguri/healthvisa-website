import {
	useMutation,
	UseMutationOptions,
	UseMutationResult,
} from 'react-query';
import {XHRErrorResponse} from '@healthvisa/utils';
import {
	adminLogin,
	AdminLoginRequestParams,
	AdminLoginResponse,
} from './Auth';
import {AdminAuthKeys} from './api';

export function useAdminLogin(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<
				AdminLoginResponse,
				XHRErrorResponse,
				AdminLoginRequestParams
			>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<
	AdminLoginResponse,
	XHRErrorResponse,
	AdminLoginRequestParams
> {
	return useMutation(
		(params: AdminLoginRequestParams) => adminLogin(params),
		{
			mutationKey: [AdminAuthKeys.Login],
			...queryOptions,
		},
	);
}
