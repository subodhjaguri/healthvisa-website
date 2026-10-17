/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {Layout} from '@healthvisa/components';
import React from 'react';
import {Tooltip} from 'antd';
import {ArrowRightOutlined} from '@ant-design/icons';
import moment from 'moment';
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
import {isDayPast} from '@healthvisa/utils/tableFilter';
import {addColorAlpha} from '@healthvisa/utils/color';

type CardValue = number | undefined;

/** `value === undefined` renders as "—" (still loading). */
const show = (value: CardValue) => (value === undefined ? '—' : value);

interface IAttentionCard {
	icon: React.ReactNode;
	value: CardValue;
	label: string;
	note?: string;
	tint: string;
	onClick: () => void;
}

/** A queue that needs an admin action; flagged when it isn't empty. */
const AttentionCard: React.FC<IAttentionCard> = ({
	icon,
	value,
	label,
	note,
	tint,
	onClick,
}) => (
	<div onClick={onClick} className="hf-attention">
		<div className="flex items-start justify-between">
			<span
				className="hf-chip"
				style={{background: addColorAlpha(tint, 0.1), color: tint}}
			>
				{icon}
			</span>
			{value ? (
				<span className="hf-badge-warn">Action needed</span>
			) : (
				value === 0 && <span className="hf-badge-ok">All clear</span>
			)}
		</div>
		<div className="mt-4 text-3xl font-semibold text-slate-800">{show(value)}</div>
		<div className="text-sm text-slate-500 mt-1">{label}</div>
		<div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
			<span className="text-xs text-amber-600">{note ?? ''}</span>
			<span className="text-xs font-medium hf-link">
				Review <ArrowRightOutlined style={{fontSize: 10}} />
			</span>
		</div>
	</div>
);

interface IStatTile {
	icon: React.ReactNode;
	value: CardValue;
	label: string;
	tint: string;
	onClick?: () => void;
}

const StatTile: React.FC<IStatTile> = ({icon, value, label, tint, onClick}) => (
	<div onClick={onClick} className={`hf-stat ${onClick ? 'cursor-pointer' : ''}`}>
		<span
			className="hf-chip hf-chip--sm"
			style={{background: addColorAlpha(tint, 0.1), color: tint}}
		>
			{icon}
		</span>
		<div className="min-w-0">
			<div className="text-xl font-semibold text-slate-800 leading-tight">
				{show(value)}
			</div>
			<div className="text-xs text-slate-500 truncate">{label}</div>
		</div>
	</div>
);

const Panel: React.FC<{
	title: string;
	subtitle?: string;
	extra?: React.ReactNode;
	className?: string;
	children: React.ReactNode;
}> = ({title, subtitle, extra, className, children}) => (
	<section className={`admin-card ${className ?? ''}`}>
		<div className="flex items-start justify-between gap-4 mb-4">
			<div>
				<h2 className="text-base font-semibold text-slate-800 m-0">{title}</h2>
				{subtitle && (
					<p className="text-xs text-slate-500 m-0 mt-0.5">{subtitle}</p>
				)}
			</div>
			{extra}
		</div>
		{children}
	</section>
);

AttentionCard.defaultProps = {note: undefined};
StatTile.defaultProps = {onClick: undefined};
Panel.defaultProps = {subtitle: undefined, extra: undefined, className: undefined};

const SERIES = [
	{key: 'doctor', label: 'Doctor', color: '#0f9488'},
	{key: 'lab', label: 'Lab', color: '#7c6fd6'},
] as const;
const CHART_DAYS = 14;
const CHART_H = 180;

type DayBucket = {day: moment.Moment; doctor: number; lab: number};

