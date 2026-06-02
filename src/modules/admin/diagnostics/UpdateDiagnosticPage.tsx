import {Layout} from '@healthvisa/components';
import {
	useDiagnosticById,
	useGetLabs,
	useUpdateDiagnostic,
	useUpdateDiagnosticWithoutImage,
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
import React, {useEffect, useState} from 'react';
import {
	buildDiagnosticFormData,
	S3_UPLOADS_BASE,
	VISIT_OPTIONS,
} from './CreateDiagnosticPage';

export const UpdateDiagnosticPage = ({id}: {id: string}) => {
	const router = useRouter();
	const {data, isLoading} = useDiagnosticById(id);
	const {data: labs} = useGetLabs();
	const updateDiagnostic = useUpdateDiagnostic();
	const updateDiagnosticWithoutImage = useUpdateDiagnosticWithoutImage();
	const [form] = Form.useForm();
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [newFile, setNewFile] = useState<RcFile | null>(null);

	useEffect(() => {
		if (!data) return;
		form.setFieldsValue({
			name: data.name,
			discount: data.discount ?? 0,
			visits: data.availableVisits ?? [],
			labs: data.labs ?? [],
		});
		if (data.image) {
			setFileList([
				{
					uid: '-1',
					name: 'Current image',
					status: 'done',
					url: `${S3_UPLOADS_BASE}${data.image}`,
				},
			]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const onFinish = (values: any) => {
		const onSuccess = () => {
			message.success('Updated Successfully..!');
			router.push('/admin/diagnostics');
		};
		const onError = (errors: any) => {
			message.error(errors?.errors?.data?.message ?? 'Failed to update');
		};
		if (newFile) {
			updateDiagnostic.mutate(
				{id, data: buildDiagnosticFormData(values, newFile, id)},
				{onSuccess, onError},
			);
		} else {
			updateDiagnosticWithoutImage.mutate(
				{data: buildDiagnosticFormData(values, null, id)},
				{onSuccess, onError},
			);
		}
	};

	const uploadProps: UploadProps = {
		onRemove: () => {
			setNewFile(null);
			setFileList([]);
		},
		beforeUpload: (file) => {
			setNewFile(file);
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
					<h1 className="text-xl font-bold">Update Diagnostic</h1>
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
					{isLoading || !data ? (
						<Skeleton active />
					) : (
						<Form
							form={form}
							scrollToFirstError
							layout="vertical"
							name="update-diagnostic"
							className="w-full"
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
									loading={
										updateDiagnostic.isLoading ||
										updateDiagnosticWithoutImage.isLoading
									}
									style={{background: '#198753'}}
									className="w-24 mr-3"
									type="primary"
									htmlType="submit"
								>
									Update
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
					)}
				</div>
			</div>
		</Layout>
	);
};
