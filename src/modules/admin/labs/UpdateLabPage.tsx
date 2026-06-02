import {Layout} from '@healthvisa/components';
import {
	useLabById,
	useUpdateLab,
	useUpdateLabWithoutImage,
} from '@healthvisa/models/admin/lab-appointments/useLab';
import {Button, Form, Input, message, Skeleton} from 'antd';
import {UploadProps, RcFile} from 'antd/es/upload';
import Dragger from 'antd/lib/upload/Dragger';
import {UploadFile} from 'antd/lib/upload/interface';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import TextArea from 'antd/lib/input/TextArea';
import {buildLabFormData, LAB_S3_BASE} from './CreateLabPage';

export const UpdateLabPage = ({id}: {id: string}) => {
	const router = useRouter();
	const {data, isLoading} = useLabById(id);
	const updateLab = useUpdateLab();
	const updateLabWithoutImage = useUpdateLabWithoutImage();
	const [form] = Form.useForm();
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [newFile, setNewFile] = useState<RcFile | null>(null);

	useEffect(() => {
		if (!data) return;
		form.setFieldsValue({
			name: data.name,
			shortAddress: data.shortAddress ?? '',
			fullAddress: data.fullAddress ?? '',
			description: data.description ?? '',
			certificate: data.certificate ?? '',
			availability: data.availability ?? '',
		});
		if (data.image) {
			setFileList([
				{
					uid: '-1',
					name: 'Current image',
					status: 'done',
					url: `${LAB_S3_BASE}${data.image}`,
				},
			]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const onFinish = (values: any) => {
		const onSuccess = () => {
			message.success('Updated Successfully..!');
			router.push('/admin/labs');
		};
		const onError = (errors: any) => {
			message.error(errors?.errors?.data?.message ?? 'Failed to update');
		};
		if (newFile) {
			updateLab.mutate(
				{id, data: buildLabFormData(values, newFile, id)},
				{onSuccess, onError},
			);
		} else {
			updateLabWithoutImage.mutate(
				{data: buildLabFormData(values, null, id)},
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
					<h1 className="text-xl font-bold">Update Lab</h1>
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
							name="update-lab"
							className="w-full"
							onFinish={onFinish}
							autoComplete="off"
						>
							<div className="flex justify-between flex-wrap w-full">
								<Form.Item
									label="Lab Name"
									name="name"
									className="w-[49%]"
									rules={[{required: true, message: 'Please enter lab name'}]}
								>
									<Input placeholder="e.g. The Lab Plus" />
								</Form.Item>
								<Form.Item label="Short Address" name="shortAddress" className="w-[49%]">
									<Input placeholder="e.g. Mira Road East" />
								</Form.Item>
								<Form.Item
									label="Full Address"
									name="fullAddress"
									className="w-[49%]"
									rules={[{required: true, message: 'Please enter full address'}]}
								>
									<TextArea rows={2} placeholder="Full address" />
								</Form.Item>
								<Form.Item
									label="Description"
									name="description"
									className="w-[49%]"
									rules={[{required: true, message: 'Please enter description'}]}
								>
									<TextArea rows={2} placeholder="About the lab" />
								</Form.Item>
								<Form.Item label="Certificate / Accreditation" name="certificate" className="w-[49%]">
									<Input placeholder="e.g. NABL Accredited" />
								</Form.Item>
								<Form.Item label="Availability (display)" name="availability" className="w-[49%]">
									<Input placeholder="e.g. Mon–Sat, 8am–9pm" />
								</Form.Item>
								<Form.Item label="Logo / Image" name="image" className="w-[49%]">
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
									loading={updateLab.isLoading || updateLabWithoutImage.isLoading}
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
