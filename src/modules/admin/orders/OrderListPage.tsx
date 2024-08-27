import {Layout} from '@healthvisa/components';

import {Button, message, Select, Skeleton, Table, Tag} from 'antd';
import {ColumnsType} from 'antd/lib/table';

import React from 'react';
import {useUser} from '@healthvisa/models/admin/users/useUser';

import moment from 'moment';

import {formatPrice} from '@healthvisa/utils';
import {useGetOrders, useUpdateOrder} from '@healthvisa/models/admin/orders/useOrder';
import {CSVLink} from 'react-csv';
import {OrderUpdateRequestParams} from '@healthvisa/models/admin/orders/Order';

const {Option} = Select;
interface DataType {
	Mobile: string;
	User: string;
	Status: string;
	CreatedOn: string;
	Payment: string;
	Order_Id: number;
	Amount: string;
	doctor: string;
	discount: string;
	id: string;
	// description: string;
}

export const OrderListPage = () => {
	const {data} = useGetOrders();
	const {isLoading, data: userList} = useUser();
	const orderArray: DataType[] =
		data && data?.length > 0
			? data.map((order) => ({
					Order_Id: order.uniqueOrderIdentifier,
					User: userList?.find((user) => user.id === order.userId)?.name ?? '',
					Mobile:
						userList?.find((user) => user.id === order.userId)
							?.mobileNumber ?? '',
					Amount: `₹${formatPrice(order.finalAmount)}`,
					Status: order.status,
					Payment: order.paymentMode,
					CreatedOn: moment(order.orderDate).format('DD MMM YYYY'),
					doctor: order.items[0].name,
					discount: `₹${formatPrice(order.discount)}`,
					id: order.id,
					appointment: order.items[0].metadata.bookings[0],

					// description: generateDescription(order),
			  }))
			: [];

	const updateOrder = useUpdateOrder();

	const UpdateStatus = async (id: string, status: string) => {
		const body: OrderUpdateRequestParams = {
			id,
			status,
		};
		updateOrder.mutate(body, {
			onSuccess: (res) => {
				message.success('Order Updated Successfully');
			},
			onError: (errors: any) => {
				message.error(errors?.errors.data.message);
			},
		});
	};

	const columns: ColumnsType<DataType> = [
		{
			title: 'Order ID',
			dataIndex: 'Order_Id',
			key: 'index',
			render: (_, {Order_Id: orderId}) => (
				<span className="font-semibold">{orderId}</span>
			),
		},
		{
			title: 'User',
			dataIndex: 'User',
			key: 'user',
		},

		{
			title: 'Mobile',
			dataIndex: 'Mobile',
			key: 'mobile',
		},
		{
			title: 'Doctor',
			dataIndex: 'doctor',
			key: 'doctor',
		},
		{
			title: 'Amount',
			dataIndex: 'Amount',
			key: 'amount',
			render: (amount) => <span className="font-bold">{amount}</span>,
		},
		{
			title: 'Discount',
			dataIndex: 'discount',
			key: 'discount',
			render: (discount) => <span className="font-bold">{discount}</span>,
		},
		{
			title: 'Appointment Details',
			dataIndex: 'appointment',
			key: 'appointment',
			render: (appointment) => (
				<div className="font-bold">
					<div>{moment(appointment.date).format('DD MMM YYYY')}</div>
					<div>{appointment.slot}</div>
				</div>
			),
		},

		{
			title: 'Payment',
			key: 'payment',
			dataIndex: 'Payment',
			render: (_, {Payment}) => {
				const color = Payment === 'other' ? 'volcano' : 'green';

				return <Tag color={color}>{Payment}</Tag>;
			},
		},
		{
			title: 'Booked On',
			dataIndex: 'CreatedOn',
			key: 'createdOn',
		},
		{
			title: 'Status',
			key: 'status',
			dataIndex: 'Status',
			// eslint-disable-next-line camelcase
			render: (_, {Status, id}) => {
				const color = Status === 'other' ? 'volcano' : 'blue';

				// return <Tag color={color}>{Status}</Tag>;
				return (
					<Select
						bordered={false}
						defaultValue={Status}
						// value={Status}
						onChange={(value) => UpdateStatus(id, value)}
						style={{width: 180}}
					>
						<Option value="placed">
							<Tag color="blue">Placed</Tag>
						</Option>
						<Option value="appointment booked">
							<Tag color="cyan">Appointment Booked</Tag>
						</Option>
						<Option value="rejected">
							<Tag color="red">Rejected</Tag>
						</Option>
						<Option value="completed">
							<Tag color="green">Completed</Tag>
						</Option>
					</Select>
				);
			},
		},
	];

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid ">
				<h2 className="text-xl font-bold">Doctor Appointments</h2>
				<Button type="primary" className="self-end mb-2 w-[90px]">
					<CSVLink data={orderArray} filename="OrderList" target="_blank">
						Export
					</CSVLink>
				</Button>
				{isLoading ? (
					<Skeleton active />
				) : (
					<Table
						size="middle"
						rowKey={(obj) => obj.Order_Id}
						pagination={{pageSize: 7, showSizeChanger: false}}
						columns={columns}
						dataSource={orderArray}
						style={{width: '100%', border: '2px solid #ECECEC'}}
					/>
				)}
			</div>
		</Layout>
	);
};
