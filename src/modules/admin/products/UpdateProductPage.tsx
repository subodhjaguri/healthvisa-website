import {Layout} from '@healthvisa/components';
import {useCategories} from '@healthvisa/models/admin/category/useCategories';
import {
	useProductById,
	useUpdateProduct,
	useUpdateProductWithoutImage,
} from '@healthvisa/models/admin/products/useProduct';
import {
	Button,
	Form,
	Input,
	InputNumber,
	message,
	Select,
	Skeleton,
	Space,
	Switch,
} from 'antd';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {UploadProps, RcFile} from 'antd/es/upload';
import TextArea from 'antd/lib/input/TextArea';
import Dragger from 'antd/lib/upload/Dragger';
import {UploadFile} from 'antd/lib/upload/interface';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';

/** Append the assembled (nested) product fields onto a FormData for update. */
const appendProductFields = (
	formData: FormData,
	values: any,
	id: string,
) => {
	const bookable = values.bookable !== false;
	const slots: string[] = (values.slots ?? [])
		.map((s: string) => (s ?? '').trim())
		.filter(Boolean);

	const description = [
		{
			type: 'doctor-badge',
			data: {
				designation: values.designation ?? '',
				qualification: values.qualification ?? '',
				hospital: values.hospital ?? '',
			},
		},
		{type: 'text', data: values.bio ?? ''},
	];
	const purchaseFields = bookable
		? [
				{type: 'DateInput', name: 'date', order: 1, metadata: {label: 'Select Date'}},
				{
					type: 'SlotInput',
					name: 'slot',
					order: 2,
					metadata: {label: 'Select Slot', slots},
				},
		  ]
		: [];
	const metadata = {
		address: values.address ?? '',
		fullAddress: values.address ?? '',
		hospital: values.hospital ?? '',
		timing: values.timing ?? '',
		booking: bookable ? {} : null,
		discount: Number(values.discount) || 0,
	};

	formData.append('id', id);
	formData.append('name', values.name);
	formData.append('type', values.type);
	formData.append('categoryId', values.category);
	formData.append('price', String(values.price));
	formData.append('discountPrice', String(values.discountPrice));
	formData.append('description', JSON.stringify(description));
	formData.append('purchaseFields', JSON.stringify(purchaseFields));
	formData.append('metadata', JSON.stringify(metadata));
};

