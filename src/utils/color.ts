/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-bitwise */

const hexToRgb = (color: string): [number, number, number] => {
	const fullReg = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	const full = color.replace(fullReg, (_, r, g, b) => `${r}${r}${g}${g}${b}${b}`);
	const values = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);
	if (!values) {
		throw new Error(`Geist UI: Unsupported ${color} color.`);
	}
	return [
		Number.parseInt(values[1], 16),
		Number.parseInt(values[2], 16),
		Number.parseInt(values[3], 16),
	];
};

const rgba2hex = (orig: string) => {
	let a: any;
	const rgb: any = orig
		.replace(/\s/g, '')
		.match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
	const alpha = ((rgb && rgb[4]) || '').trim();

	let hex = rgb
		? (rgb[1] | (1 << 8)).toString(16).slice(1) +
		  (rgb[2] | (1 << 8)).toString(16).slice(1) +
		  (rgb[3] | (1 << 8)).toString(16).slice(1)
		: orig;

	if (alpha !== '') {
		a = alpha;
	} else {
		a = 1;
	}
	// multiply before convert to HEX
	a = ((a * 255) | (1 << 8)).toString(16).slice(1);
	hex += a;

	return hex;
};

export const colorToRgbValues = (color: string) => {
	if (color.charAt(0) === '#') return hexToRgb(color);

	const safeColor = color.replace(/ /g, '');
	const colorType = color.substr(0, 4);

	const regArray = safeColor.match(/\((.+)\)/);
	if (!colorType.startsWith('rgb') || !regArray) {
		throw new Error(`Geist UI: Only support ["RGB", "RGBA", "HEX"] color.`);
	}

	return regArray[1].split(',').map((str) => Number.parseFloat(str));
};

export const addColorAlpha = (color: string, alpha: number) => {
	if (!/^#|rgb|RGB/.test(color)) return color;
	const [r, g, b] = colorToRgbValues(color);

	let safeAlpha;
	if (alpha > 1) {
		safeAlpha = 1;
	} else if (alpha < 0) safeAlpha = 0;
	else safeAlpha = alpha;

	return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
};

/**
 *
 * @param color : hex value of color;
 * @param alpha : percentage of alpha or opacity;
 * @returns tailwing class name of color;
 */
export const addColorAlphaTailwind = (color: string, alpha: number) => {
	if (!/^#|rgb|RGB/.test(color)) return color;
	const [r, g, b] = colorToRgbValues(color);

	let safeAlpha;
	if (alpha > 1) {
		safeAlpha = 1;
	} else if (alpha < 0) safeAlpha = 0;
	else safeAlpha = alpha;
	return `[#${rgba2hex(`rgba(${r}, ${g}, ${b}, ${safeAlpha})`)}]`;
};
