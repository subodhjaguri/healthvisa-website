import {Layout} from '@healthvisa/components';
import {useDeleteProduct} from '@healthvisa/models/admin/products/useProduct';
import {Button, message, Modal, Skeleton, Space, Table} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import React from 'react';
import {ExclamationCircleFilled} from '@ant-design/icons';
import moment from 'moment';
import {CSVLink} from 'react-csv';
import {useDiagnosticItems} from '@healthvisa/models/admin/lab-appointments/useLab';

const {confirm} = Modal;
interface DataType {
	index: number;
	Id: string;
	Name: string;
	Discount: string;
	Availability: string;
	CreatedOn: string;
	Labs: string[];
}

export const DiagnosticListPage = () => {
	const {isLoading, data: diagnosticItems} = useDiagnosticItems();
	const deleteProduct = useDeleteProduct();

	const handleDelete = async (id: string) => {
		deleteProduct.mutate(
			{id},
			{
				onSuccess: (response) => {
					message.success('Deleted Successfully..!');
				},
				onError: (err: any) => {
					message.error(err?.errors.error.message);
				},
			},
		);
	};
	const showModal = (id: string) => {
		confirm({
			title: 'Are you sure you want to delete this user?',
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
	const Labs: any = {
		'655226191e32a308b449dbda': 'The Lab Plus, Diagnostic and Healthcare',
		'655226941e32a308b449dbdb': 'NIDAN EXCELLENCE DIAGNOSTICS',
		'65f9102bc418d083faeda140': 'B Healthcare',
	};

	const productsArray: DataType[] =
		diagnosticItems && diagnosticItems?.length > 0
			? diagnosticItems.map((product, index) => ({
					index: index + 1,
					Id: product.id,
					Name: product.name,
					CreatedOn: moment(product.createdAt).format('DD MMM YYYY'),
					Discount: `${product.discount} %`,
					Availability:
						product.metadata.availability || product.metadata.availability2,
					Visits: product.availableVisits,
					Labs: product.labs,
			  }))
			: [];
	const columns: ColumnsType<DataType> = [
		{
			title: 'Sr. No.',
			dataIndex: 'index',
			key: 'index',
		},
		{
			title: 'Name',
			dataIndex: 'Name',
			key: 'name',
		},
		{
			title: 'Lab',
			dataIndex: 'Labs',
			key: 'labs',
			render: (record) => (
				<div>
					{record.map((lab: string) => (
						<div className="capitalize">{Labs[lab]}</div>
					))}
				</div>
			),
		},
		{
			title: 'Availability',
			dataIndex: 'Availability',
			key: 'availability',
		},
		{
			title: 'Discount',
			dataIndex: 'Discount',
			key: 'discount',
		},

		{
			title: 'Visits',
			dataIndex: 'Visits',
			key: 'visits',
			render: (record) => (
				<div>
					{record.map((visit: string) => (
						<div className="capitalize">{visit} Visit</div>
					))}
				</div>
			),
		},
		{
			title: 'Created On',
			dataIndex: 'CreatedOn',
			key: 'createdOn',
		},
		{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<Space size="middle">
					<Button
						disabled
						size="small"
						// onClick={() => router.push(`/admin/products/${record.Id}`)}
						type="default"
						style={{
							color: '#1990FF',
							border: '1px solid #1990FF',
							padding: '0 10px',
						}}
						className="uppercase"
					>
						Edit
					</Button>
					<Button
						disabled
						size="small"
						onClick={() => showModal(record.Id)}
						type="default"
						style={{
							color: 'red',
							border: '1px solid red',
							padding: '0 10px',
						}}
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
				<h1 className="text-xl font-bold">Diagnostics</h1>
				<Button
					disabled
					type="primary"
					className="self-end mb-2"
					// onClick={() => router.push('/admin/products/create')}
				>
					Add New
				</Button>
				<Button type="primary" className="self-end mb-2 w-[90px]">
					<CSVLink data={productsArray} filename="Diagnostics" target="_blank">
						Export
					</CSVLink>
				</Button>

				{isLoading ? (
					<Skeleton active />
				) : (
					<Table
						size="middle"
						rowKey={(obj) => obj.Id}
						pagination={{
							pageSize: 7,
							showSizeChanger: false,
						}}
						columns={columns}
						dataSource={productsArray}
						style={{width: '100%', border: '2px solid #ECECEC'}}
					/>
				)}
			</div>
		</Layout>
	);
};
