import {Empty, Tooltip} from 'antd';
import moment from 'moment';
import React from 'react';

export interface ISeries {
	key: string;
	label: string;
	color: string;
}

/** One bar (or point): its axis label, tooltip title and value per series. */
export interface IBucket {
	label: string;
	title: string;
	values: Record<string, number>;
}

const CHART_H = 180;

/**
 * Daily rows grouped for display: by day up to ~2 months, by week up to ~6
 * months, then by month. Flows (bookings) add up; levels (active members) keep
 * the bucket's last value.
 */
export function toBuckets<T extends {day: string}>(
	rows: T[],
	keys: (keyof T & string)[],
	mode: 'sum' | 'last' = 'sum',
): IBucket[] {
	let unit: moment.unitOfTime.StartOf = 'month';
	if (rows.length <= 62) unit = 'day';
	else if (rows.length <= 190) unit = 'isoWeek';
	const buckets: (IBucket & {start: string; first: moment.Moment})[] = [];
	rows.forEach((row) => {
		const d = moment(row.day, 'YYYY-MM-DD');
		const start = d.clone().startOf(unit).format('YYYY-MM-DD');
		let bucket = buckets[buckets.length - 1];
		if (bucket?.start !== start) {
			bucket = {
				start,
				first: d,
				label: unit === 'month' ? d.format('MMM YY') : d.format('D MMM'),
				title: '',
				values: Object.fromEntries(keys.map((k) => [k, 0])),
			};
			buckets.push(bucket);
		}
		keys.forEach((k) => {
			const v = Number(row[k]) || 0;
			bucket.values[k] = mode === 'sum' ? bucket.values[k] + v : v;
		});
		bucket.title =
			unit === 'day'
				? d.format('ddd, D MMM YYYY')
				: `${bucket.first.format('D MMM')} – ${d.format('D MMM YYYY')}`;
	});
	return buckets.map(({label, title, values}) => ({label, title, values}));
}

const niceMax = (max: number) => {
	if (max <= 4) return Math.max(1, max);
	const step = 10 ** Math.floor(Math.log10(max));
	return Math.ceil(max / step) * step;
};

const ticks = (max: number) =>
	[max, Math.round(max / 2), 0].filter((t, i, a) => a.indexOf(t) === i);

/** Y labels placed at their values, so they line up with the grid. */
const Axis: React.FC<{max: number}> = ({max}) => (
	<div
		className="relative text-[11px] text-slate-400 text-right w-7 shrink-0"
		style={{height: CHART_H}}
	>
		{ticks(max).map((t) => (
			<span
				key={t}
				className="absolute right-0 leading-none"
				style={{bottom: (t / max) * CHART_H - 5}}
			>
				{t}
			</span>
		))}
	</div>
);

const Grid: React.FC<{max: number}> = ({max}) => (
	<>
		{ticks(max).map((t) => (
			<div
				key={t}
				className="absolute left-0 right-0 border-t border-dashed border-slate-200"
				style={{bottom: (t / max) * CHART_H}}
			/>
		))}
	</>
);

/** Labels under the plot, thinned to about eight. */
const XLabels: React.FC<{buckets: IBucket[]}> = ({buckets}) => {
	const every = Math.max(1, Math.ceil(buckets.length / 8));
	return (
		<div className="flex gap-[2px] mt-2">
			{buckets.map((b, i) => (
				<span
					key={b.title}
					className="flex-1 min-w-0 text-center text-[11px] text-slate-400 whitespace-nowrap overflow-visible"
				>
					{i % every === 0 ? b.label : ''}
				</span>
			))}
		</div>
	);
};

const TooltipBody: React.FC<{bucket: IBucket; series: ISeries[]}> = ({
	bucket,
	series,
}) => (
	<div className="text-xs">
		<div className="font-semibold mb-1">{bucket.title}</div>
		{series.map((s) => (
			<div key={s.key} className="flex items-center gap-1.5">
				<span className="w-2 h-2 rounded-sm" style={{background: s.color}} />
				{s.label}: {bucket.values[s.key]}
			</div>
		))}
	</div>
);

export const Legend: React.FC<{series: ISeries[]}> = ({series}) => (
	<div className="flex items-center gap-4 text-xs text-slate-500">
		{series.map((s) => (
			<span key={s.key} className="flex items-center gap-1.5">
				<span className="w-2.5 h-2.5 rounded-sm" style={{background: s.color}} />
				{s.label}
			</span>
		))}
	</div>
);

