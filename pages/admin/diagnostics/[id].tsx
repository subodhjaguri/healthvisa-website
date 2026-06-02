import {UpdateDiagnosticPage} from '@healthvisa/modules/admin/diagnostics/UpdateDiagnosticPage';
import {useRouter} from 'next/router';
import React from 'react';

const EditDiagnostic = () => {
	const router = useRouter();
	const ID = router.query.id as string;
	return (
		<div>
			<UpdateDiagnosticPage id={ID} />
		</div>
	);
};

export default EditDiagnostic;
