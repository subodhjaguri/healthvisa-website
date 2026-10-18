import {ArrowLeftOutlined} from '@ant-design/icons';
import {Layout} from '@healthvisa/components';
import {
	useAddCategory,
	useCategories,
} from '@healthvisa/models/admin/category/useCategories';
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
import TextArea from 'antd/lib/input/TextArea';

// The tag values the app actually groups categories by on the home screen.
export const CATEGORY_TAG_OPTIONS = [
	{value: 'Specialist', label: 'Specialist'},
	{value: 'SuperSpecialist', label: 'Super Specialist'},
	{value: 'DTC', label: 'DTC (Diagnostic)'},
	{value: 'AO', label: 'AO'},
	{value: 'Health', label: 'Health / Wellness'},
	{value: 'Pharmacy', label: 'Pharmacy'},
];

export const CreateCategoryPage = () => {
	const router = useRouter();
	const {data: categoryList} = useCategories();
	const addCategory = useAddCategory();
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const onFinish = (values: any) => {
		if (!fileList.length) {
			message.error('Please add an image');
			return;
		}
		const formData = new FormData();
		formData.append('', fileList[0] as RcFile);
		formData.append('category', values.category);
		formData.append('description', values.description ?? '');
		formData.append('status', JSON.stringify(values.status ?? true));
		formData.append('tags', JSON.stringify(values.tags ?? []));
		formData.append('discount', String(values.discount ?? 0));
		formData.append('createdBy', 'admin');

		addCategory.mutate(formData, {
			onSuccess: () => {
				message.success('Added Successfully..!');
				router.push('/admin/categories');
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
			<div className="admin-card">
				<div className="flex justify-between items-center pr-4">
					<h1 className="admin-page-title">Add New Category</h1>
					<Button onClick={() => router.back()} icon={<ArrowLeftOutlined />}>
						Back
					</Button>
				</div>
				<div className="w-full">
					{categoryList ? (
						<Form
							scrollToFirstError
							layout="vertical"
							name="create-category"
							className="w-full"
							initialValues={{status: true}}
							onFinish={onFinish}
							autoComplete="off"
						>
							<div className="flex justify-between flex-wrap w-full">
								<Form.Item
									label="Category Name"
									name="category"
									className="w-[49%]"
									rules={[{required: true, message: 'Please enter category'}]}
								>
									<Input placeholder="e.g. Cardiologist" />
								</Form.Item>

								<Form.Item
									label="Tags (home-screen grouping)"
									className="w-[49%]"
									name="tags"
									rules={[{required: true, message: 'Please select tags'}]}
								>
									<Select
										mode="multiple"
										style={{width: '100%'}}
										placeholder="Select group(s)"
										options={CATEGORY_TAG_OPTIONS}
									/>
								</Form.Item>

								<Form.Item
									label="Discount %"
									name="discount"
									className="w-[49%]"
									tooltip="Default discount for products in this category (drives the product price auto-calc)."
									rules={[{required: true, message: 'Please enter discount %'}]}
								>
									<InputNumber min={0} max={100} style={{width: '100%'}} />
								</Form.Item>

								<Form.Item label="Status" className="w-[49%]" name="status">
									<Select
										style={{width: '100%'}}
										options={[
											{value: true, label: 'Active'},
											{value: false, label: 'In-Active'},
										]}
									/>
								</Form.Item>

								<Form.Item
									label="Description"
									name="description"
									className="w-[49%]"
								>
									<TextArea placeholder="Enter description" rows={2} />
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
									loading={addCategory.isLoading}
									className="w-24 mr-3"
									type="primary"
									htmlType="submit"
								>
									Add
								</Button>
								<Button onClick={() => router.back()}>
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
