import {ArrowLeftOutlined} from '@ant-design/icons';
import {Layout} from '@healthvisa/components';
import {
	useAddNews,
	useNewsById,
	useUpdateNews,
} from '@healthvisa/models/admin/news/useNews';
import {
	AutoComplete,
	Button,
	DatePicker,
	Form,
	Input,
	message,
	Skeleton,
	Switch,
} from 'antd';
import {useProduct} from '@healthvisa/models/admin/products/useProduct';
import {useCategories} from '@healthvisa/models/admin/category/useCategories';
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
	// Doctors are offered as suggestions for the author; any other name can be
	// typed freely (news isn't limited to doctors).
	const {data: doctors} = useProduct({
		staleTime: 5 * 60 * 1000, // names rarely change; don't refetch every visit
		refetchOnWindowFocus: false,
	});
	const {data: categories} = useCategories({
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
	});
	const authorOptions = React.useMemo(() => {
		// Without categories we can't tell doctors from venues — suggest nothing
		// (typing still works) rather than briefly listing gyms etc.
		if (!categories) return [];
		// Leave out gyms / yoga / zumba centres (categories tagged only "Health").
		const venueCategories = new Set(
			categories
				.filter((c) => c.tags?.length && c.tags.every((t) => t === 'Health'))
				.map((c) => c.id),
		);
		return [
			...new Set(
				(doctors ?? [])
					.filter((d) => !venueCategories.has(d.categoryId))
					.map((d) => d.name)
					.filter(Boolean),
			),
		]
			.sort()
			.map((name) => ({value: name}));
	}, [doctors, categories]);
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
		if (fileList.length === 0 && (!isEdit || existingImages.length === 0)) {
			message.error('Please add at least one image');
			return;
		}
		if (!isEdit && description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length < 80) {
			message.error('Please add at least 80 characters of article content');
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
			<div className="admin-card">
				<div className="flex justify-between items-center pr-4">
					<h1 className="admin-page-title">
						{isEdit ? 'Edit News' : 'Add News'}
					</h1>
					<Button onClick={() => router.back()} icon={<ArrowLeftOutlined />}>
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
								<AutoComplete
									options={authorOptions}
									placeholder="Type a name, or pick a doctor"
									filterOption={(input, option) =>
										String(option?.value ?? '')
											.toLowerCase()
											.includes(input.toLowerCase())
									}
								/>
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
								className="w-24 mr-3"
								type="primary"
								htmlType="submit"
							>
								{isEdit ? 'Save' : 'Add'}
							</Button>
							<Button onClick={() => router.back()}>
								Cancel
							</Button>
						</div>
					</Form>
				)}
			</div>
		</Layout>
	);
};
