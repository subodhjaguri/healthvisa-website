import {Layout} from '@healthvisa/components';
import {
	ICount,
	IAnalytics,
	IReferralRow,
} from '@healthvisa/models/admin/analytics/Analytics';
import {useGetAnalytics} from '@healthvisa/models/admin/analytics/useAnalytics';
import {DownloadOutlined} from '@ant-design/icons';
import {Alert, Button, DatePicker, Skeleton, Switch, Table, Tooltip} from 'antd';
import moment, {Moment} from 'moment';
import React from 'react';
import {CSVLink} from 'react-csv';
import {ISeries, Legend, LineChart, RankedList, StackedBars, toBuckets} from './charts';

const {RangePicker} = DatePicker;
const DAY = 'YYYY-MM-DD';

// Fixed series order (validated pair, same as the dashboard chart).
const TEAL = '#0f9488';
const VIOLET = '#7c6fd6';
const BOOKING_SERIES: ISeries[] = [
	{key: 'doctor', label: 'Doctor', color: TEAL},
	{key: 'lab', label: 'Lab', color: VIOLET},
];
const MEMBERSHIP_SERIES: ISeries[] = [
	{key: 'new', label: 'New', color: TEAL},
	{key: 'renewal', label: 'Renewal', color: VIOLET},
];
const ACTIVE_SERIES: ISeries = {key: 'active', label: 'Active members', color: TEAL};
const SIGNUP_SERIES: ISeries = {key: 'count', label: 'Sign-ups', color: TEAL};

const PRESETS: Record<string, [Moment, Moment]> = {
	'Last 7 days': [moment().subtract(6, 'days'), moment()],
	'Last 30 days': [moment().subtract(29, 'days'), moment()],
	'Last 90 days': [moment().subtract(89, 'days'), moment()],
	'This month': [moment().startOf('month'), moment()],
	'Last 12 months': [moment().subtract(1, 'year').add(1, 'day'), moment()],
};

const pct = (n: number | null | undefined) =>
	n === null || n === undefined ? '—' : `${Math.round(n * 100)}%`;
