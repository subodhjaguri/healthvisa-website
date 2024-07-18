import {Layout} from '@healthvisa/components';
import {useCategories} from '@healthvisa/models/admin/category/useCategories';
import {useAddProduct} from '@healthvisa/models/admin/products/useProduct';
import {Button, Form, Input, message, Select, Skeleton} from 'antd';
import {UploadProps, RcFile} from 'antd/es/upload';
import TextArea from 'antd/lib/input/TextArea';

import Dragger from 'antd/lib/upload/Dragger';
import {UploadFile} from 'antd/lib/upload/interface';
import {useRouter} from 'next/router';
import React, {useState} from 'react';

export const CreateProductPage = () => {
	const router = useRouter();
	const {data: categoryList} = useCategories();
	const addProduct = useAddProduct();
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const des =
		'[{"type":"text","data":"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos ut numquam minus vero explicabo consectetur temporibus, quasi ducimus accusamus omnis maxime dicta impedit iusto debitis. Veritatis ad animi veniam saepe officiis obcaecati nam, fuga est eveniet, voluptatem dolores maiores dolorum!,"}]';

	const onFinish = (values: any) => {
		const formData = new FormData();
		fileList.forEach((file) => {
			formData.append('', file as RcFile);
			formData.append('type', values.type);
			formData.append('name', values.name);
			formData.append('categoryId', values.category);
			formData.append('price', values.price);
			formData.append('description', des);
			formData.append('discountPrice', values.discountPrice);
			formData.append('purchaseFields', JSON.stringify([]));
		});

		addProduct.mutate(formData, {
			onSuccess: (res) => {
				message.success('Added Successfully..!');
				router.push('/admin/products');
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
		listType: 'picture',
		maxCount: 1,
	};

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid   ">
				<div className="flex justify-between items-center pr-4">
					<h1 className="text-xl font-bold">Add New Product/Service</h1>
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
									label="Product Name"
									name="name"
									className="w-[49%]"
									rules={[
										{
											required: true,
											message: 'Please enter Service/Product name!',
										},
									]}
								>
									<Input
										allowClear
										placeholder="Enter Product/Service"
									/>
								</Form.Item>
								<Form.Item
									label="Category"
									initialValue={categoryList[0].id}
									className="w-[49%]"
									name="category"
									rules={[
										{
											required: true,
											message: 'Please select category',
										},
									]}
								>
									<Select
										showSearch
										placeholder="Select"
										optionFilterProp="children"
										filterOption={(input, option) =>
											(option?.label ?? '')
												.toLowerCase()
												.includes(input.toLowerCase())
										}
										options={
											categoryList &&
											categoryList.map((cat) => ({
												value: cat.id,
												label: cat.category,
											}))
										}
									/>
								</Form.Item>

								<Form.Item
									rules={[
										{
											required: true,
											message: 'Please enter price!',
										},
									]}
									label="Price (Rs.)"
									name="price"
									className="w-[49%]"
								>
									<Input
										type="number"
										placeholder="Price"
										min={1}
										style={{width: '100%'}}
										defaultValue={3}
									/>
								</Form.Item>
								<Form.Item
									rules={[
										{
											required: true,
											message: 'Please enter discount price!',
										},
									]}
									label="Discounted Price (Rs)"
									name="discountPrice"
									className="w-[49%]"
								>
									<Input
										type="number"
										placeholder="Discount Price"
										min={1}
										style={{width: '100%'}}
									/>
								</Form.Item>
								<Form.Item
									label="Type"
									initialValue="Service"
									name="type"
									className="w-[49%]"
									rules={[
										{
											required: true,
											message: 'Please select Type',
										},
									]}
								>
									<Select
										style={{width: '100%'}}
										options={[
											{
												value: 'Service',
												label: 'Service',
											},
											{
												value: 'Product',
												label: 'Product',
											},
										]}
									/>
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

								<div className="w-full flex justify-between">
									{/* <Form.Item
										label="Description"
										name="description"
										className="w-[49%]">
										<TextArea
											disabled
											rows={2}
											placeholder="Enter Description"
										/>
									</Form.Item> */}
								</div>
							</div>
							<div className="flex ">
								<Button
									loading={addProduct.isLoading}
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
