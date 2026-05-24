export type Services = 'authentication' | 'product' | 'card' | 'order';

/**
 * Checks whether the function is being invoked in Server or Client.
 * @returns True if this function is being invoked in Next Server, False if it is in browser.
 */
export function isServer() {
	return typeof window === 'undefined';
}

// ─── Backend host configuration ───────────────────────────────────────────
// After backend consolidation, all 4 services live behind ONE base URL.
// Flip API_TARGET between 'local' and 'aws' depending on where the backend
// is running. Replace AWS_BASE_URL after `serverless deploy`.
const API_TARGET = 'aws' as 'local' | 'aws';

// Use 127.0.0.1 (forced IPv4) so this doesn't collide with Next.js dev server
// when both default to localhost:3000 — the backend listens on IPv4 only.
const LOCAL_DEV_HOST = 'http://127.0.0.1:3000';
const AWS_BASE_URL =
	'https://bs57d6oqyi.execute-api.ap-south-1.amazonaws.com/dev';

const API_BASE_URL = API_TARGET === 'local' ? LOCAL_DEV_HOST : AWS_BASE_URL;

/**
 * Backend host URL. After consolidation, every service returns the same URL.
 * The `service` argument is kept for backward compatibility with callers.
 */
export function getServerHostUrl(_service: Services) {
	return API_BASE_URL;
}

/**
 * Creates URI based on Application Hosting.
 * @param endPoint - API Endpoint Path (must start with a forward slash).
 * @returns Complete URI.
 */
export function getApiUrl(service: Services, endPoint: string) {
	return `${getServerHostUrl(service)}${endPoint}`;
}

export const WEBSITE_URL = 'https://healthvisa.in/';

export const formatPrice = (num: number) => {
	const numberFormatter = new Intl.NumberFormat('en-GB');
	return numberFormatter.format(Math.round(num));
};

export const whatsappLink = 'https://wa.me/9997774204';
