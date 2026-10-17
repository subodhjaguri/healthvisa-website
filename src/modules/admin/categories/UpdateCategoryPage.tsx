import {ArrowLeftOutlined} from '@ant-design/icons';
import {Layout} from '@healthvisa/components';
import {
	useCategoryById,
	useUpdateCategory,
	useUpdateCategoryWithoutImage,
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
import React, {useEffect, useState} from 'react';
import TextArea from 'antd/lib/input/TextArea';
import {CATEGORY_TAG_OPTIONS} from './CreateCategoryPage';

export const UpdateCategoryPage = ({id}: {id: string}) => {
	const router = useRouter();
	const {data: category, isLoading} = useCategoryById({id});
	const updateCategory = useUpdateCategory();
	const updateCategoryWithoutImage = useUpdateCategoryWithoutImage();
	const [form] = Form.useForm();
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [newFile, setNewFile] = useState<RcFile | null>(null);

	useEffect(() => {
		if (!category) return;
		form.setFieldsValue({
			category: category.category,
			description: category.description ?? '',
			tags: category.tags ?? [],
			discount: category.discount ?? 0,
			status: category.status ?? true,
		});
		if (category.image?.url) {
			setFileList([
				{uid: '-1', name: 'Current image', status: 'done', url: category.image.url},
			]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [category]);

	const appendFields = (formData: FormData, values: any) => {
		formData.append('id', id);
		formData.append('category', values.category);
		formData.append('description', values.description ?? '');
		formData.append('status', JSON.stringify(values.status ?? true));
		formData.append('tags', JSON.stringify(values.tags ?? []));
		formData.append('discount', String(values.discount ?? 0));
	};

	const onFinish = (values: any) => {
		const onSuccess = () => {
			message.success('Updated Successfully..!');
			router.push('/admin/categories');
		};
		const onError = (errors: any) => {
			message.error(errors?.errors?.data?.message ?? 'Failed to update');
		};

		if (newFile) {
			const formData = new FormData();
			formData.append('', newFile);
			appendFields(formData, values);
			updateCategory.mutate({id, data: formData}, {onSuccess, onError});
		} else {
			const formData = new FormData();
			appendFields(formData, values);
			updateCategoryWithoutImage.mutate({data: formData}, {onSuccess, onError});
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
			<div className="admin-card">
				<div className="flex justify-between items-center pr-4">
					<h1 className="admin-page-title">Update Category</h1>
					<Button onClick={() => router.back()} icon={<ArrowLeftOutlined />}>
						Back
					</Button>
				</div>
				<div className="w-full">
					{isLoading || !category ? (
						<Skeleton active />
					) : (
						<Form
							form={form}
							scrollToFirstError
							layout="vertical"
							name="update-category"
							className="w-full"
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

								<Form.Item label="Description" name="description" className="w-[49%]">
									<TextArea rows={2} placeholder="Enter description" />
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
										updateCategory.isLoading || updateCategoryWithoutImage.isLoading
									}
									className="w-24 mr-3"
									type="primary"
									htmlType="submit"
								>
									Update
								</Button>
								<Button onClick={() => router.back()}>
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
