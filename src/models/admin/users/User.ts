import {
	ajaxDelete,
	ajaxGet,
	ajaxPatch,
	ajaxPost,
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
	// Referral attribution — set at registration, backfilled at first membership.
	referralCode?: string;
	referrerName?: string;
}

export type GetUserResponse = IUserNew[];
/**
 * Get all Users
 */
export function getUser(): Promise<GetUserResponse> {
	return ajaxGet<GetUserResponse>({
		url: getApiUrl(Service, UserAPI.GetUser),
		query: {filter: '{"order": "createdAt DESC"}'},
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
	isActive: boolean;
	// uniqueId = the "membership ID" printed on the app card. It's a plain user
	// field, so admins edit it inline with the rest of the user's details.
	uniqueId?: number;
}
export function updateUser({...requestBody}: UserUpdateRequestParams): Promise<IUserNew> {
	const {id, mobileNumber, name, userName, isActive, uniqueId} = requestBody;
	const data: Record<string, Primitive> = {
		id,
		mobileNumber,
		name,
		userName,
		isActive,
	};
	if (uniqueId !== undefined) {
		data.uniqueId = uniqueId;
	}
	// PATCH (partial), not PUT: replaceById would wipe fields we don't send
	// (password, isEHR, referralCode, metadata.membershipDetail).
	return ajaxPatch<Record<string, Primitive>, IUserNew>({
		data,
		url: `${getApiUrl(Service, UserAPI.UpdateUser)}/${id}`,
	});
}

// Admin: override a user's membership expiry (for offline-collected renewals).
// endDate is an ISO string; backend updates the latest membership row + the
// user's snapshot. Lives on the 'card' service (same as membership-transactions).
export interface UpdateMembershipExpiryRequestParams {
	userId: string;
	endDate: string;
}
export function updateMembershipExpiry({
	userId,
	endDate,
}: UpdateMembershipExpiryRequestParams): Promise<any> {
	return ajaxPatch<{endDate: string}, any>({
		data: {endDate},
		url: `${getApiUrl('card', UserAPI.UpdateMembershipExpiry)}/${userId}`,
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
	metadata?: any;
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

// Membership plans (catalog) — used to show the plan name in admin views.
export interface IMembershipPlan {
	id: string;
	title: string;
	validity?: string;
	discountPrice?: number;
}

export function getMemberships(): Promise<IMembershipPlan[]> {
	return ajaxGet<IMembershipPlan[]>({
		// Plans live on the 'card' service (same as membership-transactions).
		url: getApiUrl('card', UserAPI.GetMemberships),
	});
}

// Admin: immediately revoke a user's active membership.
export function revokeMembership(userId: string): Promise<{revoked: number}> {
	return ajaxPost<{}, {revoked: number}>({
		data: {},
		url: `${getApiUrl('card', UserAPI.RevokeMembership)}/${userId}`,
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
	// 'renewal' makes the backend stack the new period onto remaining time +
	// link the previous membership; defaults to 'new'.
	source?: 'new' | 'renewal';
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
	const {
		userId,
		membershipId,
		optedAt,
		isActive,
		metadata,
		createdAt,
		updatedAt,
		source,
	} = requestBody;

	const data: AddMembershipTransactionRequestParams = {
		userId,
		membershipId,
		optedAt,
		isActive,
		metadata,
		createdAt,
		updatedAt,
		...(source ? {source} : {}),
	};

	return ajaxPost<AddMembershipTransactionRequestParams, MembershipTransactionResponse>(
		{
			data,
			url: getApiUrl('card', UserAPI.AddMembershipTransaction),
		},
	);
}

export interface IFamilyMember {
	id?: string;
	name: string;
	age: number;
	gender?: string;
	userId: string;
	relationship?: string;
	metadata?: {phone?: string};
	createdAt?: string;
	updatedAt?: string;
}

export function getFamilyMembersByUserId(userId: string): Promise<IFamilyMember[]> {
	return ajaxGet<IFamilyMember[]>({
		url: `${getApiUrl('card', '/family-members/userId')}/${userId}`,
	});
}

export function addFamilyMember(data: Omit<IFamilyMember, 'id'>): Promise<IFamilyMember> {
	return ajaxPost<Omit<IFamilyMember, 'id'>, IFamilyMember>({
		data,
		url: getApiUrl('card', '/family-members'),
	});
}

export function updateFamilyMember(id: string, data: Partial<IFamilyMember>): Promise<void> {
	return ajaxPatch<Partial<IFamilyMember>, void>({
		data,
		url: `${getApiUrl('card', '/family-members')}/${id}`,
	});
}

export function deleteFamilyMember(id: string): Promise<void> {
	return ajaxDelete<void>({
		url: `${getApiUrl('card', '/family-members')}/${id}`,
	});
}

