import React from 'react';
import {DrawerComponent} from '../Drawer';
import {Header} from '../Header';

interface IDashboardLayoutProps {
	children: React.ReactNode;
}

export const DashboardLayout: React.FC<IDashboardLayoutProps> = (props) => (
	<div className="w-screen h-screen flex box-border overflow-hidden admin-panel">
		<DrawerComponent />
		<div className="flex-1  relative bottom-0 h-full ">
			<Header />
			<div className="bg-[#EFF0F0] p-6 flex flex-col h-[calc(100vh_-_64px)] overflow-y-scroll">
				{props.children}
			</div>
		</div>
	</div>
);
