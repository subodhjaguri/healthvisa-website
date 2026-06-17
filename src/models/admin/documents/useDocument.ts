import {XHRErrorResponse} from '@healthvisa/utils';
import {useQuery, UseQueryOptions, UseQueryResult} from 'react-query';
import {DocumentKeys} from './api';
import {GetDocumentsResponse, getEhrDocuments} from './Document';

export function useGetEhrDocuments(
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetDocumentsResponse,
				XHRErrorResponse,
				GetDocumentsResponse,
				[DocumentKeys.GetDocuments]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetDocumentsResponse, XHRErrorResponse> {
	return useQuery([DocumentKeys.GetDocuments], () => getEhrDocuments(), {
		refetchOnWindowFocus: true,
		...queryOptions,
	});
}
