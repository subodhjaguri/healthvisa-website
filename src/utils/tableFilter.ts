import moment, {Moment} from 'moment';

/** Value of an antd RangePicker (either end may be open). */
export type DateRange = [Moment | null, Moment | null] | null;

/**
 * Admin list search: true when every word of `query` appears in one of
 * `fields` (case-insensitive). An empty query matches everything.
 */
export function matchesSearch(query: string, fields: unknown[]): boolean {
	const words = query.toLowerCase().split(/\s+/).filter(Boolean);
	if (!words.length) return true;
	const haystack = fields
		.filter((f) => f !== null && f !== undefined)
		.join(' ')
		.toLowerCase();
	return words.every((w) => haystack.includes(w));
}

/**
 * A stored or displayed date as a moment, or null. Accepts Date objects, ISO
 * strings, the app's lab-visit format "DD-MM-YYYY" (which `new Date()` would
 * misread as month-first, e.g. "04-10-2026" → 10 April) and the admin tables'
 * "DD MMM YYYY".
 */
export function parseDay(value: unknown): Moment | null {
	if (!value) return null;
	const day =
		value instanceof Date
			? moment(value)
			: moment(String(value), [moment.ISO_8601, 'DD-MM-YYYY', 'DD MMM YYYY'], true);
	return day.isValid() ? day : null;
}

/** Day-granular "past": the date's calendar day is before today (no date = not past). */
export const isDayPast = (value: unknown): boolean =>
	!!parseDay(value)?.isBefore(moment(), 'day');

/** True when `value` falls within `range`, whole days inclusive (no range = true). */
export function inDateRange(value: unknown, range: DateRange): boolean {
	const [from, to] = range ?? [null, null];
	if (!from && !to) return true;
	const day = parseDay(value);
	if (!day) return false;
	if (from && day.isBefore(from, 'day')) return false;
	if (to && day.isAfter(to, 'day')) return false;
	return true;
}

/** Distinct non-empty values as sorted Select options (e.g. every doctor in the list). */
export function optionsOf(values: unknown[]): {value: string; label: string}[] {
	return Array.from(new Set(values.filter(Boolean).map(String)))
		.sort((a, b) => a.localeCompare(b))
		.map((v) => ({value: v, label: v}));
}
