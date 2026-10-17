import {Layout} from '@healthvisa/components';
import {
	useDeleteDiagnostic,
	useDiagnosticItems,
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
import moment from 'moment';
import {CSVLink} from 'react-csv';
import {S3_UPLOADS_BASE} from './CreateDiagnosticPage';

const {confirm} = Modal;
interface DataType {
	index: number;
	Id: string;
	Name: string;
	Image: string;
	Discount: string;
	Visits: string[];
	Labs: string[];
	CreatedOn: string;
}

export const DiagnosticListPage = () => {
	const {isLoading, data: diagnosticItems} = useDiagnosticItems();
	const {data: labs} = useGetLabs();
	const deleteDiagnostic = useDeleteDiagnostic();

	const labMap: Record<string, string> = {};
	(labs ?? []).forEach((l) => {
		labMap[l.id] = l.name;
	});

	const handleDelete = (id: string) => {
		deleteDiagnostic.mutate(
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
			title: 'Are you sure you want to delete this diagnostic?',
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

	const productsArray: DataType[] =
		diagnosticItems && diagnosticItems.length > 0
			? diagnosticItems.map((d, index) => ({
					index: index + 1,
					Id: d.id,
					Name: d.name,
					Image: d.image ? `${S3_UPLOADS_BASE}${d.image}` : '',
					Discount: `${d.discount} %`,
					Visits: d.availableVisits ?? [],
					Labs: d.labs ?? [],
					CreatedOn: moment(d.createdAt).format('DD MMM YYYY'),
			  }))
			: [];

	const [search, setSearch] = useState('');
	// What the table shows is also what Export downloads.
	const visibleDiagnostics = productsArray.filter((r) =>
		matchesSearch(search, [r.Name]),
	);

	const columns: ColumnsType<DataType> = [
		{title: 'Sr. No.', dataIndex: 'index', key: 'index'},
		{
			title: 'Image',
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
		{
			title: 'Labs',
			dataIndex: 'Labs',
			key: 'labs',
			render: (ids: string[]) => (
				<div>
					{(ids ?? []).map((labId) => (
						<div key={labId} className="capitalize">
							{labMap[labId] ?? labId}
						</div>
					))}
				</div>
			),
		},
		{title: 'Discount', dataIndex: 'Discount', key: 'discount'},
		{
			title: 'Visits',
			dataIndex: 'Visits',
			key: 'visits',
			render: (visits: string[]) => (
				<div>
					{(visits ?? []).map((v) => (
						<div key={v} className="capitalize">
							{v} Visit
						</div>
					))}
				</div>
			),
		},
		{title: 'Created On', dataIndex: 'CreatedOn', key: 'createdOn'},
		{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<Space size="middle">
					<Button
						size="small"
						onClick={() => router.push(`/admin/diagnostics/${record.Id}`)}
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
			<div className="admin-card">
				<div className="flex items-center justify-between gap-2 flex-wrap mb-3">
					<h1 className="admin-page-title">Diagnostics</h1>
					<div className="flex items-center gap-2 flex-wrap">
						<Button
							type="primary"
							onClick={() => router.push('/admin/diagnostics/create')}
						>
							Add New
						</Button>
						<Button type="primary">
							<CSVLink data={visibleDiagnostics} filename="Diagnostics" target="_blank">
								Export
							</CSVLink>
						</Button>
					</div>
				</div>

				<div className="my-2">
					<TableSearch placeholder="Search diagnostic name" onSearch={setSearch} />
				</div>
				{isLoading ? (
					<Skeleton active />
				) : (
					<Table
						size="middle"
						rowKey={(obj) => obj.Id}
						pagination={{pageSize: 7, showSizeChanger: false}}
						columns={columns}
						dataSource={visibleDiagnostics}
						style={{width: '100%'}}
					/>
				)}
			</div>
		</Layout>
	);
};
