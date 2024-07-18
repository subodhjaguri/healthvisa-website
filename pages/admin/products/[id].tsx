import {UpdateProductPage} from '@healthvisa/modules/admin/products/UpdateProductPage';
import {useRouter} from 'next/router';
import React from 'react';

const EditProduct = () => {
	const router = useRouter();
	const ID = router.query.id as string;
	return (
		<div>
			<UpdateProductPage id={ID} />
		</div>
	);
};

export default EditProduct;
