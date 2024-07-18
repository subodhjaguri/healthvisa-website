import {useAddressGetById} from '@healthvisa/models/admin/address/useAddress';
import {useOrderByID} from '@healthvisa/models/admin/orders/useOrder';
import React from 'react';

const Address = ({id}: {id: string}) => {
	console.log('Address: ');

	const {data, isLoading} = useOrderByID({
		id,
	});

	const {data: address} = useAddressGetById({
		id: data?.addressId ?? '',
	});

	return <div>Address</div>;
};

export default Address;
