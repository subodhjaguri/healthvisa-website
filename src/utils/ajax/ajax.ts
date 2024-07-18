import {isServer} from '../common';
import {AjaxBaseConfig, ExtendedPromise} from './ajax-base';
import {triggerBeforeRequest} from './ajax-events';
import {makeAjaxCall} from './ajax-helper';

/**
 * @internal
 * Base Ajax method that handles XHR creation based upon recieved Configuration.
 * @param config - Ajax Configuration Object.
 * @returns An Extended Promise object.
 */
export function ajax<D, T, E>(config: AjaxBaseConfig<D, T, E>): ExtendedPromise<T> {
	const promise: ExtendedPromise<T> = new Promise<T>((resolve, reject) => {
		const {debuggerStore, disableEvents, url} = config;

		debuggerStore?.push({
			time: new Date().toISOString(),
			url: `Ajax request started for ${url}`,
		});

		if (!isServer() && !disableEvents) {
			triggerBeforeRequest(config);
		}

		makeAjaxCall<D, T, E>({config, resolve, reject});
	});

	return promise;
}
