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
}

export const Service: Services = 'authentication';
