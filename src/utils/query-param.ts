import qs from 'qs';

/**
 * Transforms Key Value Pairs into Serialzed String.
 * @param query - Key Value Pairs of Query Parameters.
 * @returns Serialized Query String.
 */
export function toQueryString(query: Record<string, unknown>) {
	return qs.stringify(query, {arrayFormat: 'indices'});
}

/**
 *
 * @param path - Base URI of a Resource.
 * @param query - Key Value Pairs of Query Parameters.
 * @returns Final URI of the Resource with Query Parameter String appened.
 */
export function addQueryToPath(path: string, query: Record<string, unknown>): string {
	return `${path}?${toQueryString(query)}`;
}

/**
 * Extracts Query Parameters from URI.
 * @param location - URI of a Resource.
 * @returns Key Value Pairs of Query Parameters.
 */
export function getQueryFromLocation(location: Location) {
	return qs.parse(location.search.replace('?', ''));
}

/**
 * Transforms Key Value Pairs into Serialzed String.
 * @param query - Key Value Pairs of Query Parameters.
 * @returns Serialized Query String.
 */
export function apiQueryString(query: Record<string, unknown>) {
	return qs.stringify(query, {encode: false});
}
