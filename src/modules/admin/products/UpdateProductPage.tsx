import {UserOutlined} from '@ant-design/icons';
import {Layout} from '@healthvisa/components';
import {useCategories} from '@healthvisa/models/admin/category/useCategories';
import {
	ProductUpdateRequestParams,
	ProductUpdateWithoutImageRequestParams,
} from '@healthvisa/models/admin/products/Product';
import {
	useProductById,
	useUpdateProduct,
	useUpdateProductWithoutImage,
} from '@healthvisa/models/admin/products/useProduct';
import {Button, Form, Input, message, Select, Skeleton, UploadProps} from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import {RcFile, UploadFile} from 'antd/lib/upload/interface';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';

export const UpdateProductPage = ({id}: {id: string}) => {
	const router = useRouter();
	const ID = id;
	const [key_, setKey_] = useState(1);
	const {data, isLoading} = useProductById({id: ID});

	const {data: categoryList} = useCategories();
	const updateProduct = useUpdateProduct();
	const updateProductWithoutImage = useUpdateProductWithoutImage();
	const [fileList, setFileList] = useState<UploadFile[]>([
		// {
		// 	uid: '-1',
		// 	name: 'image.png',
		// 	status: 'done',
		// 	url: 'https://healthvisa-dev.s3.ap-south-1.amazonaws.com/Product/636ce035c7f5494defe8f5fb.jpeg',
		// },
	]);
	const [type, setType] = useState('');
	const [purchaseComponent, setPurchaseComponent] = useState('');
	useEffect(() => {
		setKey_(key_ + 1);
		if (data) setType(data?.type);
		if (data && data.image.url) {
			// setFileList([
			// 	{
			// 		uid: '-1',
			// 		name: 'image.png',
			// 		status: 'done',
			// 		url: data?.image?.url,
			// 	},
			// ]);
		}
	}, [data]);

	const des =
		'[{"type":"text","data":"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos ut numquam minus vero explicabo consectetur temporibus, quasi ducimus accusamus omnis maxime dicta impedit iusto debitis. Veritatis ad animi veniam saepe officiis obcaecati nam, fuga est eveniet, voluptatem dolores maiores dolorum!,"}]';
	const purchaseFiels = [
		{
			metadata: {
				label: 'Booking Date',
			},
			name: 'date',
			order: 1,
			type: 'DateInput',
		},
		{
			metadata: {
				slots: [
					'10:00 AM-10:30 AM',
					'10:30 AM-11:00 AM',
					'11:00 AM-11:30 AM',
					'01:00 PM-01:30 PM',
				],
				label: 'Time Slots',
			},
			name: 'slot',
			order: 2,
			type: 'SlotInput',
		},
	];
	const onFinish = async (values: any) => {
		if (fileList.length > 0) {
			const formData = new FormData();
			fileList.forEach((file) => {
				formData.append('', file as RcFile);
				formData.append('type', values.type);
				formData.append('name', values.name);
				formData.append('categoryId', values.category);
				formData.append('price', values.price);
				formData.append('description', des);
				formData.append('discountPrice', values.discountPrice);
				formData.append('id', ID);
			});
			const body: ProductUpdateRequestParams = {
				id: ID,
				data: formData,
			};
			updateProduct.mutate(body, {
				onSuccess: (res) => {
					message.success('Updated Successfully..!');
					router.push('/admin/products');
				},
				onError: (errors: any) => {
					message.error(errors?.errors.data.message);
				},
			});
		} else {
			const formDataNew = new FormData();
			formDataNew.append('name', values.name);
			formDataNew.append('description', des);
			formDataNew.append('categoryId', values.category);
			formDataNew.append('metadata', JSON.stringify({}));
			formDataNew.append('type', values.type);
			formDataNew.append('price', values.price);
			formDataNew.append('discountPrice', values.discountPrice);
			formDataNew.append('id', ID);

			const bodyWithoutImage: ProductUpdateWithoutImageRequestParams = {
				data: formDataNew,
			};
			updateProductWithoutImage.mutate(bodyWithoutImage, {
				onSuccess: (res) => {
					message.success('Updated Successfully..!');
					router.push('/admin/products');
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
		// defaultFileList: [
		// 	{
		// 		uid: '1',
		// 		name: 'Test',
		// 		status: 'done',
		// 		url: 'https://cdn.pixabay.com/photo/2018/08/26/23/55/woman-3633737_960_720.jpg',
		// 	},
		// ],
	};

	const typeHandler = (value: string) => {
		setType(value);
		setPurchaseComponent('');
	};

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid   ">
				{isLoading ? (
					<Skeleton active />
				) : (
					<div>
						<div className="flex justify-between items-center pr-4">
							<h1 className="text-xl font-bold">Update</h1>
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
						<div key={key_} className="w-full">
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
										initialValue={data?.name}
										className="w-[49%]"
										rules={[
											{
												required: true,
												message:
													'Please enter Service/Product name!',
											},
										]}
									>
										<Input placeholder="Enter Product/Service" />
									</Form.Item>

									<Form.Item
										label="Category"
										initialValue={data?.categoryId}
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
										label="Price"
										name="price"
										rules={[
											{
												required: true,
												message: 'Please enter discount price!',
											},
										]}
										initialValue={data?.price}
										className="w-[49%]"
									>
										<Input type="number" style={{width: '100%'}} />
									</Form.Item>
									<Form.Item
										initialValue={data?.discountPrice}
										rules={[
											{
												required: true,
												message: 'Please enter discount price!',
											},
										]}
										label="Discount Price"
										name="discountPrice"
										className="w-[49%]"
									>
										<Input
											prefix={<UserOutlined />}
											type="number"
											placeholder="Discount Price"
											min={1}
											style={{width: '100%'}}
										/>
									</Form.Item>
									<Form.Item
										label="Type"
										initialValue={data?.type}
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
											onChange={typeHandler}
										/>
									</Form.Item>
									<Form.Item
										label="Image"
										name="image"
										className="w-[50%] row-auto"
									>
										{/* eslint-disable-next-line react/jsx-props-no-spreading */}
										<Dragger {...props}>
											<span>
												Drop files here to attach or{' '}
												<span className="font-bold">Browse</span>
											</span>
										</Dragger>
									</Form.Item>

									{/* <div className="w-full flex justify-between">
										<Form.Item
											label="Description"
											name="description"
											initialValue={JSON.stringify(
												data?.description,
											)}
											className="w-full">
											<TextArea
												rows={4}
												placeholder="Enter Description"
											/>
										</Form.Item>
									</div>
									<div className="w-full flex justify-between">
										<PurchaseField />
									</div> */}
								</div>

								<div className="flex ">
									<Button
										loading={updateProduct.isLoading}
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
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
};
