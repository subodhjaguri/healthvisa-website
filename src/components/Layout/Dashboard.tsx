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
			<div className="flex-1  relative bottom-0 h-full ">
				<Header />
				<div className="bg-[#EFF0F0] p-6 flex flex-col h-[calc(100vh_-_64px)] overflow-y-scroll">
					{props.children}
				</div>
			</div>
		</div>
	);
};
