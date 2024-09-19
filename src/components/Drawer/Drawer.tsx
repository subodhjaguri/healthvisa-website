import {Menu, MenuProps} from 'antd';

import React from 'react';
import {AppstoreOutlined, NotificationOutlined} from '@ant-design/icons';

import {useRouter} from 'next/router';
import {
	MdLocationOn,
	MdLocationCity,
	MdOutlineDashboard,
	MdOutlineMedicalServices,
	MdAdminPanelSettings,
	MdPeople,
} from 'react-icons/md';
import {FaUsers, FaBoxOpen} from 'react-icons/fa';
import Link from 'next/link';
import {getActiveRoute, getCurrentRoute} from '@healthvisa/utils/common/DrawerState';
import {BiCategoryAlt} from 'react-icons/bi';
import {GiMedicines} from 'react-icons/gi';
import Image from 'next/image';

export const DrawerComponent = () => {
	const router = useRouter();
	type MenuItem = Required<MenuProps>['items'][number];

	function getItem(
		label: React.ReactNode,
		key: React.Key,
		icon?: React.ReactNode,
		children?: MenuItem[],
		type?: 'group',
	): MenuItem {
		return {
			key,
			icon,
			children,
			label,
			type,
		} as MenuItem;
	}

	type NavigationLink = {
		name: string;
		path?: string;
		icon: JSX.Element;
		subRoutes?: NavigationLink[];
		title?: string;
	};

	console.log('getCurrentRoute: ', getCurrentRoute(router), router.pathname);

	const items: MenuProps['items'] = [
		getItem('Dashboard', '/admin/dashboard', <MdOutlineDashboard />),
		getItem('Products and Services', 'products', <MdOutlineMedicalServices />, [
			// getItem('Areas', '/admin/area', <MdLocationOn />),
			getItem('Services', '/admin/categories', <BiCategoryAlt />),
			getItem('Doctors', '/admin/products', <GiMedicines />),
			getItem('Diagnostics', '/admin/diagnostics', <GiMedicines />),
			getItem('Wellnes Services', '/admin/wellness-services', <GiMedicines />),
			getItem('Other Services', '/admin/other-services', <GiMedicines />),
		]),

		getItem(<p className="p-0 m-0 w-[188px]">Peoples</p>, 'peoples', <MdPeople />, [
			getItem('Users', '/admin/users', <FaUsers />),
		]),
		getItem('Doctor Appointments', '/admin/orders', <FaBoxOpen />),
		getItem('Diagnostic services', '/admin/lab-appointments', <FaBoxOpen />),
		getItem('User Requests', '/admin/new-members', <MdAdminPanelSettings />),
	];
	const onClick: MenuProps['onClick'] = (e) => {
		router.push(e.key);
	};
	return (
		<div className="w-[300px] flex flex-col h-screen">
			<div className="w-[300px] h-16 p-2 flex justify-center items-center">
				<Link href="/admin/dashboard">
					{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
					<a className="pt-[6px]">
						<Image
							src="/logo.png"
							height={55}
							width={250}
							objectFit="contain"
						/>
					</a>
				</Link>
			</div>
			<Menu
				style={{width: '100%', color: '#B7C0CD', flex: 1}}
				onClick={onClick}
				defaultOpenKeys={[getCurrentRoute(router)]}
				mode="inline"
				items={items}
				selectedKeys={[getActiveRoute(router)]}
				theme="dark"
			/>
		</div>
	);
};
