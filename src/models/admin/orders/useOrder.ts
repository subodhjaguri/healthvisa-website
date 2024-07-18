import {XHRErrorResponse} from '@healthvisa/utils';
import {
	useMutation,
	UseMutationOptions,
	UseMutationResult,
	useQuery,
	useQueryClient,
	UseQueryOptions,
	UseQueryResult,
} from 'react-query';
import {OrderKeys} from './api';
import {
	getOrders,
	GetOrdersResponse,
	GetOrderByID,
	getOrderById,
	getUserOrder,
	GetUserOrderRequestParams,
	IOrder,
	placeOrder,
	PleaceOrderRequestParams,
	updateOrder,
	OrderUpdateRequestParams,
} from './Order';

export function usePlaceOrder(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<IOrder[], XHRErrorResponse, PleaceOrderRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<IOrder[], XHRErrorResponse, PleaceOrderRequestParams> {
	// const queryClient = useQueryClient();
	return useMutation((reqParams: PleaceOrderRequestParams) => placeOrder(reqParams), {
		mutationKey: [OrderKeys.PlaceOrder],
		...queryOptions,
		onSuccess(data: IOrder[], ...rest) {
			// queryClient.invalidateQueries(OrderKeys.GetFamilyMember);
			return queryOptions?.onSuccess?.(data, ...rest);
		},
	});
}

/**
 * Order get by userID
 */
export function useOrderGetByUser(
	queryParams: GetUserOrderRequestParams,
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				IOrder[],
				XHRErrorResponse,
				IOrder[],
				[OrderKeys.GetOrder, string]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<IOrder[], XHRErrorResponse> {
	return useQuery(
		[OrderKeys.GetOrder, queryParams.userId],
		() => getUserOrder(queryParams),
		{
			notifyOnChangeProps: 'tracked',
			refetchOnWindowFocus: 'always', // Frequency of Change would be Low
			...queryOptions,
		},
	);
}

/**
 * Order get by Order ID
 */
export function useOrderByID(
	queryParams: GetOrderByID,
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				IOrder,
				XHRErrorResponse,
				IOrder,
				[OrderKeys.GetOrderById, string]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<IOrder, XHRErrorResponse> {
	return useQuery(
		[OrderKeys.GetOrderById, queryParams.id],
		() => getOrderById(queryParams),
		{
			notifyOnChangeProps: 'tracked',
			refetchOnWindowFocus: true, // Frequency of Change would be Low
			...queryOptions,
		},
	);
}

export function useGetOrders(
	queryOptions?: Partial<
		Omit<
			UseQueryOptions<
				GetOrdersResponse,
				XHRErrorResponse,
				GetOrdersResponse,
				[OrderKeys.GetOrders]
			>,
			'queryKey' | 'queryFn'
		>
	>,
): UseQueryResult<GetOrdersResponse, XHRErrorResponse> {
	return useQuery([OrderKeys.GetOrders], () => getOrders(), {
		refetchOnWindowFocus: true,
		...queryOptions,
	});
}

export function useUpdateOrder(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<any, XHRErrorResponse, OrderUpdateRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<any, XHRErrorResponse, OrderUpdateRequestParams> {
	const queryClient = useQueryClient();
	return useMutation((reqParams: OrderUpdateRequestParams) => updateOrder(reqParams), {
		mutationKey: [OrderKeys.UpdateOrder],
		retry: 2, // Try at least Thrice before giving up
		...queryOptions,
		onSuccess(data: any, ...rest) {
			queryClient.invalidateQueries(OrderKeys.GetOrders);
			return queryOptions?.onSuccess?.(data, ...rest);
		},
	});
}
