import {Layout} from '@healthvisa/components';
import {
	useAddSymptom,
} from '@healthvisa/models/admin/symptoms/useSymptoms';
import {useCategories} from '@healthvisa/models/admin/category/useCategories';
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

export const CreateSymptomPage = () => {
	const router = useRouter();
	const {isLoading: isCategoriesLoading, data: categoryList} = useCategories();
	const addSymptom = useAddSymptom();
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const onFinish = (values: any) => {
		if (!fileList.length) {
			message.error('Please add an image');
			return;
		}
		const formData = new FormData();
		formData.append('', fileList[0] as RcFile);
		formData.append('name', values.name);
		formData.append('categoryId', JSON.stringify(values.categoryId ?? []));
		formData.append('order', String(values.order ?? 1));

		addSymptom.mutate(formData, {
			onSuccess: () => {
				message.success('Added Successfully..!');
				router.push('/admin/symptoms');
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

	const categoryOptions = categoryList
		? categoryList.map((cat) => ({
				value: cat.id,
				label: cat.category,
		  }))
		: [];

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid">
				<div className="flex justify-between items-center pr-4 pb-4">
					<h1 className="text-xl font-bold">Add New Symptom</h1>
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
					{!isCategoriesLoading && categoryList ? (
						<Form
							scrollToFirstError
							layout="vertical"
							name="create-symptom"
							className="w-full"
							initialValues={{order: 1}}
							onFinish={onFinish}
							autoComplete="off"
						>
							<div className="flex justify-between flex-wrap w-full">
								<Form.Item
									label="Symptom Name"
									name="name"
									className="w-[49%]"
									rules={[{required: true, message: 'Please enter symptom name'}]}
								>
									<Input placeholder="e.g. Chest pain" />
								</Form.Item>

								<Form.Item
									label="Mapped Specialities / Categories"
									className="w-[49%]"
									name="categoryId"
									rules={[{required: true, message: 'Please select category'}]}
								>
									<Select
										mode="multiple"
										style={{width: '100%'}}
										placeholder="Select clinical group(s)"
										options={categoryOptions}
										optionFilterProp="label"
										showSearch
									/>
								</Form.Item>

								<Form.Item
									label="Order"
									name="order"
									className="w-[49%]"
									tooltip="Determines display hierarchy of the symptom."
									rules={[{required: true, message: 'Please enter order index'}]}
								>
									<InputNumber min={1} style={{width: '100%'}} />
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
							<div className="flex pt-4">
								<Button
									loading={addSymptom.isLoading}
									style={{background: '#198754'}}
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
