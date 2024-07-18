import {NextPage} from 'next';
import React from 'react';
import {Dashboard} from '@healthvisa/modules';

const Index: NextPage = () => {
	// const loader = useGuard('admin');
	console.log('jj');

	return (
		<div>
			<Dashboard />
		</div>
	);
};
export default Index;
