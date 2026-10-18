import React from 'react';
import {useRouter} from 'next/router';
import {DrawerComponent} from '../Drawer';
import {Header} from '../Header';
import {NotificationWatcher} from '../NotificationWatcher';

interface IDashboardLayoutProps {
	children: React.ReactNode;
}

export const DashboardLayout: React.FC<IDashboardLayoutProps> = (props) => {
	const router = useRouter();
	// undefined = still checking (SSR / first client tick), avoids flashing the
	// protected UI before we know whether there's a token.
	const [authed, setAuthed] = React.useState<boolean | undefined>(undefined);

	React.useEffect(() => {
		if (localStorage.getItem('@healthifam-token')) {
			setAuthed(true);
		} else {
			setAuthed(false);
			router.replace('/admin');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!authed) {
		return null;
	}

	return (
		<div className="w-screen h-screen flex box-border overflow-hidden admin-panel">
			<NotificationWatcher />
			<DrawerComponent />
			{/* min-w-0: the content column fits the window (wide tables scroll
			    inside it) instead of growing past the right edge. */}
			<div className="flex-1 min-w-0 relative bottom-0 h-full">
				<Header />
				<main className="hf-content">{props.children}</main>
			</div>
		</div>
	);
};
