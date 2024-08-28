import {Layout} from '@healthvisa/components';
import {useDeleteProduct, useProduct} from '@healthvisa/models/admin/products/useProduct';
import {Button, message, Modal, Skeleton, Space, Table} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import router from 'next/router';
import React from 'react';
import {useCategories} from '@healthvisa/models/admin/category/useCategories';
import {ExclamationCircleFilled} from '@ant-design/icons';
import moment from 'moment';
import {formatPrice} from '@healthvisa/utils';
import {CSVLink} from 'react-csv';

const {confirm} = Modal;
interface DataType {
	index: number;
	Id: string;
	Name: string;
	Type: string;
	Price: number;
	Image: string;
	DiscountPrice: number;
	CategoryName: string;
	CreatedOn: string;
}

export const ProductListPage = () => {
	const {isLoading, data: productList} = useProduct();
	const {data: categoryList} = useCategories();
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
	const productsArray: DataType[] =
		productList && productList?.length > 0
			? productList.map((product, index) => ({
					index: index + 1,
					Id: product.id,
					Name: product.name,
					CategoryName:
						categoryList && categoryList.length > 0
							? (categoryList?.find(
									(category) => category.id === product.categoryId,
							  )?.category as string)
							: 'N/A',
					Type: product?.type,
					Price: product?.price,
					DiscountPrice: product?.discountPrice,
					Image: product?.image.url,
					CreatedOn: moment(product.createdAt).format('DD MMM YYYY'),
			  }))
			: [];
	const columns: ColumnsType<DataType> = [
		{
			title: 'Sr. No.',
			dataIndex: 'index',
			key: 'index',
		},
		{
			title: 'Product/Service',
			dataIndex: 'Name',
			key: 'name',
		},
		{
			title: 'Category Name',
			dataIndex: 'CategoryName',
			key: 'categoryName',
		},
		{
			title: 'Type',
			dataIndex: 'Type',
			key: 'type',
		},
		{
			title: 'Price',
			dataIndex: 'Price',
			key: 'price',
			render: (price, record) => (
				<div>
					<span className="font-bold">{`₹${formatPrice(price)}`}</span>
					<span className="text-xs ml-1 line-through">
						{`₹${formatPrice(record.DiscountPrice)}`}
					</span>
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
						size="small"
						onClick={() => router.push(`/admin/products/${record.Id}`)}
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
				<h1 className="text-xl font-bold">Doctors</h1>
				<Button
					type="primary"
					className="self-end mb-2"
					onClick={() => router.push('/admin/products/create')}
				>
					Add New
				</Button>
				<Button type="primary" className="self-end mb-2 w-[90px]">
					<CSVLink data={productsArray} filename="ProductList" target="_blank">
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
