/**
 * A text cell safe to open in a spreadsheet: one starting with =, +, -, @,
 * tab or carriage return gets a leading single quote, so Excel or Sheets show
 * it as text instead of running it as a formula.
 */
export function csvSafe(cell: string): string {
	return /^[=+\-@\t\r]/.test(cell) ? `'${cell}` : cell;
}
