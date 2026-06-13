import {Layout} from '@healthvisa/components';
import {
	useDeleteNews,
	useGetNews,
	useSetNewsActive,
} from '@healthvisa/models/admin/news/useNews';
import {Button, message, Modal, Skeleton, Space, Switch, Table} from 'antd';
import {ThumbPreview} from '@healthvisa/components/ThumbPreview';
import {ColumnsType} from 'antd/lib/table';
import router from 'next/router';
import React from 'react';
import {ExclamationCircleFilled} from '@ant-design/icons';
import {CSVLink} from 'react-csv';
import {NEWS_S3_BASE} from './NewsFormPage';

const {confirm} = Modal;
interface DataType {
	index: number;
	Id: string;
	Title: string;
	Image: string;
	Author: string;
	Published: string;
	Active: boolean;
}

export const NewsListPage = () => {
	const {isLoading, data: news} = useGetNews();
	const deleteNews = useDeleteNews();
	const setActive = useSetNewsActive();

	const handleDelete = (id: string) => {
		deleteNews.mutate(
			{id},
			{
				onSuccess: () => {
					message.success('Deleted Successfully..!');
				},
				onError: (err: any) => {
					message.error(err?.errors?.error?.message ?? 'Failed to delete');
				},
			},
		);
	};

	const showModal = (id: string) => {
		confirm({
			title: 'Permanently delete this news item?',
			icon: <ExclamationCircleFilled />,
			content: 'This removes it from the database and cannot be undone.',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				handleDelete(id);
			},
		});
	};

	const toggleActive = (id: string, isActive: boolean) => {
		setActive.mutate(
			{id, isActive},
			{
				onSuccess: () => {
					message.success(
						isActive ? 'News is now active' : 'News hidden from app',
					);
				},
				onError: (err: any) => {
					message.error(err?.errors?.error?.message ?? 'Failed to update');
				},
			},
		);
	};

	const rows: DataType[] =
		news && news.length > 0
			? news.map((n, index) => ({
					index: index + 1,
					Id: n.id,
					Title: n.title,
					Image: n.mainImage ? `${NEWS_S3_BASE}${n.mainImage}` : '',
					Author: n.writtenBy || '—',
					Published: n.publishedDate
						? new Date(n.publishedDate).toLocaleDateString()
						: '—',
					Active: n.isActive ?? true,
			  }))
			: [];

	const columns: ColumnsType<DataType> = [
		{title: 'Sr. No.', dataIndex: 'index', key: 'index'},
		{
			title: 'Cover',
			dataIndex: 'Image',
			key: 'image',
			render: (url: string) =>
				url ? (
					<ThumbPreview src={url} />
				) : (
					<span className="text-xs text-gray-400">—</span>
				),
		},
		{title: 'Title', dataIndex: 'Title', key: 'title'},
		{title: 'Author', dataIndex: 'Author', key: 'author'},
		{title: 'Published', dataIndex: 'Published', key: 'published'},
		{
			title: 'Active',
			key: 'active',
			render: (text, record) => (
				<Switch
					checked={record.Active}
					loading={setActive.isLoading}
					onChange={(checked) => toggleActive(record.Id, checked)}
				/>
			),
		},
		{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<Space size="middle">
					<Button
						size="small"
						onClick={() => router.push(`/admin/news/${record.Id}`)}
						type="default"
						style={{color: '#1990FF', border: '1px solid #1990FF', padding: '0 10px'}}
						className="uppercase"
					>
						Edit
					</Button>
					<Button
						size="small"
						onClick={() => showModal(record.Id)}
						type="default"
						style={{color: 'red', border: '1px solid red', padding: '0 10px'}}
						className="uppercase"
					>
						Delete
					</Button>
				</Space>
			),
		},
	];

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid ">
				<div className="flex items-center justify-between gap-2 flex-wrap mb-3">
					<h1 className="text-xl font-bold">Health News</h1>
					<div className="flex items-center gap-2 flex-wrap">
						<Button type="primary" onClick={() => router.push('/admin/news/create')}>
							Add New
						</Button>
						<Button type="primary">
							<CSVLink data={rows} filename="HealthNews" target="_blank">
								Export
							</CSVLink>
						</Button>
					</div>
				</div>

				{isLoading ? (
					<Skeleton active />
				) : (
					<Table
						size="middle"
						rowKey={(obj) => obj.Id}
						pagination={{pageSize: 7, showSizeChanger: false}}
						columns={columns}
						dataSource={rows}
						style={{width: '100%', border: '2px solid #ECECEC'}}
					/>
				)}
			</div>
		</Layout>
	);
};
