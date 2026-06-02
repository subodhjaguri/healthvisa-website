import {UpdateLabPage} from '@healthvisa/modules/admin/labs/UpdateLabPage';
import {useRouter} from 'next/router';
import React from 'react';

const EditLab = () => {
	const router = useRouter();
	const ID = router.query.id as string;
	return (
		<div>
			<UpdateLabPage id={ID} />
		</div>
	);
};

export default EditLab;
