export type Services = 'authentication' | 'product' | 'card' | 'order';

/**
 * Checks whether the function is being invoked in Server or Client.
 * @returns True if this function is beinvoked in Next Server, False if it is in browser.
 */
export function isServer() {
	return typeof window === 'undefined';
}

/**
 * Provides with Web Application Entrypoint.
 * @returns Host Address for Web Server.
 */
export function getServerHostUrl(service: Services) {
	switch (service) {
		case 'authentication':
			return 'https://jq3fpv5xg5.execute-api.ap-south-1.amazonaws.com/dev';
		case 'product':
			return 'https://yc9tn3t71i.execute-api.ap-south-1.amazonaws.com/dev';

		case 'card':
			return 'https://g64d6g3v75.execute-api.ap-south-1.amazonaws.com/dev';
		case 'order':
			return 'https://74dbzyaatc.execute-api.ap-south-1.amazonaws.com/dev';
		default:
			return 'https://jq3fpv5xg5.execute-api.ap-south-1.amazonaws.com/dev';
	}
}

// export function getServerHostUrl(service: Services) {
// 	switch (service) {
// 		case 'authentication':
// 			return 'http://192.168.29.167:3001';
// 		case 'product':
// 			return 'http://192.168.29.167:3004';
// 		case 'card':
// 			return 'http://192.168.29.167:3002';
// 		case 'order':
// 			return 'http://192.168.29.167:3003';
// 		default:
// 			return 'http://192.168.29.167:3001';
// 	}
// }

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
