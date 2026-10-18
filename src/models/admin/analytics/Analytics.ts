import {ajaxGet, getApiUrl, Services} from '@healthvisa/utils';

const Service: Services = 'authentication';
const ANALYTICS_URL = '/admin/analytics';

export interface ICount {
	key: string;
	count: number;
}

export interface IReferralRow {
	code: string;
	referrerName: string | null;
	signups: number;
	requests: number;
	approved: number;
}

/** GET /admin/analytics: India calendar days `from`..`to`, both included. */
export interface IAnalytics {
	range: {from: string; to: string};
	includeTestData: boolean;
	generatedAt: string;
	bookings: {
		total: {doctor: number; lab: number};
		daily: {day: string; doctor: number; lab: number}[];
		statuses: {doctor: ICount[]; lab: ICount[]};
		cancellationRate: number;
		cancelledBy: ICount[];
		cancellationReasons: ICount[];
		topDoctors: ICount[];
		topSpecialities: ICount[];
		topLabs: ICount[];
		topPackages: ICount[];
		labBookingTypes: ICount[];
		labVisitTypes: ICount[];
	};
	memberships: {
		new: number;
		renewal: number;
		daily: {day: string; new: number; renewal: number; active: number}[];
		activeNow: number;
		expiringNext30Days: number;
		renewalRate: {ended: number; renewed: number; rate: number | null};
		requests: {
			received: number;
			approved: number;
			rejected: number;
			pending: number;
		};
	};
	referrals: IReferralRow[];
	users: {
		signups: number;
		daily: {day: string; count: number}[];
		becameMembers: number;
		booked: number;
		activeLast7Days: number;
		activeLast30Days: number;
		appVersions: ICount[];
	};
}

export interface IAnalyticsQuery {
	from: string;
	to: string;
	includeTestData?: boolean;
}

export function getAnalytics({
	from,
	to,
	includeTestData,
}: IAnalyticsQuery): Promise<IAnalytics> {
	return ajaxGet<IAnalytics>({
		url: getApiUrl(Service, ANALYTICS_URL),
		query: {from, to, ...(includeTestData ? {includeTestData: true} : {})},
	});
}
