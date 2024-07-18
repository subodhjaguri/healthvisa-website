import {UpdateUserPage} from '@healthvisa/modules/admin/users/UpdateUserPage';
import {useRouter} from 'next/router';
import React from 'react';

const EditUser = () => {
	const router = useRouter();
	const ID = router.query.id as string;
	return (
		<div>
			<UpdateUserPage id={ID} />
		</div>
	);
};

export default EditUser;
