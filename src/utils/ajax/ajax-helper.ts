import Cookies from 'js-cookie';
import qs from 'qs';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {CallbackFunctionVariadicAnyReturn} from '../../@types/function';
import {isServer} from '../common';
import {addQueryToPath} from '../query-param';

import type {AjaxBaseConfig, XHRErrorResponse} from './ajax-base';
import {onError, onSuccess} from './ajax-response';

/**
 * @internal
 * Updates URI with provided Query Parameters.
 * @param url - Base URI for a Resource.
 * @param query - Additional Query Parameters.
 * @returns Complete URI of the Resource
 */
function getRequestURL(url: string, query: Record<string, Primitive> = {}): string {
	const [pathname, search] = url.split('?');
	const queryParams = {...query, ...qs.parse(search)};
	return Object.keys(queryParams).length > 0
		? addQueryToPath(pathname, queryParams)
		: pathname;
}

/**
 * @internal
 * Generates Cookie string to be sent with Request.
 * @param cookies - Cookies as Key Value pairs.
 * @returns Serialized and UI Encoded Cookie string.
 */
function getRequestCookies(cookies: Record<string, string>): string {
	return Object.entries(cookies).reduce(
		(cookieString: string, [key, value]: [string, string]) => {
			const encodedValue = encodeURIComponent(value);
			return `${cookieString}${key}=${encodedValue};`;
		},
		'',
	);
}

/**
 * @internal
 * Helper function to create a SuperAgent request instance with provided configuration.
 * @param param - An object encapsulating Ajax Configuration, Resolver Function and Rejection Function.
 * @returns Request object.
 */
export function makeAjaxCall<D, T, E>({
	config,
	resolve,
	reject,
}: {
	/** Ajax Configuration Object */
	config: AjaxBaseConfig<D, T, E>;
	/** Resolver Function reference from Executor Function */
	resolve: CallbackFunctionVariadicAnyReturn;
	/** Rejection Function reference from Executor Function */
	reject: CallbackFunctionVariadicAnyReturn;
}) {
	const {
		cookies,
		data: reqData,
		debuggerStore,
		headers,
		jsonApi,
		method,
		noCSRF,
		onProgress,
		query,
		upload,
		url,
	} = config;

	const reqHeaders: Record<string, string> = {
		Accept: 'application/json',
		...headers,
	};

	if (cookies) {
		reqHeaders['Cookie'] = getRequestCookies(cookies);
	}

	if (!reqHeaders['Content-Type'] && !reqHeaders['content-type'] && !upload) {
		reqHeaders['Content-Type'] = 'application/json';
	}

	if (jsonApi) {
		reqHeaders['Accept'] = 'application/vnd.api+json';
		if (method && method !== 'get') {
			reqHeaders['Content-Type'] = 'application/vnd.api+json';
		}
	}

	if (!noCSRF) {
		/**
		 * In Server, Cookies must be passed and `csrfToken` should be present.
		 * In Browser, the `csrfToken` would be available in `document.cookies` and extracted from it.
		 */
		if (!isServer()) {
			reqHeaders['X-CSRFToken'] = Cookies.get('csrftoken') ?? '';
		} else if (cookies?.csrftoken) {
			reqHeaders['X-CSRFToken'] = cookies.csrftoken;
		}
	}

	const reqUrl = getRequestURL(url, query);
	const requestMethod = axios.request;

	const xhr = requestMethod({
		url: reqUrl,
		method,
		data: reqData,
		headers: {
			...reqHeaders,
			// TODO: Fix required for authorization
			Authorization: !isServer()
				? `Bearer ${localStorage.getItem('@tieet-token')}`
				: '',
		},
		onUploadProgress: upload && onProgress ? onProgress : undefined,
	});

	xhr.then(
		({headers: headersFromAxiosResponse, data}: AxiosResponse) => {
			debuggerStore?.push({
				time: new Date().toISOString(),
				url: `Ajax request completed for ${url}`,
			});

			onSuccess<T, E>({
				config,
				data: data as T,
				headers: headersFromAxiosResponse,
				resolve,
			});
		},
		(err: AxiosError<E> & {timeout?: boolean}) => {
			const {response: res, timeout: timeoutFromError} = err;

			debuggerStore?.push({
				time: new Date().toISOString(),
				url: `Ajax request errored for ${url}`,
			});

			// Serialize original response object
			let trimmedRes: AxiosResponse | undefined;
			try {
				trimmedRes = JSON.parse(JSON.stringify(res));
			} catch (e) /* istanbul ignore next */ {
				trimmedRes = res;
			}

			const errRes: XHRErrorResponse<E> = {
				originalResponse: trimmedRes,
				reqUrl,
				resStatus: res?.status,
				timeout: !!timeoutFromError,
			};

			const {data} = res ?? {};

			/** Body can either contain all the errors or a single description inside `details` property */
			if (data) {
				errRes.errors = data;
			}

			onError<T, E>({config, error: errRes, reject});
		},
	);

	return xhr;
}
