import create from 'zustand';

export type NotifKind = 'orders' | 'labs' | 'requests';

export interface NotifItem {
	kind: NotifKind;
	id: string;
	title: string;
	body: string;
	route: string;
	at: string;
}

interface NotificationState {
	/** Unread counts per kind since the last acknowledge(). */
	counts: Record<NotifKind, number>;
	/** Most recent unread items (newest first, capped). */
	items: NotifItem[];
	/** Called by the watcher when new rows are detected. */
	bump: (items: NotifItem[]) => void;
	/** Called from the header bell to clear the badge + list. */
	acknowledge: () => void;
}

const EMPTY_COUNTS: Record<NotifKind, number> = {orders: 0, labs: 0, requests: 0};

/**
 * Shared between the NotificationWatcher (writes via bump) and the header bell
 * (reads counts/items, clears via acknowledge).
 */
export const useNotificationStore = create<NotificationState>((set) => ({
	counts: {...EMPTY_COUNTS},
	items: [],
	bump: (newItems) =>
		set((state) => {
			const counts = {...state.counts};
			newItems.forEach((it) => {
				counts[it.kind] += 1;
			});
			return {counts, items: [...newItems, ...state.items].slice(0, 30)};
		}),
	acknowledge: () => set({counts: {...EMPTY_COUNTS}, items: []}),
}));
