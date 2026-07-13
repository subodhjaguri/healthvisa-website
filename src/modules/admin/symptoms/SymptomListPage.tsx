import {Layout} from '@healthvisa/components';
import {Button, message, Modal, Skeleton, Space, Table, Tag} from 'antd';
import {ThumbPreview} from '@healthvisa/components/ThumbPreview';
import {ColumnsType} from 'antd/lib/table';
import router from 'next/router';
import React, {useEffect, useState} from 'react';
import {
	useSymptoms,
	useDeleteSymptom,
} from '@healthvisa/models/admin/symptoms/useSymptoms';
import {useCategories} from '@healthvisa/models/admin/category/useCategories';
import {ExclamationCircleFilled} from '@ant-design/icons';
import moment from 'moment';
import {CSVLink} from 'react-csv';

const {confirm} = Modal;
const S3_UPLOADS_BASE = 'https://hv-documents.s3.ap-south-1.amazonaws.com/uploads/';

interface DataType {
	index: number;
	key: string;
	name: string;
	categoryId: string[];
	order?: number;
	image: string;
	createdOn: string;
}

export const SymptomListPage = () => {
	const {isLoading: isSymptomsLoading, data: symptomList} = useSymptoms();
	const {isLoading: isCategoriesLoading, data: categoryList} = useCategories();
	const deleteSymptom = useDeleteSymptom();
	const [key_, setKey_] = useState(1);

	useEffect(() => {
		setKey_(key_ + 1);
	}, [symptomList]);

	// Build a map of categoryId -> Category Name for display
	const categoryMap = React.useMemo(() => {
		const map: Record<string, string> = {};
		if (categoryList) {
			categoryList.forEach((cat) => {
				map[cat.id] = cat.category;
			});
		}
		return map;
	}, [categoryList]);

	const handleDelete = async (id: string) => {
		deleteSymptom.mutate(
			{id},
			{
				onSuccess: () => {
					message.success('Deleted Successfully..!');
				},
				onError: (err: any) => {
					console.log('err: ', err);
					message.error(err?.errors?.error?.message ?? 'Failed to delete');
				},
			},
		);
	};

	const symptomsArray: DataType[] =
		symptomList && symptomList?.length > 0
			? symptomList.map((symptom, index) => ({
					index: index + 1,
					key: symptom.id,
					name: symptom.name,
					categoryId: symptom.categoryId || [],
					order: symptom.order,
					image: symptom.image ? `${S3_UPLOADS_BASE}${symptom.image}` : '',
					createdOn: moment(symptom.createdAt).format('DD MMM YYYY'),
			  }))
			: [];

	const showModal = (id: string) => {
		confirm({
			title: 'Are you sure you want to delete this symptom?',
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

	const columns: ColumnsType<DataType> = [
		{
			title: 'Sr. No.',
			dataIndex: 'index',
			key: 'index',
			width: 80,
		},
		{
			title: 'Image',
			dataIndex: 'image',
			key: 'image',
			width: 120,
			render: (url: string) =>
				url ? (
					<ThumbPreview src={url} />
				) : (
					<span className="text-xs text-gray-400">—</span>
				),
		},
		{
			title: 'Symptom Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Mapped Specialities',
			dataIndex: 'categoryId',
			key: 'categoryId',
			render: (catIds: string[]) => {
				if (!catIds || catIds.length === 0) return <span className="text-xs text-gray-400">—</span>;
				return (
					<div className="flex flex-wrap gap-1">
						{catIds.map((id) => (
							<Tag color="blue" key={id}>
								{categoryMap[id] || id}
							</Tag>
						))}
					</div>
				);
			},
		},
		{
			title: 'Order',
			dataIndex: 'order',
			key: 'order',
			width: 100,
			render: (order?: number) => (order !== undefined ? order : '—'),
		},
		{
			title: 'Created On',
			dataIndex: 'createdOn',
			key: 'createdOn',
			width: 150,
		},
		{
			title: 'Action',
			key: 'action',
			width: 150,
			render: (_, record) => (
				<Space size="middle">
					<Button
						onClick={() => router.push(`/admin/symptoms/${record.key}`)}
						type="primary"
						style={{background: '#0d6efd'}}
					>
						Edit
					</Button>
					<Button
						onClick={() => showModal(record.key)}
						type="primary"
						danger
					>
						Delete
					</Button>
				</Space>
			),
		},
	];

	// For exporting CSV
	const headers = [
		{label: 'Sr. No.', key: 'index'},
		{label: 'Symptom Name', key: 'name'},
		{label: 'Mapped Category IDs', key: 'categoryIdString'},
		{label: 'Order', key: 'order'},
		{label: 'Created On', key: 'createdOn'},
	];

	const csvData = symptomsArray.map((s) => ({
		index: s.index,
		name: s.name,
		categoryIdString: s.categoryId.join('; '),
		order: s.order,
		createdOn: s.createdOn,
	}));

	const isLoading = isSymptomsLoading || isCategoriesLoading;

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid h-[85vh]">
				<div className="flex justify-between items-center pb-5">
					<h1 className="text-xl font-bold">Symptoms Management</h1>
					<div className="flex gap-2">
						{csvData.length > 0 && (
							<CSVLink
								headers={headers}
								data={csvData}
								filename={`symptoms-${moment().format('YYYY-MM-DD')}.csv`}
							>
								<Button style={{borderColor: '#198754', color: '#19875 green'}} type="ghost">
									Export CSV
								</Button>
							</CSVLink>
						)}
						<Button
							onClick={() => router.push('/admin/symptoms/create')}
							style={{background: '#198754'}}
							type="primary"
						>
							Add Symptom
						</Button>
					</div>
				</div>
				<div className="flex-1 overflow-auto">
					{!isLoading ? (
						<Table
							key={key_}
							pagination={{pageSize: 10}}
							columns={columns}
							dataSource={symptomsArray}
						/>
					) : (
						<>
							<Skeleton active />
							<Skeleton active />
							<Skeleton active />
						</>
					)}
				</div>
			</div>
		</Layout>
	);
};
