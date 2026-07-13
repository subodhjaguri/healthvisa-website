import {UpdateSymptomPage} from '@healthvisa/modules/admin/symptoms/UpdateSymptomPage';
import {useRouter} from 'next/router';
import React from 'react';

const EditSymptom = () => {
	const router = useRouter();
	const ID = router.query.id as string;
	return (
		<div>
			<UpdateSymptomPage id={ID} />
		</div>
	);
};

export default EditSymptom;
