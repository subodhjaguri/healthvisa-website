import {Services} from '@healthvisa/utils';

/**
 * Unique Keys for User Authentication.
 */
export enum UserKeys {
	GetUser = 'GetUser',
	GetUserById = 'GetUserById',
	AddUser = 'addUser',
	DeleteUser = 'deleteUser',
	UpdateUser = 'updateUser',
	GetNewMembers = 'GetNewMembers',
	UpdateNewMember = 'updateNewMembers',
	AddMembershipTransaction = 'addNewMembership',
	GetMemberships = 'GetMemberships',
	RevokeMembership = 'revokeMembership',
	UpdateMembershipExpiry = 'updateMembershipExpiry',
}

/**
 * API Endpoint for Authentication.
 */
export enum UserAPI {
	GetUser = '/users',
	AddUser = '/users',
	UserById = '/users',
	DeleteUser = '/users',
	UpdateUser = '/users',
	GetNewMembers = '/new-members',
	UpdateNewMember = '/new-members',
	AddMembershipTransaction = '/membership-transactions',
	GetMemberships = '/memberships',
	RevokeMembership = '/membership-transactions/revoke',
	UpdateMembershipExpiry = '/membership-transactions/expiry',
}

export const Service: Services = 'authentication';
