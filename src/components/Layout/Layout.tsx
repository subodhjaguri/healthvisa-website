import React from 'react';
import {DashboardLayout} from './Dashboard';

interface ILayoutProps {
	type?: 'dashboard' | 'auth';
	children: React.ReactNode;
}

export const Layout: React.FC<ILayoutProps> = (props) => {
	switch (props.type) {
		case 'dashboard':
			return <DashboardLayout>{props.children}</DashboardLayout>;
		case 'auth':
			return <div />;
		default:
			return <DashboardLayout>{props.children}</DashboardLayout>;
	}
};

Layout.defaultProps = {
	type: 'dashboard',
};
