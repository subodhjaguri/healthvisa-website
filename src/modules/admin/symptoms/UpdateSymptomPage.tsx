import {Layout} from '@healthvisa/components';
import {
	useSymptomById,
	useUpdateSymptom,
	useUpdateSymptomWithoutImage,
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
import React, {useEffect, useState} from 'react';

const S3_UPLOADS_BASE = 'https://hv-documents.s3.ap-south-1.amazonaws.com/uploads/';

export const UpdateSymptomPage = ({id}: {id: string}) => {
	const router = useRouter();
	const {data: symptom, isLoading: isSymptomLoading} = useSymptomById({id});
	const {data: categoryList, isLoading: isCategoriesLoading} = useCategories();
	const updateSymptom = useUpdateSymptom();
	const updateSymptomWithoutImage = useUpdateSymptomWithoutImage();

	const [form] = Form.useForm();
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [newFile, setNewFile] = useState<RcFile | null>(null);

	useEffect(() => {
		if (!symptom) return;
		form.setFieldsValue({
			name: symptom.name,
			categoryId: symptom.categoryId ?? [],
			order: symptom.order ?? 1,
		});
		if (symptom.image) {
			setFileList([
				{
					uid: '-1',
					name: symptom.image.split('/').pop() || 'symptom.png',
					status: 'done',
					url: `${S3_UPLOADS_BASE}${symptom.image}`,
				},
			]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [symptom]);

	const appendFields = (formData: FormData, values: any) => {
		formData.append('id', id);
		formData.append('name', values.name);
		formData.append('categoryId', JSON.stringify(values.categoryId ?? []));
		formData.append('order', String(values.order ?? 1));
	};

	const onFinish = (values: any) => {
		const onSuccess = () => {
			message.success('Updated Successfully..!');
			router.push('/admin/symptoms');
		};
		const onError = (errors: any) => {
			message.error(errors?.errors?.data?.message ?? 'Failed to update');
		};

		if (newFile) {
			const formData = new FormData();
			formData.append('', newFile);
			appendFields(formData, values);
			updateSymptom.mutate({id, data: formData}, {onSuccess, onError});
		} else {
			const formData = new FormData();
			appendFields(formData, values);
			updateSymptomWithoutImage.mutate({data: formData}, {onSuccess, onError});
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

	const categoryOptions = categoryList
		? categoryList.map((cat) => ({
				value: cat.id,
				label: cat.category,
		  }))
		: [];

	const isLoading = isSymptomLoading || isCategoriesLoading;

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid">
				<div className="flex justify-between items-center pr-4 pb-4">
					<h1 className="text-xl font-bold">Update Symptom</h1>
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
					{isLoading || !symptom ? (
						<Skeleton active />
					) : (
						<Form
							form={form}
							scrollToFirstError
							layout="vertical"
							name="update-symptom"
							className="w-full"
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
									loading={updateSymptom.isLoading || updateSymptomWithoutImage.isLoading}
									style={{background: '#198754'}}
									className="w-24 mr-3"
									type="primary"
									htmlType="submit"
								>
									Save
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
					)}
				</div>
			</div>
		</Layout>
	);
};
