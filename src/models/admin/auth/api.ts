import {Services} from '@healthvisa/utils';

/** Unique Keys for Admin Authentication. */
export enum AdminAuthKeys {
	Login = 'adminLogin',
}

/** API Endpoints for Admin Authentication. */
export enum AdminAuthAPI {
	Login = '/admin/login',
}

export const Service: Services = 'authentication';
