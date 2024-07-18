import {ajaxGet, ajaxPatch, ajaxPost, getApiUrl} from '@healthvisa/utils';
import {Service, OrderAPI} from './api';

export interface IItems {
	id: string;
	name: string;
	desc: string;
	img: string;
	type: string;
	metadata: any;
	price: number;
	quantity: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface IOrder {
	id: string;
	userId: string;
	items: IItems[];
	addressId: string;
	uniqueOrderIdentifier: number;
	status: string;
	totalAmount: number;
	discount: number;
	otherCharges: number;
	finalAmount: number;
	orderDate: Date;
	deliveryDate: Date;
	rate: string;
	review: string;
	paymentMode: string;
	metadata: any;
}

export interface PleaceOrderRequestParams {
	userId: string;
	addressId: string;
	status: string;
	totalAmount: number;
	discount: number;
	otherCharges: number;
	finalAmount: number;
	orderDate: Date;
	deliveryDate: Date;
	paymentMode: string;
}
export function placeOrder({
	...requestBody
}: PleaceOrderRequestParams): Promise<IOrder[]> {
	const {
		userId,
		addressId,
		status,
		totalAmount,
		discount,
		otherCharges,
		finalAmount,
		orderDate,
		deliveryDate,
		paymentMode,
	} = requestBody;

	const data: PleaceOrderRequestParams = {
		userId,
		addressId,
		status,
		totalAmount,
		discount,
		otherCharges,
		finalAmount,
		orderDate,
		deliveryDate,
		paymentMode,
	};
	return ajaxPost<PleaceOrderRequestParams, IOrder[]>({
		data,
		url: getApiUrl(Service, OrderAPI.PlaceOrder),
	});
}

export type GetOrdersResponse = IOrder[];
/**
 * Get all Products
 */
export function getOrders(): Promise<GetOrdersResponse> {
	return ajaxGet<GetOrdersResponse>({
		url: getApiUrl(Service, OrderAPI.GetOrders),
		query: {
			filter: `{"order": "orderDate DESC"}`,
		},
	});
}
export interface GetUserOrderRequestParams {
	userId: string;
}
/**
 * Get user Orders
 */
export function getUserOrder({userId}: GetUserOrderRequestParams): Promise<IOrder[]> {
	return ajaxGet<IOrder[]>({
		url: `${getApiUrl(Service, OrderAPI.GetOrder)}/${userId}`,
	});
}

export interface GetOrderByID {
	id: string;
}
/**
 * Get user Orders
 */
export function getOrderById({id}: GetOrderByID): Promise<IOrder> {
	return ajaxGet<IOrder>({
		url: `${getApiUrl(Service, OrderAPI.GetOrderById)}/${id}`,
	});
}

// Update Order status
export interface OrderUpdateRequestParams {
	id: string;
	status: string;
}
export function updateOrder({...requestBody}: OrderUpdateRequestParams): Promise<any> {
	const {id, status} = requestBody;
	const data: Record<string, Primitive> = {
		id,
		status,
	};
	return ajaxPatch<Record<string, Primitive>, any>({
		data,
		url: `${getApiUrl(Service, OrderAPI.UpdateOrder)}/${id}`,
	});
}
