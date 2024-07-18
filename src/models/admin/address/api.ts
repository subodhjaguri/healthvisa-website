import {Services} from '@healthvisa/utils';

/**
 * Unique Keys for User Authentication.
 */
export enum AddressKeys {
	GetAddress = 'getAddress',
	AddAddress = 'addAddress',
	DeleteAddress = 'deleteAddress',
	UpdateAddress = 'updateAddress',
	GetAddressbyId = 'getAddressbyId',
	GetAddressbyUserId = 'getAddressbyUserId',
}

/**
 * API Endpoint for Authentication.
 */
export enum AddressAPI {
	GetAddress = '/addresses',
	AddAddress = '/addresses',
	DeleteAddress = '/addresses',
	UpdateAddress = '/addresses',
	GetAddressbyId = '/addresses',
	GetAddressbyUserId = '/address/userId',
}

export const Service: Services = 'order';
