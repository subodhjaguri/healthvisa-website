/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {Layout} from '@healthvisa/components';
import React from 'react';
import {BiCategoryAlt} from 'react-icons/bi';
import {
	FaUsers,
	FaUserMd,
	FaFlask,
	FaVials,
	FaVial,
	FaCalendarCheck,
} from 'react-icons/fa';
import {MdBiotech, MdOutlineAssignment} from 'react-icons/md';
import {RiVipCrown2Fill} from 'react-icons/ri';
import {useRouter} from 'next/router';
import {useCategoriesCount} from '@healthvisa/models/admin/category/useCategories';
import {useProductCount} from '@healthvisa/models/admin/products/useProduct';
import {useTestsCount} from '@healthvisa/models/admin/tests/useTest';
import {useUser, useGetNewMembers} from '@healthvisa/models/admin/users/useUser';
import {useGetOrders} from '@healthvisa/models/admin/orders/useOrder';
import {
	useGetLabs,
	useDiagnosticItems,
	useGetLabAppointments,
} from '@healthvisa/models/admin/lab-appointments/useLab';

type CardValue = number | undefined;

interface IStatCard {
	icon: React.ReactNode;
	value: CardValue;
	label: string;
	color: string;
	onClick?: () => void;
	highlight?: boolean;
}

/** A single dashboard tile. `value === undefined` renders as "—" (still loading). */
const StatCard: React.FC<IStatCard> = ({
	icon,
	value,
	label,
	color,
	onClick,
	highlight,
}) => (
	<div
		onClick={onClick}
		style={{backgroundColor: color}}
		className={`w-56 h-fit p-2 flex items-center justify-between mx-6 mb-6 border rounded-lg ${
			onClick ? 'cursor-pointer' : ''
		} ${highlight && value ? 'ring-2 ring-offset-2 ring-amber-400' : ''}`}
	>
		{icon}
		<div className="flex flex-col justify-center">
			<span className="text-right text-white text-4xl font-bold">
				{value === undefined ? '—' : value}
			</span>
			<span className="text-right text-white text-xs uppercase opacity-70">
				{label}
			</span>
		</div>
	</div>
);

const Section: React.FC<{title: string; children: React.ReactNode}> = ({
	title,
	children,
}) => (
	<div className="flex flex-col mt-4 first:mt-0 bg-white p-4 shadow-xl border border-[#dde4eb] border-solid">
		<h2 className="text-lg">{title}</h2>
		<div className="flex p-5 flex-wrap justify-start">{children}</div>
	</div>
);

const ICON = {className: 'text-white', size: 30} as const;

export const Dashboard = () => {
	const router = useRouter();

	const {data: userList} = useUser();
	const {data: products} = useProductCount();
	const {data: categories} = useCategoriesCount();
	const {data: tests} = useTestsCount({}, true);
	const {data: labs} = useGetLabs();
	const {data: diagnostics} = useDiagnosticItems();
	const {data: orders} = useGetOrders();
	const {data: labAppointments} = useGetLabAppointments();
	const {data: newMembers} = useGetNewMembers();

	const now = new Date();

	// ── Needs attention (things awaiting an admin action) ──────────────────
	const pendingRequests = newMembers
		? newMembers.filter(
				(m) =>
					m.appliedFor === 'membership' &&
					!['completed', 'rejected'].includes(m.status),
		  ).length
		: undefined;
	const unconfirmedDoctor = orders
		? orders.filter((o) => o.status === 'placed').length
		: undefined;
	const unconfirmedLab = labAppointments
		? labAppointments.filter((a) => a.status === 'placed').length
		: undefined;

	// ── People ─────────────────────────────────────────────────────────────
	const totalUsers = userList?.length;
	const activeMembers = userList
		? userList.filter((u) => {
				const m = u.metadata?.membershipDetail?.[0];
				return m && (!m.endDate || new Date(m.endDate) >= now);
		  }).length
		: undefined;

	return (
		<Layout>
			<Section title="Needs attention">
				<StatCard
					icon={<MdOutlineAssignment {...ICON} />}
					value={pendingRequests}
					label="Pending Requests"
					color="#E8833A"
					highlight
					onClick={() => router.push('/admin/new-members')}
				/>
				<StatCard
					icon={<FaCalendarCheck {...ICON} />}
					value={unconfirmedDoctor}
					label="Doctor Appts to confirm"
					color="#465CA8"
					highlight
					onClick={() => router.push('/admin/orders')}
				/>
				<StatCard
					icon={<FaVial {...ICON} />}
					value={unconfirmedLab}
					label="Lab Appts to confirm"
					color="#56b5ac"
					highlight
					onClick={() => router.push('/admin/lab-appointments')}
				/>
			</Section>

			<Section title="People">
				<StatCard
					icon={<FaUsers {...ICON} />}
					value={totalUsers}
					label="Users"
					color="#465CA8"
					onClick={() => router.push('/admin/users')}
				/>
				<StatCard
					icon={<RiVipCrown2Fill {...ICON} />}
					value={activeMembers}
					label="Active Members"
					color="#E5095A"
					onClick={() => router.push('/admin/users')}
				/>
			</Section>

			<Section title="Catalog">
				<StatCard
					icon={<FaUserMd {...ICON} />}
					value={products?.count}
					label="Doctors"
					color="#93C841"
					onClick={() => router.push('/admin/products')}
				/>
				<StatCard
					icon={<BiCategoryAlt {...ICON} />}
					value={categories?.count}
					label="Categories"
					color="#0f39d2"
					onClick={() => router.push('/admin/categories')}
				/>
				<StatCard
					icon={<MdBiotech {...ICON} />}
					value={diagnostics?.length}
					label="Diagnostics"
					color="#999999"
					onClick={() => router.push('/admin/diagnostics')}
				/>
				<StatCard
					icon={<FaFlask {...ICON} />}
					value={labs?.length}
					label="Labs"
					color="#aa2ca2"
					onClick={() => router.push('/admin/labs')}
				/>
				<StatCard
					icon={<FaVials {...ICON} />}
					value={tests?.count}
					label="Tests"
					color="#e5cf08"
					onClick={() => router.push('/admin/tests')}
				/>
			</Section>
		</Layout>
	);
};
