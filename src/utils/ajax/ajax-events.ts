import {CallbackFunctionVariadicAnyReturn} from '../../@types/function';

/**
 * Set of Callbacks to handle state transition of Ajax Requests.
 */
const errorCallbacks: Set<CallbackFunctionVariadicAnyReturn> = new Set();
const successCallbacks: Set<CallbackFunctionVariadicAnyReturn> = new Set();
const beforeRequestCallbacks: Set<CallbackFunctionVariadicAnyReturn> = new Set();

/**
 * Invoke a side effect before firing Ajax Requests.
 * @param ajaxCallback - Callback function.
 */
export function onBeforeRequest(ajaxCallback: CallbackFunctionVariadicAnyReturn) {
	beforeRequestCallbacks.add(ajaxCallback);
}

/**
 * Clear side effect added to fire before Ajax Requests.
 * @param ajaxCallback - Callback function.
 */
export function offBeforeRequest(ajaxCallback: CallbackFunctionVariadicAnyReturn) {
	beforeRequestCallbacks.delete(ajaxCallback);
}

/**
 * Invoke a side effect on Failure of Ajax Requests.
 * @param errCallback - Callback function.
 */
export function onError(errCallback: CallbackFunctionVariadicAnyReturn) {
	errorCallbacks.add(errCallback);
}

/**
 * Clear side effect added to fire on Failure of Ajax Requests.
 * @param errCallback - Callback function.
 */
export function offError(errCallback: CallbackFunctionVariadicAnyReturn) {
	errorCallbacks.delete(errCallback);
}

/**
 * Invoke a side effect on Success of Ajax Requests.
 * @param successCallback - Callback function.
 */
export function onSuccess(successCallback: CallbackFunctionVariadicAnyReturn) {
	successCallbacks.add(successCallback);
}

/**
 * Clear side effect added to fire on Success of Ajax Requests.
 * @param errCallback - Callback function.
 */
export function offSuccess(successCallback: CallbackFunctionVariadicAnyReturn) {
	successCallbacks.delete(successCallback);
}

/**
 * @internal
 * Trigger Callbacks listening for `beforeRequest` Ajax event.
 * @param args - Set of Attributes related to Ajax event.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function triggerBeforeRequest(...args: any[]) {
	beforeRequestCallbacks.forEach((cb: CallbackFunctionVariadicAnyReturn) => {
		cb(...args);
	});
}

/**
 * @internal
 * Trigger Callbacks listening for `error` Ajax event.
 * @param args - Set of Attributes related to Ajax event.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function triggerError(...args: any[]) {
	errorCallbacks.forEach((cb: CallbackFunctionVariadicAnyReturn) => {
		cb(...args);
	});
}

/**
 * @internal
 * Trigger Callbacks listening for `success` Ajax event.
 * @param args - Set of Attributes related to Ajax event.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function triggerSuccess(...args: any[]) {
	successCallbacks.forEach((cb: CallbackFunctionVariadicAnyReturn) => {
		cb(...args);
	});
}
