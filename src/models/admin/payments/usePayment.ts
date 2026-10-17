import {useQuery, useQueryClient, useMutation} from 'react-query';
import {PaymentKeys} from './api';
import {checkRefunds, getPayment, getPayments, recheckPayment, refundPayment} from './Payment';

export function useGetPayments() {
	return useQuery([PaymentKeys.GetPayments], () => getPayments(), {refetchOnWindowFocus: true});
}

export function useGetPayment(id?: string) {
	return useQuery([PaymentKeys.GetPayment, id], () => getPayment(id!), {enabled: !!id});
}

/** Re-check, refund and refund-check all refresh the list and the open payment. */
export function usePaymentActions() {
	const queryClient = useQueryClient();
	const refresh = () => {
		queryClient.invalidateQueries([PaymentKeys.GetPayments]);
		queryClient.invalidateQueries([PaymentKeys.GetPayment]);
	};
	return {
		recheck: useMutation((id: string) => recheckPayment(id), {onSuccess: refresh}),
		refund: useMutation(
			({id, ...body}: {id: string; amount?: number; reason: string}) => refundPayment(id, body),
			{onSuccess: refresh},
		),
		refundCheck: useMutation((id: string) => checkRefunds(id), {onSuccess: refresh}),
	};
}
