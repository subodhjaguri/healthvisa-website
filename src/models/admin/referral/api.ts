import {Services} from '@healthvisa/utils';

/**
 * Unique Keys for Referral Codes.
 */
export enum ReferralKeys {
	GetReferralCodes = 'getReferralCodes',
	AddReferralCode = 'addReferralCode',
	UpdateReferralCode = 'updateReferralCode',
	DeleteReferralCode = 'deleteReferralCode',
}

/**
 * API Endpoints for Referral Codes.
 */
export enum ReferralAPI {
	GetReferralCodes = '/referral-codes',
	AddReferralCode = '/referral-codes',
	UpdateReferralCode = '/referral-codes',
	DeleteReferralCode = '/referral-codes',
}

export const Service: Services = 'card';
