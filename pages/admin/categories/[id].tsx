import {UpdateCategoryPage} from '@healthvisa/modules/admin/categories/UpdateCategoryPage';
import {useRouter} from 'next/router';
import React from 'react';

const EditProduct = () => {
	const router = useRouter();
	const ID = router.query.id as string;
	return (
		<div>
			<UpdateCategoryPage id={ID} />
		</div>
	);
};

export default EditProduct;
