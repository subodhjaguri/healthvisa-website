import {isServer} from '../common';

export {};

export function setLocalStorage(key: string, value: any) {
	if (!isServer()) {
		localStorage.setItem(key, JSON.stringify(value));
	}
}
export function getLocalStorage<T = string>(
	key: string,
	type: 'string' | 'json' = 'json',
) {
	if (!isServer()) {
		const str = localStorage.getItem(key);

		if (type === 'json') {
			return str === null ? null : (JSON.parse(str) as T | null);
		}
		return str === null ? null : (str as unknown as T | null);
	}
	return null;
}
