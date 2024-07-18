import normalize from 'normalize-object';
import {CallbackFunctionVariadicAnyReturn} from '../../@types/function';
import {isServer} from '../common';

import type {AjaxBaseConfig, XHRErrorResponse} from './ajax-base';
import {triggerError, triggerSuccess} from './ajax-events';

/**
 * @internal
 * `onSuccess` handler parameters.
 */
interface OnSuccessParams<T, E> {
	/** Ajax Configuration Object */
	config: AjaxBaseConfig<unknown, T, E>;
	/** Response Data */
	data: T | string;
	/** Response Headers */
	headers: Record<string, string>;
	/** Resolver Function */
	resolve: CallbackFunctionVariadicAnyReturn;
}

/**
 * @internal
 * Handles Success of a XHR with Promise Fulfillment.
 * @param param - `onSuccess` handler parameters.
 */
export function onSuccess<T, E>({
	config,
	data: rawData,
	headers,
	resolve,
}: OnSuccessParams<T, E>) {
	const {disableEvents, onSuccess: OnSuccessFromConfig} = config;

	/** Transform Payload Keys into camelCase */
	const data = normalize(rawData, 'camel');

	if (OnSuccessFromConfig) {
		OnSuccessFromConfig(data as T, headers);
	}

	resolve(data);

	if (!isServer() && !disableEvents) {
		triggerSuccess(data, config);
	}
}

/**
 * @internal
 * `onError` handler parameters.
 */
interface OnErrorParams<T, E> {
	/** Ajax Configuration Object */
	config: AjaxBaseConfig<unknown, T, E>;
	/** Response Error */
	error: XHRErrorResponse<E>;
	/** Response Headers */
	headers?: Record<string, string>;
	/** Rejection Function */
	reject: CallbackFunctionVariadicAnyReturn;
}

/**
 * @internal
 * Handles Failure of a XHR with Promise Rejection.
 * @param param - `onError` handler parameters.
 */
export function onError<T, E>({
	config,
	error: {errors, ...rawError},
	reject,
}: OnErrorParams<T, E>) {
	const {disableEvents, onError: onErrorFromConfig} = config;

	/** Transform Payload Keys into camelCase */
	const error = {
		...rawError,
		...(errors ? {errors: normalize(errors, 'camel')} : {}),
	};

	if (onErrorFromConfig) {
		onErrorFromConfig(error);
	}

	reject(error);

	if (!isServer() && !disableEvents) {
		triggerError(error, config);
	}
}