const share = (part: number, whole: number) => (whole ? part / whole : null);
const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Panel: React.FC<{
	title: string;
	subtitle?: string;
	extra?: React.ReactNode;
	className?: string;
	children: React.ReactNode;
}> = ({title, subtitle, extra, className, children}) => (
	<section className={`admin-card ${className ?? ''}`}>
		<div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
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
Panel.defaultProps = {subtitle: undefined, extra: undefined, className: undefined};

const Kpi: React.FC<{label: string; value: React.ReactNode; note?: string}> = ({
	label,
	value,
	note,
}) => (
	<div className="hf-stat flex-col !items-start !gap-1">
		<div className="text-xs text-slate-500">{label}</div>
		<div className="text-2xl font-semibold text-slate-800 leading-tight tabular-nums">
			{value}
		</div>
		{note && <div className="text-xs text-slate-400">{note}</div>}
	</div>
);
Kpi.defaultProps = {note: undefined};

const Figure: React.FC<{label: string; value: React.ReactNode; hint?: string}> = ({
	label,
	value,
	hint,
}) => (
	<div className="flex justify-between gap-3 py-2 border-b border-slate-100 last:border-0 text-sm">
		<span className="text-slate-500">
			{hint ? (
				<Tooltip title={hint}>
					<span className="border-b border-dotted border-slate-300 cursor-help">
						{label}
					</span>
				</Tooltip>
			) : (
				label
			)}
		</span>
		<span className="font-medium text-slate-800 tabular-nums">{value}</span>
	</div>
);
Figure.defaultProps = {hint: undefined};

const CANCELLED_BY: Record<string, string> = {user: 'Member', admin: 'Staff'};
const VISIT: Record<string, string> = {home: 'Home collection', lab: 'At the lab'};

/** Flat rows (section, metric, item, value) for the CSV download. */
function csvRows(a: IAnalytics) {
	const rows: {
		section: string;
		metric: string;
		item: string;
		value: string | number;
	}[] = [];
	const add = (section: string, metric: string, item: string, value: string | number) =>
		rows.push({section, metric, item, value});
	const list = (section: string, metric: string, counts: ICount[]) =>
		counts.forEach((c) => add(section, metric, c.key, c.count));
	const b = a.bookings;
	add('Bookings', 'Total', 'Doctor', b.total.doctor);
	add('Bookings', 'Total', 'Lab', b.total.lab);
	add('Bookings', 'Cancellation rate', '', pct(b.cancellationRate));
	list('Bookings', 'Doctor status', b.statuses.doctor);
	list('Bookings', 'Lab status', b.statuses.lab);
	list('Bookings', 'Cancelled by', b.cancelledBy);
	list('Bookings', 'Cancellation reason', b.cancellationReasons);
	list('Bookings', 'Top doctor', b.topDoctors);
	list('Bookings', 'Top speciality', b.topSpecialities);
	list('Bookings', 'Top lab', b.topLabs);
	list('Bookings', 'Top health package', b.topPackages);
	list('Bookings', 'Lab booking type', b.labBookingTypes);
	list('Bookings', 'Lab visit', b.labVisitTypes);
	const m = a.memberships;
	add('Memberships', 'New', '', m.new);
	add('Memberships', 'Renewal', '', m.renewal);
	add('Memberships', 'Active now', '', m.activeNow);
	add('Memberships', 'Expiring in 30 days (not renewed)', '', m.expiringNext30Days);
	add('Memberships', 'Renewal rate', '', pct(m.renewalRate.rate));
	add('Memberships', 'Requests', 'Received', m.requests.received);
	add('Memberships', 'Requests', 'Approved', m.requests.approved);
	add('Memberships', 'Requests', 'Rejected', m.requests.rejected);
	add('Memberships', 'Requests', 'Pending', m.requests.pending);
	a.referrals.forEach((r) => {
		const shop = `${r.code}${r.referrerName ? ` (${r.referrerName})` : ''}`;
		add('Referrals', 'Sign-ups', shop, r.signups);
		add('Referrals', 'Membership requests', shop, r.requests);
		add('Referrals', 'Approved', shop, r.approved);
	});
	const u = a.users;
	add('Users', 'Sign-ups', '', u.signups);
	add('Users', 'Became members', '', u.becameMembers);
	add('Users', 'Booked', '', u.booked);
	add('Users', 'Active, last 7 days', '', u.activeLast7Days);
	add('Users', 'Active, last 30 days', '', u.activeLast30Days);
	list('Users', 'App build (active users)', u.appVersions);
	b.daily.forEach((d) => {
		add('Daily', 'Doctor bookings', d.day, d.doctor);
		add('Daily', 'Lab bookings', d.day, d.lab);
	});
	m.daily.forEach((d) => {
		add('Daily', 'New memberships', d.day, d.new);
		add('Daily', 'Renewals', d.day, d.renewal);
		add('Daily', 'Active members', d.day, d.active);
	});
	u.daily.forEach((d) => add('Daily', 'Sign-ups', d.day, d.count));
	return rows;
}

const REFERRAL_COLUMNS = [
	{
		title: 'Code',
		dataIndex: 'code',
		render: (code: string, r: IReferralRow) => (
			<div>
				<div className="font-medium text-slate-800">{code}</div>
				{r.referrerName && (
					<div className="text-xs text-slate-500">{r.referrerName}</div>
				)}
			</div>
		),
	},
	{title: 'Sign-ups', dataIndex: 'signups', align: 'right' as const},
	{title: 'Membership requests', dataIndex: 'requests', align: 'right' as const},
	{title: 'Approved', dataIndex: 'approved', align: 'right' as const},
];

/** The figures and charts for one loaded range. */
const AnalyticsBody: React.FC<{data: IAnalytics; dimmed: boolean}> = ({data, dimmed}) => {
	const charts = React.useMemo(
		() => ({
			bookings: toBuckets(data.bookings.daily, ['doctor', 'lab']),
			memberships: toBuckets(data.memberships.daily, ['new', 'renewal']),
			active: toBuckets(data.memberships.daily, ['active'], 'last'),
			signups: toBuckets(data.users.daily, ['count']),
		}),
		[data],
	);
	const {bookings: b, memberships: m, users: u} = data;
	const totalBookings = b.total.doctor + b.total.lab;
	return (
		<div className={`flex flex-col gap-5 ${dimmed ? 'opacity-60' : ''}`}>
			<div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
				<Kpi
					label="Bookings"
					value={totalBookings}
					note={`${b.total.doctor} doctor · ${b.total.lab} lab`}
				/>
				<Kpi label="Cancellation rate" value={pct(b.cancellationRate)} />
				<Kpi
					label="Memberships taken"
					value={m.new + m.renewal}
					note={`${m.new} new · ${m.renewal} renewal`}
				/>
				<Kpi label="Active members now" value={m.activeNow} />
				<Kpi label="Sign-ups" value={u.signups} />
				<Kpi
					label="Active users"
					value={u.activeLast30Days}
					note="Used the app in the last 30 days"
				/>
			</div>

			<Panel
				title="Bookings received"
				subtitle={`${totalBookings} in this range`}
				extra={<Legend series={BOOKING_SERIES} />}
			>
				<StackedBars buckets={charts.bookings} series={BOOKING_SERIES} />
			</Panel>

			<div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
				<Panel title="Doctor appointments" subtitle="By current status">
					<RankedList rows={b.statuses.doctor} color={TEAL} format={sentence} />
				</Panel>
				<Panel title="Lab appointments" subtitle="By current status">
					<RankedList rows={b.statuses.lab} color={VIOLET} format={sentence} />
				</Panel>
			</div>

			<div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
				<Panel
					title="Cancellations"
					subtitle={`${pct(b.cancellationRate)} of bookings in this range`}
				>
					<div className="mb-4">
						<div className="text-xs font-medium text-slate-500 mb-2">
							Cancelled by
						</div>
						<RankedList
							rows={b.cancelledBy}
							format={(k) => CANCELLED_BY[k] ?? k}
							empty="No cancellations"
						/>
					</div>
					<div className="text-xs font-medium text-slate-500 mb-2">
						Most common reasons
					</div>
					<RankedList rows={b.cancellationReasons} empty="No reasons given" />
				</Panel>
				<Panel title="Lab bookings" subtitle="How they were booked, and where">
					<div className="mb-4">
						<div className="text-xs font-medium text-slate-500 mb-2">
							Booked by
						</div>
						<RankedList
							rows={b.labBookingTypes}
							color={VIOLET}
							format={sentence}
						/>
					</div>
					<div className="text-xs font-medium text-slate-500 mb-2">Visit</div>
					<RankedList
						rows={b.labVisitTypes}
						color={VIOLET}
						format={(k) => VISIT[k] ?? k}
					/>
				</Panel>
			</div>

			<div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
				<Panel title="Top doctors">
					<RankedList rows={b.topDoctors} color={TEAL} />
				</Panel>
				<Panel title="Top specialities">
					<RankedList rows={b.topSpecialities} color={TEAL} />
				</Panel>
				<Panel title="Top labs">
					<RankedList rows={b.topLabs} color={VIOLET} />
				</Panel>
				<Panel title="Top health packages">
					<RankedList rows={b.topPackages} color={VIOLET} />
				</Panel>
			</div>

			<div className="grid gap-5 grid-cols-1 xl:grid-cols-3">
				<Panel
					className="xl:col-span-2"
					title="Memberships taken"
					subtitle={`${m.new} new · ${m.renewal} renewal`}
					extra={<Legend series={MEMBERSHIP_SERIES} />}
				>
					<StackedBars
						buckets={charts.memberships}
						series={MEMBERSHIP_SERIES}
					/>
				</Panel>
				<Panel title="Membership health">
					<Figure label="Active members now" value={m.activeNow} />
					<Figure
						label="Expiring in 30 days"
						value={m.expiringNext30Days}
						hint="Active memberships ending in the next 30 days with no renewal yet"
					/>
					<Figure
						label="Renewal rate"
						value={pct(m.renewalRate.rate)}
						hint={`${m.renewalRate.renewed} of ${m.renewalRate.ended} memberships that ended in this range were renewed`}
					/>
					<Figure label="Requests received" value={m.requests.received} />
					<Figure label="Approved" value={m.requests.approved} />
					<Figure label="Rejected" value={m.requests.rejected} />
					<Figure label="Still pending" value={m.requests.pending} />
				</Panel>
			</div>

			<Panel
				title="Active members"
				subtitle="Members with a membership running at the end of each day"
			>
				<LineChart buckets={charts.active} series={ACTIVE_SERIES} />
			</Panel>

			<div className="grid gap-5 grid-cols-1 xl:grid-cols-3">
				<Panel
					className="xl:col-span-2"
					title="Referrals"
					subtitle="Per shop code: sign-ups and membership requests in this range"
				>
					<Table
						size="small"
						rowKey="code"
						columns={REFERRAL_COLUMNS}
						dataSource={data.referrals}
						pagination={data.referrals.length > 10 ? {pageSize: 10} : false}
					/>
				</Panel>
				<Panel title="Users" subtitle="People who signed up in this range">
					<Figure label="Signed up" value={u.signups} />
					<Figure
						label="Became members"
						value={`${u.becameMembers} (${pct(
							share(u.becameMembers, u.signups),
						)})`}
					/>
					<Figure
						label="Booked an appointment"
						value={`${u.booked} (${pct(share(u.booked, u.signups))})`}
					/>
					<Figure label="Active, last 7 days" value={u.activeLast7Days} />
					<Figure label="Active, last 30 days" value={u.activeLast30Days} />
					<div className="text-xs font-medium text-slate-500 mt-4 mb-2">
						App build of active users
					</div>
					<RankedList
						rows={u.appVersions}
						format={(k) => (k === 'Not given' ? 'Unknown' : `Build ${k}`)}
						empty="Recorded from this release on"
					/>
				</Panel>
			</div>

			<Panel title="Sign-ups" subtitle={`${u.signups} in this range`}>
				<StackedBars buckets={charts.signups} series={[SIGNUP_SERIES]} />
			</Panel>

			<p className="text-xs text-slate-400 m-0">
				Bookings count from when they were made. Test accounts are{' '}
				{data.includeTestData ? 'included' : 'left out'}. Updated{' '}
				{moment(data.generatedAt).format('D MMM YYYY, h:mm a')}.
			</p>
		</div>
	);
};

/** Business and process analytics from GET /admin/analytics. */
export const AnalyticsPage = () => {
	const [range, setRange] = React.useState<[Moment, Moment]>(PRESETS['Last 30 days']);
	const [includeTestData, setIncludeTestData] = React.useState(false);
	const query = {
		from: range[0].format(DAY),
		to: range[1].format(DAY),
		includeTestData,
	};
	const {data, isFetching, error} = useGetAnalytics(query);
	const csv = React.useMemo(() => data && csvRows(data), [data]);

	return (
		<Layout>
			<div className="flex items-end justify-between flex-wrap gap-3">
				<div>
					<h1 className="text-2xl font-semibold text-slate-800 m-0">
						Analytics
					</h1>
					<p className="text-sm text-slate-500 m-0">
						Bookings, memberships, referrals and users, by India calendar day.
					</p>
				</div>
				<div className="flex items-center gap-3 flex-wrap">
					<Tooltip title="Include ZZTEST_ accounts (9000000xxx mobiles) and their records">
						<span className="flex items-center gap-2 text-sm text-slate-500">
							<Switch
								size="small"
								checked={includeTestData}
								onChange={setIncludeTestData}
							/>
							Test data
						</span>
					</Tooltip>
					<RangePicker
						allowClear={false}
						value={range}
						ranges={PRESETS}
						format="D MMM YYYY"
						disabledDate={(d) =>
							d.isAfter(moment(), 'day') ||
							// The API allows at most 366 days.
							d.isBefore(moment().subtract(5, 'years'), 'day')
						}
						onChange={(v) => {
							const [from, to] = (v ?? []) as Moment[];
							if (!from || !to) return;
							setRange(
								to.diff(from, 'days') > 365
									? [to.clone().subtract(365, 'days'), to]
									: [from, to],
							);
						}}
					/>
					{csv ? (
						<CSVLink
							data={csv}
							filename={`healthifam-analytics_${query.from}_${query.to}.csv`}
						>
							<Button icon={<DownloadOutlined />}>Export CSV</Button>
						</CSVLink>
					) : (
						<Button icon={<DownloadOutlined />} disabled>
							Export CSV
						</Button>
					)}
				</div>
			</div>

			{error && (
				<Alert
					type="error"
					showIcon
					message="Could not load analytics"
					description={
						(error as {errors?: {error?: {message?: string}}})?.errors?.error
							?.message ?? 'Please try again.'
					}
				/>
			)}

			{data ? (
				<AnalyticsBody data={data} dimmed={isFetching} />
			) : (
				!error && <Skeleton active paragraph={{rows: 10}} />
			)}
		</Layout>
	);
};
