import {Layout} from '@healthvisa/components';
import {useDeleteProduct, useProduct} from '@healthvisa/models/admin/products/useProduct';
import {Button, Input, message, Modal, Skeleton, Space, Table} from 'antd';
import {ThumbPreview} from '@healthvisa/components/ThumbPreview';
import {ColumnsType} from 'antd/lib/table';
import router from 'next/router';
import React, {useState} from 'react';
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
	const [search, setSearch] = useState('');

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
			title: 'Are you sure you want to delete this product?',
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
				<div className="flex items-center justify-between gap-2 flex-wrap mb-3">
					<h1 className="text-xl font-bold">Doctors</h1>
					<div className="flex items-center gap-2">
						<Input
							allowClear
							placeholder="Search doctor / category"
							style={{width: 220}}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<Button
							type="primary"
							onClick={() => router.push('/admin/products/create')}
						>
							Add New
						</Button>
						<Button type="primary">
							<CSVLink data={productsArray} filename="ProductList" target="_blank">
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
						pagination={{
							pageSize: 7,
							showSizeChanger: false,
						}}
						columns={columns}
						dataSource={productsArray.filter((p) =>
							`${p.Name} ${p.CategoryName}`
								.toLowerCase()
								.includes(search.toLowerCase()),
						)}
						style={{width: '100%', border: '2px solid #ECECEC'}}
					/>
				)}
			</div>
		</Layout>
	);
};
