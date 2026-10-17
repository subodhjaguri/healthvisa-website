import React from 'react';
import {
	MdOutlineDashboard,
	MdBiotech,
	MdOutlineAssignment,
	MdLocalOffer,
	MdSystemUpdate,
	MdSick,
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
import {BiCategoryAlt} from 'react-icons/bi';

export interface AdminNavItem {
	label: string;
	path: string;
	icon: React.ReactNode;
}

export interface AdminNavGroup {
	title: string;
	items: AdminNavItem[];
}

/** Sidebar sections. The header breadcrumb is derived from the same list. */
export const ADMIN_NAV: AdminNavGroup[] = [
	{
		title: 'Overview',
		items: [
			{label: 'Dashboard', path: '/admin/dashboard', icon: <MdOutlineDashboard />},
		],
	},
	{
		title: 'Operations',
		items: [
			{
				label: 'Doctor Appointments',
				path: '/admin/orders',
				icon: <FaCalendarCheck />,
			},
			{
				label: 'Lab Appointments',
				path: '/admin/lab-appointments',
				icon: <FaVial />,
			},
			{
				label: 'User Requests',
				path: '/admin/new-members',
				icon: <MdOutlineAssignment />,
			},
			{label: 'EHR Reports', path: '/admin/documents', icon: <FaFileMedical />},
		],
	},
	{
		title: 'Products and Services',
		items: [
			{label: 'Categories', path: '/admin/categories', icon: <BiCategoryAlt />},
			{label: 'Symptoms', path: '/admin/symptoms', icon: <MdSick />},
			{label: 'Products & Services', path: '/admin/products', icon: <FaUserMd />},
			{label: 'Diagnostics', path: '/admin/diagnostics', icon: <MdBiotech />},
			{label: 'Labs', path: '/admin/labs', icon: <FaFlask />},
			{label: 'Tests', path: '/admin/tests', icon: <FaVials />},
		],
	},
	{
		title: 'People',
		items: [
			{label: 'Users', path: '/admin/users', icon: <FaUsers />},
			{label: 'Referrals', path: '/admin/referral-codes', icon: <MdLocalOffer />},
		],
	},
	{
		title: 'Content & Settings',
		items: [
			{label: 'Health News', path: '/admin/news', icon: <FaRegNewspaper />},
			{label: 'App Versions', path: '/admin/app-version', icon: <MdSystemUpdate />},
		],
	},
];

const NAV_ENTRIES = ADMIN_NAV.flatMap((group) =>
	group.items.map((item) => ({group, item})),
);

/** The nav entry (and its section) that owns `pathname`, e.g. /admin/labs/123 → Labs. */
export const findAdminNav = (pathname: string) =>
	NAV_ENTRIES.find(
		({item}) => pathname === item.path || pathname.startsWith(`${item.path}/`),
	);
