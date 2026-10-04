import {XHRErrorResponse} from '@healthvisa/utils';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {getAppVersion, IAppVersion, updateAppVersion} from './AppVersion';

const KEY = 'getAppVersion';

export function useGetAppVersion() {
	// No refetch on window focus: it would overwrite values typed but not saved.
	return useQuery<IAppVersion, XHRErrorResponse>([KEY], getAppVersion, {
		refetchOnWindowFocus: false,
	});
}

export function useUpdateAppVersion() {
	const queryClient = useQueryClient();
	return useMutation<IAppVersion, XHRErrorResponse, Partial<IAppVersion>>(
		updateAppVersion,
		{
			onSuccess: (data) => {
				queryClient.setQueryData([KEY], data);
			},
		},
	);
}
