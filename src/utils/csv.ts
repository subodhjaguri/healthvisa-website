/**
 * A text cell for react-csv's CSVLink, which wraps every cell in double quotes
 * but leaves the quotes inside it alone. So a quote in the text is doubled
 * (RFC 4180), and a cell starting with =, +, -, @, tab or carriage return
 * gets a leading single quote, so Excel or Sheets show it as text instead of
 * running it as a formula.
 */
export function csvSafe(cell: string): string {
	const quoted = cell.replace(/"/g, '""');
	return /^[=+\-@\t\r]/.test(quoted) ? `'${quoted}` : quoted;
}
