import {AxiosRequestConfig, AxiosResponse, Cancel} from 'axios';

/**
 * Extension of Native Promise Interface.
 */
export interface ExtendedPromise<T> extends Promise<T> {
	/** Cancel method to call off Ajax */
	cancel?: Cancel;
	/** Reference to original Ajax Request Object */
	xhr?: AxiosRequestConfig;
}

/**
 * Error Metadata associated with XHR.
 */
export interface XHRErrorResponse<TError = unknown> {
	/** Errors sent in body of Error response */
	errors?: TError;
	/** Text Message sent in body of Error response */
	// TODO: will decide later if we want to use this
	// message?: string;
	/**
	 * Original Ajax Error response
	 * (should only be used for Instrumentation purposes)
	 */
	originalResponse?: AxiosResponse;
	/** HTTP URL Endpoint for Ajax Request */
	reqUrl: string;
	/** HTTP Status Code except 2xx */
	resStatus?: number;
	/** Boolean that represents if errored due to Timeout */
	timeout: boolean;
}

/**
 * @internal
 * Ajax Base Configuration.
 */
export interface AjaxBaseConfig<D = unknown, T = unknown, E = unknown> {
	/** HTTP Method for Ajax Request (Required) */
	method: 'get' | 'post' | 'put' | 'patch' | 'delete';
	/** HTTP URL Endpoint for Ajax Request (Required) */
	url: string;
	/** Request Cookies (Required for Server-side Data Fetching) */
	cookies?: Record<string, string>;
	/** Store to publish Debug Logs */
	debuggerStore?: Array<unknown>;
	/** Boolean flag to disable Ajax Lifecycle Events */
	disableEvents?: boolean;
	/** Request Body for POST/PUT/PATCH request */
	data?: D;
	/** Additional Headers to send with Ajax Request */
	headers?: Record<string, string>;
	/**
	 * Boolean flag to enable JSON API content request
	 * (Ref: https://jsonapi.org/format/)
	 */
	jsonApi?: boolean;
	/**
	 * Boolean flag to Ignore CSRF Token
	 * (Ref: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
	 */
	noCSRF?: boolean;
	/** Error handler for Ajax request */
	onError?: (error: XHRErrorResponse<E>) => void;
	/** Success handler for Ajax request */
	onSuccess?: (data: T, resHeaders: Record<string, string>) => void;
	/** Progress event handler for Upload Ajax Request */
	onProgress?: (progress: ProgressEvent) => void;
	/** Serializable query parameters to send with GET request */
	query?: Record<string, Primitive>;
	/** Maximum wait time before aborting Ajax due to timeout */
	timeout?: number;
	/** Boolean flag to identify a Ajax request as long running File Upload */
	upload?: boolean;
	/**
	 * Boolean flag to set `withCredentials` property `true` for Ajax
	 * (Ref: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)
	 */
	withCredentials?: boolean;
}
