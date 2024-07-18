import {Layout} from '@healthvisa/components';
import {
	useAddCategory,
	useCategories,
} from '@healthvisa/models/admin/category/useCategories';
import {Button, Checkbox, Form, Input, message, Select, Skeleton} from 'antd';
import {UploadProps, RcFile} from 'antd/es/upload';
import type {CheckboxChangeEvent} from 'antd/es/checkbox';
import Dragger from 'antd/lib/upload/Dragger';
import {UploadFile} from 'antd/lib/upload/interface';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import TextArea from 'antd/lib/input/TextArea';

export const CreateCategoryPage = () => {
	const router = useRouter();
	const {data: categoryList} = useCategories();
	const addCategory = useAddCategory();
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [status, setStatus] = useState(false);

	const onFinish = (values: any) => {
		const formData = new FormData();
		fileList.forEach((file) => {
			formData.append('', file as RcFile);
			formData.append('category', values.category);
			formData.append('description', values.description);
			formData.append('status', JSON.stringify(status));
			formData.append('tags', JSON.stringify(values.tags));
			formData.append('createdBy', '1');
			formData.append('createdAt', new Date().toDateString());
			formData.append('updatedAt', new Date().toDateString());
		});
		addCategory.mutate(formData, {
			onSuccess: (res) => {
				message.success('Added Successfully..!');
				router.push('/admin/categories');
			},
			onError: (errors: any) => {
				message.error(errors?.errors.data.message);
			},
		});
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
		listType: 'text',
		maxCount: 1,
	};
	const onChange = (e: CheckboxChangeEvent) => {
		setStatus(e.target.checked);
	};

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid   ">
				<div className="flex justify-between items-center pr-4">
					<h1 className="text-xl font-bold">Add New Category</h1>
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
					{categoryList && categoryList.length ? (
						<Form
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
									className="w-[49%]"
									rules={[
										{
											required: true,
											message: 'Please enter description',
										},
									]}
								>
									<TextArea placeholder="Enter Description" rows={2} />
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
									loading={addCategory.isLoading}
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
