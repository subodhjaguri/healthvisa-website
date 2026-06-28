import {ajaxPost, getApiUrl} from '@healthvisa/utils';
import {AdminAuthAPI, Service} from './api';

export interface AdminLoginRequestParams {
	email: string;
	password: string;
}

export interface AdminInfo {
	id: string;
	email: string;
	name?: string;
}

export interface AdminLoginResponse {
	accessToken: string;
	admin: AdminInfo;
}

/** POST /admin/login — email + password → admin-scoped access token. */
export function adminLogin(
	data: AdminLoginRequestParams,
): Promise<AdminLoginResponse> {
	return ajaxPost<AdminLoginRequestParams, AdminLoginResponse>({
		data,
		url: getApiUrl(Service, AdminAuthAPI.Login),
	});
}
