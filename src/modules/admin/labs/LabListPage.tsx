import {Layout} from '@healthvisa/components';
import {
	useDeleteLab,
	useGetLabs,
} from '@healthvisa/models/admin/lab-appointments/useLab';
import {Button, message, Modal, Skeleton, Space, Table} from 'antd';
import {ThumbPreview} from '@healthvisa/components/ThumbPreview';
import {ColumnsType} from 'antd/lib/table';
import router from 'next/router';
import React, {useState} from 'react';
import {TableSearch} from '@healthvisa/components/TableSearch';
import {matchesSearch} from '@healthvisa/utils/tableFilter';
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

	const [search, setSearch] = useState('');
	// What the table shows is also what Export downloads.
	const visibleRows = rows.filter((r) =>
		matchesSearch(search, [r.Name, r.ShortAddress, r.Certificate]),
	);

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
						className="hf-action hf-action--edit"
					>
						Edit
					</Button>
					<Button
						size="small"
						onClick={() => showModal(record.Id)}
						className="hf-action hf-action--delete"
					>
						Delete
					</Button>
				</Space>
			),
		},
	];

	return (
		<Layout>
			<div className="admin-card">
				<div className="flex items-center justify-between gap-2 flex-wrap mb-3">
					<h1 className="admin-page-title">Labs</h1>
					<div className="flex items-center gap-2 flex-wrap">
						<Button
							type="primary"
							onClick={() => router.push('/admin/labs/create')}
						>
							Add New
						</Button>
						<Button type="primary">
							<CSVLink data={visibleRows} filename="Labs" target="_blank">
								Export
							</CSVLink>
						</Button>
					</div>
				</div>

				<div className="my-2">
					<TableSearch placeholder="Search name, address or certificate" onSearch={setSearch} />
				</div>
				{isLoading ? (
					<Skeleton active />
				) : (
					<Table
						size="middle"
						rowKey={(obj) => obj.Id}
						pagination={{pageSize: 7, showSizeChanger: false}}
						columns={columns}
						dataSource={visibleRows}
						style={{width: '100%'}}
					/>
				)}
			</div>
		</Layout>
	);
};
