import {NextPage} from 'next';
import React from 'react';

import {CategoryListPage} from '@healthvisa/modules/admin/categories/CategoryListPage';
import {useRouter} from 'next/router';

const Index: NextPage = () => {
	console.log('jj');
	const router = useRouter();

	return (
		<div>
			<CategoryListPage />
		</div>
	);
};
export default Index;
