import {useNotificationWatcher} from '@healthvisa/hooks/useNotificationWatcher';

/**
 * Headless component: mounts the new-notification watcher. Rendered once inside
 * DashboardLayout so the alarm runs on every admin page.
 */
export const NotificationWatcher = () => {
	useNotificationWatcher();
	return null;
};

export default NotificationWatcher;
