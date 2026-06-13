import {NewsFormPage} from '@healthvisa/modules/admin/news/NewsFormPage';
import {useRouter} from 'next/router';
import React from 'react';

const EditNews = () => {
	const router = useRouter();
	const ID = router.query.id as string;
	return (
		<div>
			<NewsFormPage id={ID} />
		</div>
	);
};

export default EditNews;
