import {Layout} from '@healthvisa/components';
import {
	useCategoryById,
	useUpdateCategory,
	useUpdateCategoryWithoutImage,
} from '@healthvisa/models/admin/category/useCategories';
import {Button, Checkbox, Form, Input, message, Select, Skeleton} from 'antd';
import {UploadProps, RcFile} from 'antd/es/upload';
import type {CheckboxChangeEvent} from 'antd/es/checkbox';
import Dragger from 'antd/lib/upload/Dragger';
import {UploadFile} from 'antd/lib/upload/interface';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import {
	CategoryUpdateRequestParams,
	CategoryUpdateWithoutImageRequestParams,
} from '@healthvisa/models/admin/category/Categories';
import TextArea from 'antd/lib/input/TextArea';

export const UpdateCategoryPage = ({id}: {id: string}) => {
	const ID = id;
	const router = useRouter();
	const [key, setKey] = useState(1);
	const {data: category} = useCategoryById({id: ID});
	const updateCategory = useUpdateCategory();
	const updateCategoryWithoutImage = useUpdateCategoryWithoutImage();
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [status, setStatus] = useState(false);

	useEffect(() => {
		setKey(key + 1);
		if (category) {
			setStatus(category.status);
		}
	}, [category]);

	const onFinish = (values: any) => {
		if (fileList.length > 0) {
			const formData = new FormData();
			fileList.forEach((file) => {
				formData.append('', file as RcFile);
				formData.append('category', values.category);
				formData.append('description', values.description);
				formData.append('status', JSON.stringify(status));
				formData.append('tags', JSON.stringify(values.tags));
				formData.append('updatedAt', new Date().toDateString());
				formData.append('id', ID);
			});
			const body: CategoryUpdateRequestParams = {
				id: ID,
				data: formData,
			};

			updateCategory.mutate(body, {
				onSuccess: (res) => {
					message.success('Updated Successfully..!');
					router.push('/admin/categories');
				},
				onError: (errors: any) => {
					message.error(errors?.errors.data.message);
				},
			});
		} else {
			const formDataNew = new FormData();

			formDataNew.append('category', values.category);
			formDataNew.append('description', values.description);
			formDataNew.append('status', JSON.stringify(status));
			formDataNew.append('tags', JSON.stringify(values.tags));
			formDataNew.append('updatedAt', new Date().toDateString());
			formDataNew.append('id', ID);
			const bodyWithoutImage: CategoryUpdateWithoutImageRequestParams = {
				data: formDataNew,
			};
			updateCategoryWithoutImage.mutate(bodyWithoutImage, {
				onSuccess: (res) => {
					message.success('Updated Successfully..!');
					router.push('/admin/categories');
				},
				onError: (errors: any) => {
					message.error(errors?.errors.data.message);
				},
			});
		}
	};

	const props: UploadProps = {
		onRemove: (file) => {
			const index = fileList.indexOf(file);
			const newFileList = fileList.slice();
			newFileList.splice(index, 1);
			setFileList(newFileList);
		},
		beforeUpload: (file) => {
			setFileList([file]);
			return false;
		},
		fileList,
		listType: 'picture',
		maxCount: 1,
	};
	const onChange = (e: CheckboxChangeEvent) => {
		setStatus(e.target.checked);
	};

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid   ">
				<div className="flex justify-between items-center pr-4">
					<h1 className="text-xl font-bold">Update Category</h1>
					<Button
						onClick={() => router.back()}
						style={{
							background: '#F8F9FA',
							color: 'black',
						}}
						className="w-24"
						type="primary"
					>
						Back
					</Button>
				</div>
				<div className="w-full">
					{category ? (
						<Form
							key={key}
							scrollToFirstError
							layout="vertical"
							name="basic"
							className="w-full"
							initialValues={{remember: true}}
							onFinish={onFinish}
							autoComplete="off"
						>
							<div className="flex justify-between flex-wrap w-full">
								<Form.Item
									label="Category Name"
									name="category"
									initialValue={category.category}
									className="w-[49%]"
									rules={[
										{
											required: true,
											message: 'Please enter category',
										},
									]}
								>
									<Input placeholder="Enter Category" />
								</Form.Item>

								<Form.Item
									label="Tags"
									className="w-[49%]"
									name="tags"
									initialValue={category.tags}
									rules={[
										{
											required: true,
											message: 'Please select tags',
										},
									]}
								>
									<Select
										mode="multiple"
										style={{width: '100%'}}
										options={[
											{
												value: 'Specialist',
												label: 'Specialist',
											},
											{
												value: 'SuperSpecialist',
												label: 'SuperSpecialist',
											},

											{
												value: 'Diagnostic',
												label: 'Diagnostic',
											},

											{
												value: 'Other',
												label: 'Other',
											},
											{
												value: 'Health',
												label: 'Health',
											},
											{
												value: 'Emergency',
												label: 'Emergency',
											},
											{
												value: 'Members',
												label: 'Members',
											},
										]}
									/>
								</Form.Item>

								<Form.Item
									label="Description"
									name="description"
									initialValue={category.description}
									className="w-[49%]"
									rules={[
										{
											required: true,
											message: 'Please enter description',
										},
									]}
								>
									<TextArea rows={2} placeholder="Enter Description" />
								</Form.Item>
								<Form.Item label="Image" name="image" className="w-[49%]">
									{/* eslint-disable-next-line react/jsx-props-no-spreading */}
									<Dragger {...props}>
										<span>
											Drop files here to attach or{' '}
											<span className="font-bold">Browse</span>
										</span>
									</Dragger>
								</Form.Item>
								<Form.Item
									label="Status"
									className="w-[49%]"
									initialValue={category.status}
									name="status"
								>
									<Select
										style={{width: '100%'}}
										options={[
											{
												value: true,
												label: 'Active',
											},
											{
												value: false,
												label: 'In-Active',
											},
										]}
									/>
								</Form.Item>
							</div>
							<div className="flex ">
								<Button
									loading={updateCategory.isLoading}
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
