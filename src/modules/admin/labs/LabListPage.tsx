import {Layout} from '@healthvisa/components';
import {
	useDeleteLab,
	useGetLabs,
} from '@healthvisa/models/admin/lab-appointments/useLab';
import {Button, message, Modal, Skeleton, Space, Table} from 'antd';
import {ThumbPreview} from '@healthvisa/components/ThumbPreview';
import {ColumnsType} from 'antd/lib/table';
import router from 'next/router';
import React from 'react';
import {ExclamationCircleFilled} from '@ant-design/icons';
import {CSVLink} from 'react-csv';
import {LAB_S3_BASE} from './CreateLabPage';

const {confirm} = Modal;
interface DataType {
	index: number;
	Id: string;
	Name: string;
	Image: string;
	ShortAddress: string;
	Certificate: string;
}

export const LabListPage = () => {
	const {isLoading, data: labs} = useGetLabs();
	const deleteLab = useDeleteLab();

	const handleDelete = (id: string) => {
		deleteLab.mutate(
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
			title: 'Are you sure you want to delete this lab?',
			icon: <ExclamationCircleFilled />,
			content: '',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				handleDelete(id);
			},
		});
	};

	const rows: DataType[] =
		labs && labs.length > 0
			? labs.map((l, index) => ({
					index: index + 1,
					Id: l.id,
					Name: l.name,
					Image: l.image ? `${LAB_S3_BASE}${l.image}` : '',
					ShortAddress: l.shortAddress || l.fullAddress || '',
					Certificate: l.certificate || '—',
			  }))
			: [];

	const columns: ColumnsType<DataType> = [
		{title: 'Sr. No.', dataIndex: 'index', key: 'index'},
		{
			title: 'Logo',
			dataIndex: 'Image',
			key: 'image',
			render: (url: string) =>
				url ? (
					<ThumbPreview src={url} />
				) : (
					<span className="text-xs text-gray-400">—</span>
				),
		},
		{title: 'Name', dataIndex: 'Name', key: 'name'},
		{title: 'Address', dataIndex: 'ShortAddress', key: 'shortAddress'},
		{title: 'Certificate', dataIndex: 'Certificate', key: 'certificate'},
		{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<Space size="middle">
					<Button
						size="small"
						onClick={() => router.push(`/admin/labs/${record.Id}`)}
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
					<h1 className="text-xl font-bold">Labs</h1>
					<div className="flex items-center gap-2 flex-wrap">
						<Button
							type="primary"
							onClick={() => router.push('/admin/labs/create')}
						>
							Add New
						</Button>
						<Button type="primary">
							<CSVLink data={rows} filename="Labs" target="_blank">
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
