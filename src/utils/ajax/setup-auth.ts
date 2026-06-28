import axios, {AxiosError} from 'axios';
import {isServer} from '../common';

let installed = false;

/**
 * On a 401 from an admin API call (token expired/invalid), clear the stored
 * session and bounce to the admin login. There's no admin refresh-token flow —
 * a 401 simply means "sign in again". No-op on the server, for the login
 * request itself, and when there was no session to begin with. Idempotent.
 */
export function setupAdminAuthInterceptor(): void {
	if (installed || isServer()) {
		return;
	}
	installed = true;

	axios.interceptors.response.use(
		(res) => res,
		(error: AxiosError) => {
			const status = error.response?.status;
			const url = error.config?.url ?? '';
			if (
				status === 401 &&
				!url.includes('/admin/login') &&
				localStorage.getItem('@healthifam-token')
			) {
				localStorage.removeItem('@healthifam-token');
				localStorage.removeItem('adminData');
				if (window.location.pathname !== '/admin') {
					window.location.assign('/admin');
				}
			}
			return Promise.reject(error);
		},
	);
}