/** Bookings received per day (doctor by order date, lab by creation date). */
const BookingsChartView: React.FC<{days: DayBucket[] | undefined}> = ({days}) => {
	if (!days) {
		return <div className="h-[220px] rounded-lg bg-slate-50 animate-pulse" />;
	}
	const max = Math.max(1, ...days.map((d) => d.doctor + d.lab));
	const ticks = [max, Math.round(max / 2), 0].filter((t, i, a) => a.indexOf(t) === i);
	return (
		<div className="flex gap-3">
			<div
				className="flex flex-col justify-between text-[11px] text-slate-400 text-right w-6"
				style={{height: CHART_H}}
			>
				{ticks.map((t) => (
					<span key={t} className="leading-none">
						{t}
					</span>
				))}
			</div>
			<div className="flex-1 min-w-0">
				<div className="relative" style={{height: CHART_H}}>
					{ticks.map((t) => (
						<div
							key={t}
							className="absolute left-0 right-0 border-t border-dashed border-slate-200"
							style={{bottom: (t / max) * CHART_H}}
						/>
					))}
					<div className="absolute inset-0 flex items-end gap-[6px]">
						{days.map((d) => {
							const total = d.doctor + d.lab;
							return (
								<Tooltip
									key={d.day.format('YYYY-MM-DD')}
									title={
										<div className="text-xs">
											<div className="font-semibold mb-1">
												{d.day.format('ddd, D MMM')}
											</div>
											<div>Doctor: {d.doctor}</div>
											<div>Lab: {d.lab}</div>
										</div>
									}
								>
									<div className="hf-bar-col">
										<div
											className="flex flex-col justify-end gap-[2px] w-full max-w-[28px] mx-auto"
											style={{height: (total / max) * CHART_H}}
										>
											{d.lab > 0 && (
												<div
													style={{
														flex: d.lab,
														background: SERIES[1].color,
													}}
													className="rounded-t-[4px]"
												/>
											)}
											{d.doctor > 0 && (
												<div
													style={{
														flex: d.doctor,
														background: SERIES[0].color,
													}}
													className={
														d.lab > 0 ? '' : 'rounded-t-[4px]'
													}
												/>
											)}
										</div>
									</div>
								</Tooltip>
							);
						})}
					</div>
				</div>
				<div className="flex gap-[6px] mt-2">
					{days.map((d, i) => (
						<span
							key={d.day.format('YYYY-MM-DD')}
							className="flex-1 text-center text-[11px] text-slate-400"
						>
							{i % 2 === days.length % 2 ? '' : d.day.format('D MMM')}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};
// Re-renders only when the day buckets change, not on every dashboard query tick.
const BookingsChart = React.memo(BookingsChartView);

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
	// Placed bookings whose date has passed can't be confirmed any more (only
	// rejected or cancelled), so they are counted apart from the real queue.
	const placedOrders = orders?.filter((o) => o.status === 'placed');
	const pastOrders = placedOrders?.filter((o) =>
		isDayPast(o.items?.[0]?.metadata?.bookings?.[0]?.date),
	).length;
	const unconfirmedDoctor = placedOrders && placedOrders.length - (pastOrders ?? 0);
	const placedLabs = labAppointments?.filter((a) => a.status === 'placed');
	const pastLabs = placedLabs?.filter((a) => isDayPast(a.date)).length;
	const unconfirmedLab = placedLabs && placedLabs.length - (pastLabs ?? 0);
	const pastNote = (past?: number) => (past ? `${past} past date` : undefined);

	// ── People ─────────────────────────────────────────────────────────────
	const totalUsers = userList?.length;
	const activeMembers = userList
		? userList.filter((u) => {
				const m = u.metadata?.membershipDetail?.[0];
				return m && (!m.endDate || new Date(m.endDate) >= now);
		  }).length
		: undefined;
	const memberShare =
		totalUsers && activeMembers !== undefined
			? Math.round((activeMembers / totalUsers) * 100)
			: undefined;

	// ── Bookings trend (last 14 days) ─────────────────────────────────────
	const bookingDays = React.useMemo<DayBucket[] | undefined>(() => {
		if (!orders || !labAppointments) return undefined;
		const start = moment()
			.startOf('day')
			.subtract(CHART_DAYS - 1, 'days');
		const buckets: DayBucket[] = Array.from({length: CHART_DAYS}, (_, i) => ({
			day: start.clone().add(i, 'days'),
			doctor: 0,
			lab: 0,
		}));
		const add = (date: unknown, key: 'doctor' | 'lab') => {
			const idx = moment(date as string)
				.startOf('day')
				.diff(start, 'days');
			if (idx >= 0 && idx < CHART_DAYS) buckets[idx][key] += 1;
		};
		orders.forEach((o) => add(o.orderDate, 'doctor'));
		labAppointments.forEach((a) => add(a.createdAt, 'lab'));
		return buckets;
	}, [orders, labAppointments]);
	const bookingTotal = bookingDays?.reduce((s, d) => s + d.doctor + d.lab, 0);

	return (
		<Layout>
			<div className="flex items-end justify-between flex-wrap gap-2">
				<div>
					<h1 className="text-2xl font-semibold text-slate-800 m-0">
						Welcome back
					</h1>
					<p className="text-sm text-slate-500 m-0">
						Here&apos;s what needs your attention today.
					</p>
				</div>
				<span className="text-sm text-slate-500">
					{moment().format('dddd, D MMMM YYYY')}
				</span>
			</div>

			<div className="grid gap-5 grid-cols-1 md:grid-cols-3">
				<AttentionCard
					icon={<MdOutlineAssignment size={20} />}
					value={pendingRequests}
					label="Pending membership requests"
					tint="#d97706"
					onClick={() => router.push('/admin/new-members')}
				/>
				<AttentionCard
					icon={<FaCalendarCheck size={18} />}
					value={unconfirmedDoctor}
					label="Doctor appointments to confirm"
					note={pastNote(pastOrders)}
					tint="#0f9488"
					onClick={() => router.push('/admin/orders')}
				/>
				<AttentionCard
					icon={<FaVial size={18} />}
					value={unconfirmedLab}
					label="Lab appointments to confirm"
					note={pastNote(pastLabs)}
					tint="#7c6fd6"
					onClick={() => router.push('/admin/lab-appointments')}
				/>
			</div>

			<div className="grid gap-5 grid-cols-1 xl:grid-cols-3">
				<Panel
					className="xl:col-span-2"
					title="Bookings received"
					subtitle={`Last ${CHART_DAYS} days${
						bookingTotal !== undefined ? ` · ${bookingTotal} total` : ''
					}`}
					extra={
						<div className="flex items-center gap-4 text-xs text-slate-500">
							{SERIES.map((s) => (
								<span key={s.key} className="flex items-center gap-1.5">
									<span
										className="w-2.5 h-2.5 rounded-sm"
										style={{background: s.color}}
									/>
									{s.label}
								</span>
							))}
						</div>
					}
				>
					<BookingsChart days={bookingDays} />
				</Panel>

				<Panel title="People" subtitle="Registered users and active memberships">
					<div className="flex flex-col gap-3">
						<StatTile
							icon={<FaUsers size={18} />}
							value={totalUsers}
							label="Users"
							tint="#2563eb"
							onClick={() => router.push('/admin/users')}
						/>
						<StatTile
							icon={<RiVipCrown2Fill size={18} />}
							value={activeMembers}
							label="Active members"
							tint="#db2777"
							onClick={() => router.push('/admin/users')}
						/>
						<div className="mt-1">
							<div className="flex justify-between text-xs text-slate-500 mb-1.5">
								<span>Membership rate</span>
								<span className="font-medium text-slate-700">
									{memberShare === undefined ? '—' : `${memberShare}%`}
								</span>
							</div>
							<div className="h-2 rounded-full bg-slate-100 overflow-hidden">
								<div
									className="h-full rounded-full"
									style={{
										width: `${memberShare ?? 0}%`,
										background: 'var(--hf-primary)',
									}}
								/>
							</div>
						</div>
					</div>
				</Panel>
			</div>

			<Panel title="Catalog" subtitle="What members can browse and book in the app">
				<div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
					<StatTile
						icon={<FaUserMd size={18} />}
						value={products?.count}
						label="Products & Services"
						tint="#0f9488"
						onClick={() => router.push('/admin/products')}
					/>
					<StatTile
						icon={<BiCategoryAlt size={18} />}
						value={categories?.count}
						label="Categories"
						tint="#2563eb"
						onClick={() => router.push('/admin/categories')}
					/>
					<StatTile
						icon={<MdBiotech size={18} />}
						value={diagnostics?.length}
						label="Diagnostics"
						tint="#475569"
						onClick={() => router.push('/admin/diagnostics')}
					/>
					<StatTile
						icon={<FaFlask size={16} />}
						value={labs?.length}
						label="Labs"
						tint="#7c6fd6"
						onClick={() => router.push('/admin/labs')}
					/>
					<StatTile
						icon={<FaVials size={16} />}
						value={tests?.count}
						label="Tests"
						tint="#d97706"
						onClick={() => router.push('/admin/tests')}
					/>
				</div>
			</Panel>
		</Layout>
	);
};
