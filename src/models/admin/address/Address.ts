import {ajaxDelete, ajaxGet, ajaxPost, ajaxPut, getApiUrl} from '@healthvisa/utils';
import {AddressAPI, Service} from './api';

export interface IAddressNew {
	id: string;
	userID: string;
	addressType: string;
	addressLine1: string;
	addressLine2: string;
	pin: string;
	city: string;
	state: string;
	country: string;
	metaData?: object;
	isActive: boolean;
	isDeleted: boolean;
	createdBy?: string;
	createdAt?: Date;
	updatedAt?: Date;
}
/**
 * Response Model for `getAddress()` call
 */
export type GetAddressResponse = IAddressNew[];
/**
 * Get all Address
 */
export function getAddress(): Promise<GetAddressResponse> {
	console.log('Get API', getApiUrl(Service, AddressAPI.GetAddress));

	return ajaxGet<GetAddressResponse>({
		url: getApiUrl(Service, AddressAPI.GetAddress),
	});
}

// for add Address (post)

export interface AddAddressRequestParams {
	userID: string;
	addressType: string;
	addressLine1: string;
	addressLine2: string;
	pin: string;
	city: string;
	state: string;
	country: string;
	metaData: object;
	isActive: boolean;
	isDeleted: boolean;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
}

// /**
//  * Incoming Parameters for `addAddress()` call
//  */

export function addAddress({
	...requestBody
}: AddAddressRequestParams): Promise<IAddressNew> {
	const {
		userID,
		addressType,
		addressLine1,
		addressLine2,
		pin,
		city,
		state,
		country,
		metaData,
		isActive,
		isDeleted,
		createdBy,
		createdAt,
		updatedAt,
	} = requestBody;

	const data: AddAddressRequestParams = {
		userID,
		addressType,
		addressLine1,
		addressLine2,
		pin,
		city,
		state,
		country,
		metaData,
		isActive,
		isDeleted,
		createdBy,
		createdAt,
		updatedAt,
	};

	return ajaxPost<AddAddressRequestParams, IAddressNew>({
		data,
		url: getApiUrl(Service, AddressAPI.AddAddress),
	});
}

// for Delete Address (delete)

/**
 * Request Parameter for Deleting an ExistingAddress
 */

export interface AddressDeleteRequestParams {
	id: string;
}
export function deleteAddress({id}: AddressDeleteRequestParams): Promise<void> {
	return ajaxDelete<void>({
		url: `${getApiUrl(Service, AddressAPI.DeleteAddress)}/${id}`,
	});
}
// for update Address (update)

export interface AddressUpdateRequestParams {
	id: string;
	userID: string;
	addressType: string;
	addressLine1: string;
	addressLine2: string;
	pin: string;
	city: string;
	state: string;
	country: string;
	metaData?: object;
	isActive: boolean;
	isDeleted: boolean;
	createdBy?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

type AddressPrimitives = string | boolean | undefined | Date | object | any[];

/**
 * Incoming Parameters for `addCourse()` call
 */

export function updateAddress({
	...requestBody
}: AddressUpdateRequestParams): Promise<IAddressNew> {
	const {
		id,
		userID,
		addressType,
		addressLine1,
		addressLine2,
		pin,
		city,
		state,
		country,
		metaData,
		isActive,
		isDeleted,
		createdBy,
		createdAt,
		updatedAt,
	} = requestBody;

	const data: Record<string, AddressPrimitives> = {
		id,
		userID,
		addressType,
		addressLine1,
		addressLine2,
		pin,
		city,
		state,
		country,
		metaData,
		isActive,
		isDeleted,
		createdBy,
		createdAt,
		updatedAt,
	};
	return ajaxPut<Record<string, AddressPrimitives>, IAddressNew>({
		data,
		url: `${getApiUrl(Service, AddressAPI.UpdateAddress)}/${id}`,
	});
}

/**
 * Get addressbyID
 */
export interface GetAddressDetailRequestParams {
	id: string;
}

export function getAddressById({
	id,
}: GetAddressDetailRequestParams): Promise<IAddressNew> {
	return ajaxGet<IAddressNew>({
		url: `${getApiUrl(Service, AddressAPI.GetAddressbyId)}/${id}`,
	});
}

export interface GetAddressByUserIdRequestParams {
	userId: string;
}

export function getAddressByUserID({
	userId,
}: GetAddressByUserIdRequestParams): Promise<IAddressNew[]> {
	return ajaxGet<IAddressNew[]>({
		url: `${getApiUrl(Service, AddressAPI.GetAddressbyUserId)}/${userId}`,
	});
}
