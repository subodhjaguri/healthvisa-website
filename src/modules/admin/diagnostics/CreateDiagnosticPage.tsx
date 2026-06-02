import {Layout} from '@healthvisa/components';
import {
	useAddDiagnostic,
	useGetLabs,
} from '@healthvisa/models/admin/lab-appointments/useLab';
import {
	Button,
	Form,
	Input,
	InputNumber,
	message,
	Select,
	Skeleton,
} from 'antd';
import {UploadProps, RcFile} from 'antd/es/upload';
import Dragger from 'antd/lib/upload/Dragger';
import {UploadFile} from 'antd/lib/upload/interface';
import {useRouter} from 'next/router';
import React, {useState} from 'react';

// Diagnostic images are stored as raw S3 keys; the backend find endpoint does
// NOT wrap them into {url}. Build the URL from this base for admin previews.
export const S3_UPLOADS_BASE =
	'https://hv-documents.s3.ap-south-1.amazonaws.com/uploads/';

export const VISIT_OPTIONS = [
	{value: 'lab', label: 'Lab Visit'},
	{value: 'home', label: 'Home Visit'},
	{value: 'center', label: 'Center Visit'},
];

export const buildDiagnosticFormData = (
	values: any,
	file: RcFile | null,
	id?: string,
) => {
	const formData = new FormData();
	if (file) formData.append('', file);
	if (id) formData.append('id', id);
	formData.append('name', values.name);
	formData.append('discount', String(values.discount ?? 0));
	formData.append('availableVisits', JSON.stringify(values.visits ?? []));
	formData.append('labs', JSON.stringify(values.labs ?? []));
	return formData;
};

export const CreateDiagnosticPage = () => {
	const router = useRouter();
	const {data: labs} = useGetLabs();
	const addDiagnostic = useAddDiagnostic();
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const onFinish = (values: any) => {
		if (!fileList.length) {
			message.error('Please add an image');
			return;
		}
		addDiagnostic.mutate(
			buildDiagnosticFormData(values, fileList[0] as RcFile),
			{
				onSuccess: () => {
					message.success('Added Successfully..!');
					router.push('/admin/diagnostics');
				},
				onError: (errors: any) => {
					message.error(errors?.errors?.data?.message ?? 'Failed to add');
				},
			},
		);
	};

	const uploadProps: UploadProps = {
		onRemove: () => setFileList([]),
		beforeUpload: (file) => {
			setFileList([file]);
			return false;
		},
		fileList,
		listType: 'picture',
		maxCount: 1,
	};

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid">
				<div className="flex justify-between items-center pr-4">
					<h1 className="text-xl font-bold">Add New Diagnostic</h1>
					<Button
						onClick={() => router.back()}
						style={{background: '#F8F9FA', color: 'black'}}
						className="w-24"
						type="primary"
					>
						Back
					</Button>
				</div>
				<div className="w-full">
					{labs ? (
						<Form
							scrollToFirstError
							layout="vertical"
							name="create-diagnostic"
							className="w-full"
							initialValues={{visits: ['lab']}}
							onFinish={onFinish}
							autoComplete="off"
						>
							<div className="flex justify-between flex-wrap w-full">
								<Form.Item
									label="Name"
									name="name"
									className="w-[49%]"
									rules={[{required: true, message: 'Please enter name'}]}
								>
									<Input placeholder="e.g. Sonography" />
								</Form.Item>

								<Form.Item
									label="Discount %"
									name="discount"
									className="w-[49%]"
									rules={[{required: true, message: 'Please enter discount %'}]}
								>
									<InputNumber min={0} max={100} style={{width: '100%'}} />
								</Form.Item>

								<Form.Item
									label="Visit types"
									name="visits"
									className="w-[49%]"
									rules={[{required: true, message: 'Select at least one'}]}
								>
									<Select mode="multiple" options={VISIT_OPTIONS} />
								</Form.Item>

								<Form.Item
									label="Labs that offer this"
									name="labs"
									className="w-[49%]"
									tooltip="Which labs appear under this diagnostic in the app."
								>
									<Select
										mode="multiple"
										showSearch
										optionFilterProp="label"
										placeholder="Select labs"
										options={(labs ?? []).map((l) => ({
											value: l.id,
											label: l.name,
										}))}
									/>
								</Form.Item>

								<Form.Item label="Image" name="image" className="w-[49%]">
									{/* eslint-disable-next-line react/jsx-props-no-spreading */}
									<Dragger {...uploadProps}>
										<span>
											Drop file here or{' '}
											<span className="font-bold">Browse</span>
										</span>
									</Dragger>
								</Form.Item>
							</div>
							<div className="flex">
								<Button
									loading={addDiagnostic.isLoading}
									style={{background: '#198753'}}
									className="w-24 mr-3"
									type="primary"
									htmlType="submit"
								>
									Add
								</Button>
								<Button
									onClick={() => router.back()}
									style={{background: '#F8F9FA', color: 'black'}}
									className="w-24"
									type="primary"
								>
									Cancel
								</Button>
							</div>
						</Form>
					) : (
						<>
							<Skeleton active />
							<Skeleton active />
						</>
					)}
				</div>
			</div>
		</Layout>
	);
};
