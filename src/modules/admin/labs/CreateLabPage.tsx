import {Layout} from '@healthvisa/components';
import {useAddLab} from '@healthvisa/models/admin/lab-appointments/useLab';
import {Button, Form, Input, message} from 'antd';
import {UploadProps, RcFile} from 'antd/es/upload';
import Dragger from 'antd/lib/upload/Dragger';
import {UploadFile} from 'antd/lib/upload/interface';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import TextArea from 'antd/lib/input/TextArea';

// Lab images are stored as raw S3 keys (no {url} wrapping); build the URL from
// this base for admin previews.
export const LAB_S3_BASE =
	'https://hv-documents.s3.ap-south-1.amazonaws.com/uploads/';

export const buildLabFormData = (
	values: any,
	file: RcFile | null,
	id?: string,
) => {
	const fd = new FormData();
	if (file) fd.append('', file);
	if (id) fd.append('id', id);
	fd.append('name', values.name);
	fd.append('shortAddress', values.shortAddress ?? '');
	fd.append('fullAddress', values.fullAddress ?? '');
	fd.append('description', values.description ?? '');
	fd.append('certificate', values.certificate ?? '');
	fd.append('availability', values.availability ?? '');
	return fd;
};

export const CreateLabPage = () => {
	const router = useRouter();
	const addLab = useAddLab();
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const onFinish = (values: any) => {
		if (!fileList.length) {
			message.error('Please add a logo / image');
			return;
		}
		addLab.mutate(buildLabFormData(values, fileList[0] as RcFile), {
			onSuccess: () => {
				message.success('Added Successfully..!');
				router.push('/admin/labs');
			},
			onError: (errors: any) => {
				message.error(errors?.errors?.data?.message ?? 'Failed to add');
			},
		});
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
					<h1 className="text-xl font-bold">Add New Lab</h1>
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
					<Form
						scrollToFirstError
						layout="vertical"
						name="create-lab"
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
										Drop file here or <span className="font-bold">Browse</span>
									</span>
								</Dragger>
							</Form.Item>
						</div>
						<div className="flex">
							<Button
								loading={addLab.isLoading}
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
				</div>
			</div>
		</Layout>
	);
};
