import {XHRErrorResponse} from '@healthvisa/utils';
import {useQuery} from 'react-query';
import {getAnalytics, IAnalytics, IAnalyticsQuery} from './Analytics';

export function useGetAnalytics(query: IAnalyticsQuery) {
	return useQuery<IAnalytics, XHRErrorResponse>(
		['getAnalytics', query.from, query.to],
		() => getAnalytics(query),
		// Keep the previous range on screen while the next one loads.
		{keepPreviousData: true, refetchOnWindowFocus: false},
	);
}
