import {Layout} from '@healthvisa/components';
import {useCategories} from '@healthvisa/models/admin/category/useCategories';
import {useAddProduct} from '@healthvisa/models/admin/products/useProduct';
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
import React, {useState} from 'react';

/**
 * Assemble the nested DB shape the mobile app expects from flat form values.
 * Keeps the (legacy) description/purchaseFields/metadata structure intact so
 * the app renders and books the product without changes.
 */
const buildProductFormData = (values: any, fileList: UploadFile[]) => {
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
				{
					type: 'DateInput',
					name: 'date',
					order: 1,
					metadata: {label: 'Select Date'},
				},
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

	const formData = new FormData();
	formData.append('', fileList[0] as RcFile);
	formData.append('name', values.name);
	formData.append('type', values.type);
	formData.append('categoryId', values.category);
	formData.append('price', String(values.price));
	formData.append('discountPrice', String(values.discountPrice));
	formData.append('description', JSON.stringify(description));
	formData.append('purchaseFields', JSON.stringify(purchaseFields));
	formData.append('metadata', JSON.stringify(metadata));
	return formData;
};

export const CreateProductPage = () => {
	const router = useRouter();
	const {data: categoryList} = useCategories();
	const addProduct = useAddProduct();
	const [form] = Form.useForm();
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [bookable, setBookable] = useState(true);

	const recompute = (all: any) => {
		const price = Number(all.price) || 0;
		const disc = Number(all.discount) || 0;
		form.setFieldsValue({
			discountPrice: Math.round(price * (1 - disc / 100)),
		});
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
		if (!fileList.length) {
			message.error('Please add an image');
			return;
		}
		addProduct.mutate(buildProductFormData(values, fileList), {
			onSuccess: () => {
				message.success('Added Successfully..!');
				router.push('/admin/products');
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
					<h1 className="text-xl font-bold">Add New Product/Service</h1>
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
					{categoryList && categoryList.length ? (
						<Form
							form={form}
							scrollToFirstError
							layout="vertical"
							name="create-product"
							className="w-full"
							initialValues={{type: 'Service', bookable: true}}
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
										options={categoryList.map((cat) => ({
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
								<Form.Item
									label="Designation"
									name="designation"
									className="w-[49%]"
								>
									<Input placeholder="e.g. MBBS, MD (Medicine)" />
								</Form.Item>
								<Form.Item
									label="Qualification"
									name="qualification"
									className="w-[49%]"
								>
									<Input placeholder="e.g. MBBS, MD (Medicine)" />
								</Form.Item>
								<Form.Item
									label="Hospital / Clinic"
									name="hospital"
									className="w-[49%]"
								>
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
								<Form.Item label="Time Slots" className="w-full" required>
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
												<Button
													type="dashed"
													onClick={() => add()}
													icon={<PlusOutlined />}
												>
													Add slot
												</Button>
											</>
										)}
									</Form.List>
								</Form.Item>
							)}

							<div className="flex mt-3">
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
