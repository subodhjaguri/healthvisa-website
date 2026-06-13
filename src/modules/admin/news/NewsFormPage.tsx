import {Layout} from '@healthvisa/components';
import {
	useAddNews,
	useNewsById,
	useUpdateNews,
} from '@healthvisa/models/admin/news/useNews';
import {Button, DatePicker, Form, Input, message, Skeleton, Switch} from 'antd';
import {RcFile, UploadProps} from 'antd/es/upload';
import Dragger from 'antd/lib/upload/Dragger';
import {UploadFile} from 'antd/lib/upload/interface';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import moment from 'moment';

// react-quill touches `document`, so it must load client-side only.
const ReactQuill = dynamic(() => import('react-quill'), {
	ssr: false,
	loading: () => <p>Loading editor…</p>,
}) as any;

// News images are stored as raw S3 keys (relative to uploads/); build the
// preview URL from this base. Matches the app's `awsServerUrl`.
export const NEWS_S3_BASE =
	'https://hv-documents.s3.ap-south-1.amazonaws.com/uploads/';

// Keep the toolbar to tags react-native-render-html renders cleanly.
const quillModules = {
	toolbar: [
		[{header: [1, 2, 3, false]}],
		['bold', 'italic', 'underline'],
		[{list: 'ordered'}, {list: 'bullet'}],
		['link'],
		['clean'],
	],
};

const EMPTY_HTML = '<p><br></p>';

export const NewsFormPage = ({id}: {id?: string}) => {
	const router = useRouter();
	const isEdit = !!id;

	const [form] = Form.useForm();
	const [description, setDescription] = useState('');
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [existingImages, setExistingImages] = useState<string[]>([]);

	const {data: news, isLoading: loadingNews} = useNewsById(id ?? '', {
		enabled: isEdit,
	});

	const addNews = useAddNews();
	const updateNews = useUpdateNews();
	const saving = addNews.isLoading || updateNews.isLoading;

	useEffect(() => {
		if (isEdit && news) {
			form.setFieldsValue({
				title: news.title,
				writtenBy: news.writtenBy,
				publishedDate: news.publishedDate
					? moment(news.publishedDate)
					: moment(),
				isActive: news.isActive ?? true,
			});
			setDescription(news.description || '');
			setExistingImages(news.images || []);
		}
	}, [isEdit, news, form]);

	const uploadProps: UploadProps = {
		multiple: true,
		onRemove: (file) =>
			setFileList((prev) => prev.filter((f) => f.uid !== file.uid)),
		beforeUpload: (file) => {
			setFileList((prev) => [...prev, file]);
			return false;
		},
		fileList,
		listType: 'picture',
	};

	const onFinish = (values: any) => {
		if (!description || description === EMPTY_HTML) {
			message.error('Please write the news content');
			return;
		}
		if (!isEdit && fileList.length === 0) {
			message.error('Please add at least one image');
			return;
		}

		const fd = new FormData();
		if (id) fd.append('id', id);
		fd.append('title', values.title);
		fd.append('writtenBy', values.writtenBy);
		fd.append('description', description);
		fd.append(
			'publishedDate',
			values.publishedDate
				? values.publishedDate.toISOString()
				: new Date().toISOString(),
		);
		fd.append('isActive', String(values.isActive ?? true));
		// New files replace ALL existing images (backend behavior).
		fileList.forEach((f) => fd.append('', f as unknown as RcFile));

		const mutation = isEdit ? updateNews : addNews;
		mutation.mutate(fd, {
			onSuccess: () => {
				message.success(isEdit ? 'Updated Successfully..!' : 'Added Successfully..!');
				router.push('/admin/news');
			},
			onError: (errors: any) => {
				message.error(errors?.errors?.data?.message ?? 'Failed to save');
			},
		});
	};

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid">
				<div className="flex justify-between items-center pr-4">
					<h1 className="text-xl font-bold">
						{isEdit ? 'Edit News' : 'Add News'}
					</h1>
					<Button
						onClick={() => router.back()}
						style={{background: '#F8F9FA', color: 'black'}}
						className="w-24"
						type="primary"
					>
						Back
					</Button>
				</div>

				{isEdit && loadingNews ? (
					<Skeleton active />
				) : (
					<Form
						form={form}
						scrollToFirstError
						layout="vertical"
						name="news-form"
						className="w-full"
						onFinish={onFinish}
						autoComplete="off"
						initialValues={{isActive: true, publishedDate: moment()}}
					>
						<div className="flex justify-between flex-wrap w-full">
							<Form.Item
								label="Title"
								name="title"
								className="w-[49%]"
								rules={[{required: true, message: 'Please enter a title'}]}
							>
								<Input placeholder="e.g. Free Health Checkup Camp This Sunday" />
							</Form.Item>
							<Form.Item
								label="Author (written by)"
								name="writtenBy"
								className="w-[49%]"
								rules={[{required: true, message: 'Please enter the author'}]}
							>
								<Input placeholder="e.g. Dr. Meera Sharma" />
							</Form.Item>
							<Form.Item
								label="Published date"
								name="publishedDate"
								className="w-[49%]"
							>
								<DatePicker className="w-full" format="DD MMM YYYY" />
							</Form.Item>
							<Form.Item
								label="Active (visible in app)"
								name="isActive"
								className="w-[49%]"
								valuePropName="checked"
							>
								<Switch />
							</Form.Item>
						</div>

						<Form.Item label="Content" required className="w-full">
							<ReactQuill
								theme="snow"
								value={description}
								onChange={setDescription}
								modules={quillModules}
								style={{background: 'white'}}
							/>
						</Form.Item>

						<Form.Item
							label={
								isEdit
									? 'Images (uploading new ones replaces all existing)'
									: 'Images (first one is the cover)'
							}
							className="w-full"
						>
							{/* eslint-disable-next-line react/jsx-props-no-spreading */}
							<Dragger {...uploadProps}>
								<span>
									Drop files here or <span className="font-bold">Browse</span>
								</span>
							</Dragger>
						</Form.Item>

						{isEdit && existingImages.length > 0 && (
							<div className="mb-4">
								<p className="font-semibold mb-2">Current images</p>
								<div className="flex flex-wrap gap-2">
									{existingImages.map((img) => (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											key={img}
											src={`${NEWS_S3_BASE}${img}`}
											alt=""
											className="h-20 w-20 object-cover rounded border border-[#eee]"
										/>
									))}
								</div>
							</div>
						)}

						<div className="flex">
							<Button
								loading={saving}
								style={{background: '#198753'}}
								className="w-24 mr-3"
								type="primary"
								htmlType="submit"
							>
								{isEdit ? 'Save' : 'Add'}
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
		</Layout>
	);
};