export const UpdateProductPage = ({id}: {id: string}) => {
	const router = useRouter();
	const {data, isLoading} = useProductById({id});
	const {data: categoryList} = useCategories();
	const updateProduct = useUpdateProduct();
	const updateProductWithoutImage = useUpdateProductWithoutImage();
	const [form] = Form.useForm();
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [newFile, setNewFile] = useState<RcFile | null>(null);
	const [bookable, setBookable] = useState(true);

	// Decompose the nested DB shape back into flat form fields.
	useEffect(() => {
		if (!data) return;
		const desc = Array.isArray(data.description) ? data.description : [];
		const badge = desc.find((b) => b?.type === 'doctor-badge')?.data ?? {};
		const bio = desc.find((b) => b?.type === 'text')?.data ?? '';
		const meta: any = data.metadata ?? {};
		const slotField = (data.purchaseFields ?? []).find(
			(f) => f.type === 'SlotInput',
		);
		const isBookable = meta.booking !== null;
		setBookable(isBookable);
		form.setFieldsValue({
			name: data.name,
			type: data.type,
			category: data.categoryId,
			price: data.price,
			discount: meta.discount ?? 0,
			discountPrice: data.discountPrice,
			designation: badge.designation ?? '',
			qualification: badge.qualification ?? '',
			hospital: badge.hospital ?? meta.hospital ?? '',
			timing: meta.timing ?? '',
			address: meta.address ?? '',
			bio,
			bookable: isBookable,
			slots: slotField?.metadata?.slots ?? [],
		});
		if (data.image?.url) {
			setFileList([
				{uid: '-1', name: 'Current image', status: 'done', url: data.image.url},
			]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const recompute = (all: any) => {
		const price = Number(all.price) || 0;
		const disc = Number(all.discount) || 0;
		form.setFieldsValue({discountPrice: Math.round(price * (1 - disc / 100))});
	};
	const onValuesChange = (changed: any, all: any) => {
		if ('category' in changed) {
			const cat = categoryList?.find((c) => c.id === changed.category);
			const d = cat?.discount ?? all.discount ?? 0;
			form.setFieldsValue({discount: d});
			recompute({...all, discount: d});
		} else if ('price' in changed || 'discount' in changed) {
			recompute(all);
		}
	};

	const onFinish = (values: any) => {
		const onSuccess = () => {
			message.success('Updated Successfully..!');
			router.push('/admin/products');
		};
		const onError = (errors: any) => {
			message.error(errors?.errors?.data?.message ?? 'Failed to update');
		};

		if (newFile) {
			const formData = new FormData();
			formData.append('', newFile);
			appendProductFields(formData, values, id);
			updateProduct.mutate({id, data: formData}, {onSuccess, onError});
		} else {
			const formData = new FormData();
			appendProductFields(formData, values, id);
			updateProductWithoutImage.mutate({data: formData}, {onSuccess, onError});
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
				{isLoading ? (
					<Skeleton active />
				) : (
					<>
						<div className="flex justify-between items-center pr-4">
							<h1 className="text-xl font-bold">Update Product/Service</h1>
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
								form={form}
								scrollToFirstError
								layout="vertical"
								name="update-product"
								className="w-full"
								onValuesChange={onValuesChange}
								onFinish={onFinish}
								autoComplete="off"
							>
								<div className="flex justify-between flex-wrap w-full">
									<Form.Item
										label="Name"
										name="name"
										className="w-[49%]"
										rules={[{required: true, message: 'Please enter name!'}]}
									>
										<Input allowClear placeholder="e.g. Dr. Jane Doe" />
									</Form.Item>
									<Form.Item
										label="Type"
										name="type"
										className="w-[49%]"
										rules={[{required: true, message: 'Please select type'}]}
									>
										<Select
											options={[
												{value: 'Service', label: 'Service (Doctor)'},
												{value: 'Product', label: 'Product'},
											]}
										/>
									</Form.Item>
									<Form.Item
										label="Category"
										name="category"
										className="w-[49%]"
										rules={[{required: true, message: 'Please select category'}]}
									>
										<Select
											showSearch
											placeholder="Select category"
											optionFilterProp="label"
											options={(categoryList ?? []).map((cat) => ({
												value: cat.id,
												label: cat.category,
											}))}
										/>
									</Form.Item>
									<Form.Item
										label="Price (₹)"
										name="price"
										className="w-[15%]"
										rules={[{required: true, message: 'Enter price'}]}
									>
										<InputNumber min={0} style={{width: '100%'}} />
									</Form.Item>
									<Form.Item
										label="Discount %"
										name="discount"
										className="w-[15%]"
										tooltip="Auto-filled from the category; you can override."
									>
										<InputNumber min={0} max={100} style={{width: '100%'}} />
									</Form.Item>
									<Form.Item
										label="Discounted Price (₹)"
										name="discountPrice"
										className="w-[15%]"
										tooltip="Auto-calculated from price and discount."
									>
										<InputNumber min={0} style={{width: '100%'}} />
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

								<h2 className="text-base font-bold mt-2 mb-1">Doctor details</h2>
								<div className="flex justify-between flex-wrap w-full">
									<Form.Item label="Designation" name="designation" className="w-[49%]">
										<Input placeholder="e.g. MBBS, MD (Medicine)" />
									</Form.Item>
									<Form.Item label="Qualification" name="qualification" className="w-[49%]">
										<Input placeholder="e.g. MBBS, MD (Medicine)" />
									</Form.Item>
									<Form.Item label="Hospital / Clinic" name="hospital" className="w-[49%]">
										<Input placeholder="e.g. City Care Clinic" />
									</Form.Item>
									<Form.Item label="Timing (display)" name="timing" className="w-[49%]">
										<Input placeholder="e.g. 10am to 1pm / 6pm to 9pm" />
									</Form.Item>
									<Form.Item label="Address" name="address" className="w-full">
										<TextArea rows={2} placeholder="Full address" />
									</Form.Item>
									<Form.Item label="Description / Bio" name="bio" className="w-full">
										<TextArea rows={3} placeholder="About the doctor / service" />
									</Form.Item>
								</div>

								<h2 className="text-base font-bold mt-2 mb-1">Booking</h2>
								<Form.Item
									label="Bookable (shows date + slots in the app)"
									name="bookable"
									valuePropName="checked"
								>
									<Switch onChange={setBookable} />
								</Form.Item>

								{bookable && (
									<Form.Item label="Time Slots" className="w-full">
										<Form.List name="slots">
											{(fields, {add, remove}) => (
												<>
													{fields.map((field) => (
														<Space key={field.key} align="baseline">
															<Form.Item
																{...field}
																rules={[
																	{required: true, message: 'Enter a slot or remove'},
																]}
															>
																<Input
																	placeholder="e.g. 10:30 AM - 1:30 PM"
																	style={{width: 280}}
																/>
															</Form.Item>
															<MinusCircleOutlined onClick={() => remove(field.name)} />
														</Space>
													))}
													<Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
														Add slot
													</Button>
												</>
											)}
										</Form.List>
									</Form.Item>
								)}

								<div className="flex mt-3">
									<Button
										loading={updateProduct.isLoading || updateProductWithoutImage.isLoading}
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
					</>
				)}
			</div>
		</Layout>
	);
};