/** Stacked bars, first series at the bottom, with a hover tooltip per bar. */
export const StackedBars: React.FC<{buckets: IBucket[]; series: ISeries[]}> = ({
	buckets,
	series,
}) => {
	const total = (b: IBucket) => series.reduce((s, x) => s + b.values[x.key], 0);
	const max = niceMax(Math.max(0, ...buckets.map(total)));
	return (
		<div className="flex gap-3">
			<Axis max={max} />
			<div className="flex-1 min-w-0">
				<div className="relative" style={{height: CHART_H}}>
					<Grid max={max} />
					<div className="absolute inset-0 flex items-end gap-[2px]">
						{buckets.map((b) => {
							const shown = series.filter((s) => b.values[s.key] > 0);
							return (
								<Tooltip
									key={b.title}
									title={<TooltipBody bucket={b} series={series} />}
								>
									<div className="hf-bar-col">
										<div
											className="flex flex-col-reverse justify-start gap-[2px] w-full max-w-[28px] mx-auto"
											style={{height: (total(b) / max) * CHART_H}}
										>
											{shown.map((s, i) => (
												<div
													key={s.key}
													style={{
														flex: b.values[s.key],
														background: s.color,
													}}
													className={
														i === shown.length - 1
															? 'rounded-t-[4px]'
															: ''
													}
												/>
											))}
										</div>
									</div>
								</Tooltip>
							);
						})}
					</div>
				</div>
				<XLabels buckets={buckets} />
			</div>
		</div>
	);
};

/** One series as a 2px line, hover column per point. */
export const LineChart: React.FC<{buckets: IBucket[]; series: ISeries}> = ({
	buckets,
	series,
}) => {
	const values = buckets.map((b) => b.values[series.key]);
	const max = niceMax(Math.max(0, ...values));
	const n = buckets.length;
	const x = (i: number) => ((i + 0.5) / n) * 100;
	const y = (v: number) => CHART_H - (v / max) * CHART_H;
	return (
		<div className="flex gap-3">
			<Axis max={max} />
			<div className="flex-1 min-w-0">
				<div className="relative" style={{height: CHART_H}}>
					<Grid max={max} />
					<svg
						className="absolute inset-0 w-full h-full overflow-visible"
						viewBox={`0 0 100 ${CHART_H}`}
						preserveAspectRatio="none"
					>
						<polyline
							points={values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
							fill="none"
							stroke={series.color}
							strokeWidth={2}
							strokeLinejoin="round"
							vectorEffect="non-scaling-stroke"
						/>
					</svg>
					<div className="absolute inset-0 flex">
						{buckets.map((b, i) => (
							<Tooltip
								key={b.title}
								title={<TooltipBody bucket={b} series={[series]} />}
							>
								<div className="hf-bar-col relative">
									{n <= 62 && (
										<span
											className="absolute w-2 h-2 rounded-full border-2 border-white"
											style={{
												background: series.color,
												left: 'calc(50% - 4px)',
												bottom: CHART_H - y(values[i]) - 4,
											}}
										/>
									)}
								</div>
							</Tooltip>
						))}
					</div>
				</div>
				<XLabels buckets={buckets} />
			</div>
		</div>
	);
};

/** Ranked counts as labelled horizontal bars. */
export const RankedList: React.FC<{
	rows: {key: string; count: number}[];
	color?: string;
	empty?: string;
	format?: (key: string) => string;
}> = ({rows, color, empty, format}) => {
	if (!rows.length) {
		return (
			<Empty
				image={Empty.PRESENTED_IMAGE_SIMPLE}
				description={empty ?? 'No data in this range'}
			/>
		);
	}
	const max = Math.max(...rows.map((r) => r.count));
	return (
		<ul className="flex flex-col gap-2.5 m-0 p-0 list-none">
			{rows.map((r) => (
				<li key={r.key}>
					<div className="flex justify-between gap-3 text-sm mb-1">
						<span className="text-slate-700 truncate" title={r.key}>
							{format ? format(r.key) : r.key}
						</span>
						<span className="font-medium text-slate-800 tabular-nums">
							{r.count}
						</span>
					</div>
					<div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
						<div
							className="h-full rounded-full"
							style={{
								width: `${(r.count / max) * 100}%`,
								background: color ?? 'var(--hf-primary)',
							}}
						/>
					</div>
				</li>
			))}
		</ul>
	);
};

RankedList.defaultProps = {color: undefined, empty: undefined, format: undefined};
