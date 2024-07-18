import {Services} from '@healthvisa/utils';

/**
 * Unique Keys for Order.
 */
export enum OrderKeys {
	PlaceOrder = 'placeOrder',
	GetOrders = 'getOrders',
	GetOrder = 'getOrder',
	GetOrderById = 'getOrderById',
	UpdateOrder = 'updateOrder',
}

/**
 * API Endpoint for Order.
 */
export enum OrderAPI {
	PlaceOrder = '/orders',
	GetOrders = '/orders',
	GetOrder = '/orders/user',
	GetOrderById = '/orders',
	UpdateOrder = '/orders',
}

export const Service: Services = 'order';
