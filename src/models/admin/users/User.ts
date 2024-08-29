import {
	ajaxDelete,
	ajaxGet,
	ajaxPatch,
	ajaxPost,
	ajaxPut,
	getApiUrl,
} from '@healthvisa/utils';
import {UserAPI, Service} from './api';

export interface IUserNew {
	id: string;
	mobileNumber: string;
	name: string;
	userName: string;
	metadata: any;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	isEHR: boolean;
	uniqueId: number;
}

export type GetUserResponse = IUserNew[];
/**
 * Get all Users
 */
export function getUser(): Promise<GetUserResponse> {
	return ajaxGet<GetUserResponse>({
		url: getApiUrl(Service, UserAPI.GetUser),
	});
}
/**
 * Request Parameter for Deleting a User
 */

export interface UserDeleteRequestParams {
	id: string;
}
export function deleteUser({id}: UserDeleteRequestParams): Promise<void> {
	return ajaxDelete<void>({
		url: `${getApiUrl(Service, UserAPI.DeleteUser)}/${id}`,
	});
}

export interface AddUserPostResponse {
	mobileNumber: string;
	name: string;
	userName: string;
	metadata: object;
	isActive: boolean;
}

export function addUser({...requestBody}: AddUserPostResponse): Promise<IUserNew> {
	const {mobileNumber, name, userName, metadata, isActive} = requestBody;
	const data: Record<string, Primitive> = {
		mobileNumber,
		name,
		userName,
		metadata,
		isActive,
	};
	return ajaxPost<Record<string, Primitive>, IUserNew>({
		data,
		url: getApiUrl(Service, UserAPI.AddUser),
	});
}
export interface UserUpdateRequestParams {
	id: string;
	mobileNumber: string;
	name: string;
	userName: string;
	metadata: object;
	isActive: boolean;
}
export function updateUser({...requestBody}: UserUpdateRequestParams): Promise<IUserNew> {
	const {id, mobileNumber, name, userName, metadata, isActive} = requestBody;
	const data: Record<string, Primitive> = {
		id,
		mobileNumber,
		name,
		userName,
		metadata,
		isActive,
	};
	return ajaxPut<Record<string, Primitive>, IUserNew>({
		data,
		url: `${getApiUrl(Service, UserAPI.UpdateUser)}/${id}`,
	});
}

export interface EHRRequestParams {
	id: string;
	isEHR: boolean;
}

export function giveEHRAccess({...requestBody}: EHRRequestParams): Promise<IUserNew> {
	const {id, isEHR} = requestBody;
	const data: Record<string, Primitive> = {
		id,
		isEHR,
	};
	return ajaxPatch<Record<string, Primitive>, IUserNew>({
		data,
		url: `${getApiUrl(Service, UserAPI.UpdateUser)}/${id}`,
	});
}

export interface GetUserByIdRequestParams {
	id: string;
}
export type GetUserByIdResponse = IUserNew;
export function getUserById({
	id,
}: GetUserByIdRequestParams): Promise<GetUserByIdResponse> {
	return ajaxGet<GetUserByIdResponse>({
		url: getApiUrl(Service, `${UserAPI.UserById}/${id}`),
	});
}

export interface INewMember {
	id: string;
	userId: string;
	status: string;
	appliedFor: string;
	createdAt: string;
}

export type GetNewMemberResponse = INewMember[];
/**
 * Get all New Members
 */
export function getNewMembers(): Promise<GetNewMemberResponse> {
	return ajaxGet<GetNewMemberResponse>({
		url: getApiUrl(Service, UserAPI.GetNewMembers),
		query: {
			filter: `{"order": "createdAt DESC"}`,
		},
	});
}

// Update new member status
export interface NewMemberUpdateRequestParams {
	id: string;
	status: string;
}
export function updateNewMember({
	...requestBody
}: NewMemberUpdateRequestParams): Promise<any> {
	const {id, status} = requestBody;
	const data: Record<string, Primitive> = {
		id,
		status,
	};
	return ajaxPatch<Record<string, Primitive>, any>({
		data,
		url: `${getApiUrl(Service, UserAPI.UpdateNewMember)}/${id}`,
	});
}

export interface AddMembershipTransactionRequestParams {
	userId: string;
	membershipId: string;
	optedAt: Date;
	isActive: boolean;
	metadata: object;
	createdAt: Date;
	updatedAt: Date;
}

export interface MembershipTransactionResponse {
	id: string;
	userId: string;
	membershipId: string;
	optedAt: Date;
	isActive: boolean;
	metadata: object;
	createdAt: Date;
	updatedAt: Date;
}

export function addMembershipTransaction({
	...requestBody
}: AddMembershipTransactionRequestParams): Promise<MembershipTransactionResponse> {
	const {userId, membershipId, optedAt, isActive, metadata, createdAt, updatedAt} =
		requestBody;

	const data: AddMembershipTransactionRequestParams = {
		userId,
		membershipId,
		optedAt,
		isActive,
		metadata,
		createdAt,
		updatedAt,
	};

	return ajaxPost<AddMembershipTransactionRequestParams, MembershipTransactionResponse>(
		{
			data,
			url: getApiUrl('card', UserAPI.AddMembershipTransaction),
		},
	);
}
