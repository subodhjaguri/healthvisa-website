import {Menu, MenuProps} from 'antd';

import React from 'react';
import {AppstoreOutlined, NotificationOutlined} from '@ant-design/icons';

import {useRouter} from 'next/router';
import {
	MdOutlineDashboard,
	MdStorefront,
	MdBiotech,
	MdOutlineAssignment,
	MdPeople,
	MdLocalOffer,
} from 'react-icons/md';
import {
	FaUsers,
	FaUserMd,
	FaFlask,
	FaVial,
	FaVials,
	FaCalendarCheck,
	FaRegNewspaper,
	FaFileMedical,
} from 'react-icons/fa';
import Link from 'next/link';
import {getActiveRoute, getCurrentRoute} from '@healthvisa/utils/common/DrawerState';
import {BiCategoryAlt} from 'react-icons/bi';

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
		getItem('Products and Services', 'products', <MdStorefront />, [
			getItem('Categories', '/admin/categories', <BiCategoryAlt />),
			getItem('Doctors', '/admin/products', <FaUserMd />),
			getItem('Diagnostics', '/admin/diagnostics', <MdBiotech />),
			getItem('Labs', '/admin/labs', <FaFlask />),
			getItem('Tests', '/admin/tests', <FaVials />),
		]),

		getItem(<p className="p-0 m-0 w-[188px]">Peoples</p>, 'peoples', <MdPeople />, [
			getItem('Users', '/admin/users', <FaUsers />),
		]),
		getItem('Doctor Appointments', '/admin/orders', <FaCalendarCheck />),
		getItem('Lab Appointments', '/admin/lab-appointments', <FaVial />),
		getItem('EHR Reports', '/admin/documents', <FaFileMedical />),
		getItem('Health News', '/admin/news', <FaRegNewspaper />),
		getItem('User Requests', '/admin/new-members', <MdOutlineAssignment />),
		getItem('Referrals', '/admin/referral-codes', <MdLocalOffer />),
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
						{/* eslint-disable-next-line jsx-a11y/alt-text */}
						<img
							src="/images/Logo.png"
							alt="HealthiFam"
							className="h-9 w-auto object-contain"
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
