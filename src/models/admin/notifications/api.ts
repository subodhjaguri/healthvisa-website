import {ajaxGet, getApiUrl} from '@healthvisa/utils';
import {IOrder} from '@healthvisa/models/admin/orders/Order';
import {ILabAppointment} from '@healthvisa/models/admin/lab-appointments/Lab';
import {INewMember} from '@healthvisa/models/admin/users/User';

/**
 * Admin "new notification" detection.
 *
 * Each fetcher returns only rows created strictly after `since` (ISO string),
 * newest first, capped. This is the "new-since timestamp" strategy: the admin
 * watcher keeps a per-collection `lastSeen` in localStorage and polls these.
 * All three collections support LoopBack's generic `where` filter, so no new
 * backend endpoint is needed (Order gained a server-set `createdAt` field).
 */
function newSinceFilter(since: string): string {
	return JSON.stringify({
		where: {createdAt: {gt: since}},
		order: 'createdAt DESC',
		limit: 25,
	});
}

export function getNewOrders(since: string): Promise<IOrder[]> {
	return ajaxGet<IOrder[]>({
		url: getApiUrl('order', '/orders'),
		query: {filter: newSinceFilter(since)},
	});
}

export function getNewLabAppointments(since: string): Promise<ILabAppointment[]> {
	return ajaxGet<ILabAppointment[]>({
		url: getApiUrl('product', '/lab-appointments'),
		query: {filter: newSinceFilter(since)},
	});
}

export function getNewMemberRequests(since: string): Promise<INewMember[]> {
	return ajaxGet<INewMember[]>({
		url: getApiUrl('authentication', '/new-members'),
		query: {filter: newSinceFilter(since)},
	});
}
