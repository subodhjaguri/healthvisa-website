import {useEffect, useRef} from 'react';
import {useRouter} from 'next/router';
import {notification} from 'antd';
import {getLocalStorage, setLocalStorage} from '@healthvisa/utils/localstorage';
import {
	getNewLabAppointments,
	getNewMemberRequests,
	getNewOrders,
} from '@healthvisa/models/admin/notifications/api';
import {
	NotifItem,
	useNotificationStore,
} from '@healthvisa/zustand/useNotificationStore';
import {IOrder} from '@healthvisa/models/admin/orders/Order';
import {ILabAppointment} from '@healthvisa/models/admin/lab-appointments/Lab';
import {INewMember} from '@healthvisa/models/admin/users/User';

const LAST_SEEN_KEY = 'HV-notif-lastSeen';
const POLL_MS = 20000;
const SOUND_SRC = '/sounds/notification.wav';

interface LastSeen {
	orders: string;
	labAppointments: string;
	newMembers: string;
}

/**
 * Polls orders / lab-appointments / new-members for rows created after a
 * persisted "last seen" timestamp and raises an alarm (sound + OS banner +
 * antd toast + header-bell store bump) for anything new.
 *
 * Mounted once in DashboardLayout, so it runs on every admin page. A plain
 * setInterval is used (not React Query's refetchInterval) so polling keeps
 * running while the panel tab is in the background — the browser throttles it
 * to ~once/min when hidden, which is acceptable.
 */
export function useNotificationWatcher(): void {
	const router = useRouter();
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const lastSeenRef = useRef<LastSeen | null>(null);
	const pollingRef = useRef(false);
	const bump = useNotificationStore((s) => s.bump);

	useEffect(() => {
		if (typeof window === 'undefined') return undefined;

		const audio = new Audio(SOUND_SRC);
		audio.preload = 'auto';
		audioRef.current = audio;

		// Baseline: the first time this browser runs, record "now" silently so the
		// existing backlog never rings. After that, lastSeen persists across
		// reloads, so arrivals that happened while the panel was closed ring on the
		// next open.
		const nowIso = new Date().toISOString();
		const stored = getLocalStorage<LastSeen>(LAST_SEEN_KEY, 'json');
		const baseline: LastSeen = stored ?? {
			orders: nowIso,
			labAppointments: nowIso,
			newMembers: nowIso,
		};
		lastSeenRef.current = baseline;
		if (!stored) setLocalStorage(LAST_SEEN_KEY, baseline);

		// Browsers block audio (and we want notification permission) until a user
		// gesture. Prime both on the first click/keydown anywhere in the admin.
		const unlock = () => {
			const a = audioRef.current;
			if (a) {
				a.muted = true;
				a.play()
					.then(() => {
						a.pause();
						a.currentTime = 0;
						a.muted = false;
					})
					.catch(() => {
						a.muted = false;
					});
			}
			if ('Notification' in window && Notification.permission === 'default') {
				Notification.requestPermission().catch(() => undefined);
			}
			window.removeEventListener('click', unlock);
			window.removeEventListener('keydown', unlock);
		};
		window.addEventListener('click', unlock);
		window.addEventListener('keydown', unlock);

		const playAlarm = () => {
			const a = audioRef.current;
			if (!a) return;
			try {
				a.currentTime = 0;
				void a.play().catch(() => undefined);
			} catch {
				// audio not unlocked yet — the bell/toast still surface the event
			}
		};

		const fireBanner = (item: NotifItem) => {
			if (!('Notification' in window) || Notification.permission !== 'granted') {
				return;
			}
			try {
				const n = new Notification(item.title, {body: item.body, tag: item.id});
				n.onclick = () => {
					window.focus();
					router.push(item.route);
					n.close();
				};
			} catch {
				// ignore — some browsers throw if not invoked from a SW context
			}
		};

		const poll = async () => {
			if (pollingRef.current || !lastSeenRef.current) return;
			pollingRef.current = true;
			const seen = lastSeenRef.current;
			try {
				const [orders, labs, requests] = await Promise.all([
					getNewOrders(seen.orders).catch((): IOrder[] => []),
					getNewLabAppointments(seen.labAppointments).catch(
						(): ILabAppointment[] => [],
					),
					getNewMemberRequests(seen.newMembers).catch((): INewMember[] => []),
				]);

				const fresh: NotifItem[] = [];
				const next: LastSeen = {...seen};

				if (orders.length > 0) {
					if (orders[0].createdAt) next.orders = orders[0].createdAt;
					orders.forEach((o) =>
						fresh.push({
							kind: 'orders',
							id: o.id,
							title: 'New doctor appointment',
							body: o.uniqueOrderIdentifier
								? `Booking #${o.uniqueOrderIdentifier}`
								: 'A new consultation was booked',
							route: '/admin/orders',
							at: o.createdAt ?? nowIso,
						}),
					);
				}
				if (labs.length > 0) {
					if (labs[0].createdAt) next.labAppointments = labs[0].createdAt;
					labs.forEach((l) =>
						fresh.push({
							kind: 'labs',
							id: l.id,
							title: 'New lab appointment',
							body: l.visit ? `${l.visit} booking` : 'A new diagnostic was booked',
							route: '/admin/lab-appointments',
							at: l.createdAt,
						}),
					);
				}
				if (requests.length > 0) {
					if (requests[0].createdAt) next.newMembers = requests[0].createdAt;
					requests.forEach((m) =>
						fresh.push({
							kind: 'requests',
							id: m.id,
							title: 'New user request',
							body: m.appliedFor
								? `Requested: ${m.appliedFor}`
								: 'A new user request',
							route: '/admin/new-members',
							at: m.createdAt,
						}),
					);
				}

				if (fresh.length > 0) {
					lastSeenRef.current = next;
					setLocalStorage(LAST_SEEN_KEY, next);
					bump(fresh);
					playAlarm();
					fresh.forEach((item) => {
						fireBanner(item);
						notification.open({
							message: item.title,
							description: item.body,
							placement: 'topRight',
							duration: 6,
							onClick: () => router.push(item.route),
						});
					});
				}
			} finally {
				pollingRef.current = false;
			}
		};

		void poll();
		const intervalId = window.setInterval(() => void poll(), POLL_MS);

		return () => {
			window.clearInterval(intervalId);
			window.removeEventListener('click', unlock);
			window.removeEventListener('keydown', unlock);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}
