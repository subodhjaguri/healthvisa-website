import {Layout} from '@healthvisa/components';
import {Button, message, Modal, Skeleton, Space, Table} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import router from 'next/router';
import React, {useEffect, useState} from 'react';
import {
	useCategories,
	useDeleteCategory,
} from '@healthvisa/models/admin/category/useCategories';
import {ExclamationCircleFilled} from '@ant-design/icons';
import moment from 'moment';
import {CSVLink} from 'react-csv';

const {confirm} = Modal;
interface DataType {
	index: number;
	key: string;
	category: string;
	description: string;
	tags: unknown;
	image: string;
	createdOn: string;
}

export const WellnessServicesListPage = () => {
	const {isLoading, data: categoryList} = useCategories();
	const deleteCategory = useDeleteCategory();
	const [key_, setKey_] = useState(1);
	useEffect(() => {
		setKey_(key_ + 1);
	}, [categoryList]);

	const handleDelete = async (id: string) => {
		deleteCategory.mutate(
			{id},
			{
				onSuccess: (response) => {
					message.success('Deleted Successfully..!');
				},
				onError: (err: any) => {
					console.log('err: ', err);
					message.error(err?.errors.error.message);
				},
			},
		);
	};

	const productsArray: DataType[] =
		categoryList && categoryList?.length > 0
			? categoryList.map((category, index) => ({
					index: index + 1,
					key: category.id,
					category: category.category,
					description: category?.description,
					tags: category?.tags[0],
					image: category.image.url,
					createdOn: moment(category.createdAt).format('DD MMM YYYY'),
			  }))
			: [];

	const showModal = (id: string) => {
		confirm({
			title: 'Are you sure you want to delete this category?',
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
		},
		{
			title: 'Category Name',
			dataIndex: 'category',
			key: 'category',
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
		},

		{
			title: 'Tags',
			dataIndex: 'tags',
			key: 'tags',
		},
		{
			title: 'Created On',
			dataIndex: 'createdOn',
			key: 'createdOn',
		},
		// {
		// 	title: 'Image',
		// 	dataIndex: 'image',
		// 	key: 'image',
		// 	// render: (text) => (
		// 	// 	// <a target="_blank" href={text} rel="noreferrer">
		// 	// 	// 	View Image
		// 	// 	// </a>
		// 	// 	<Image
		// 	// 		width={50}
		// 	// 		src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
		// 	// 	/>
		// 	// ),
		// },

		{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<Space size="middle">
					<Button
						size="small"
						onClick={() => router.push(`/admin/categories/${record.key}`)}
						type="default"
						style={{
							color: '#1990FF',
							border: '1px solid #1990FF',
							padding: '0 10px',
						}}
						className="uppercase">
						Edit
					</Button>

					<Button
						size="small"
						onClick={() => showModal(record.key)}
						type="default"
						style={{
							color: 'red',
							border: '1px solid red',
							padding: '0 10px',
						}}
						className="uppercase">
						Delete
					</Button>
				</Space>
			),
		},
	];

	return (
		<Layout>
			<div
				className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid"
				key={key_}>
				<h2 className="text-xl font-bold">Wellness Services</h2>

				<Button
					type="primary"
					className="self-end mb-2"
					onClick={() => router.push('/admin/categories/create')}>
					Add New
				</Button>
				<Button type="primary" className="self-end mb-2 w-[90px]">
					<CSVLink data={productsArray} filename="CategoryList" target="_blank">
						Export
					</CSVLink>
				</Button>

				{isLoading ? (
					<Skeleton active />
				) : (
					<Table
						size="middle"
						rowKey={(obj) => obj.key}
						pagination={{pageSize: 7, showSizeChanger: false}}
						columns={columns}
						dataSource={productsArray}
						style={{width: '100%', border: '2px solid #ECECEC'}}
					/>
				)}
			</div>
		</Layout>
	);
};
