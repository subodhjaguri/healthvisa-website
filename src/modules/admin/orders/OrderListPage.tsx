import {Layout} from '@healthvisa/components';

import {
	Button,
	DatePicker,
	Input,
	message,
	Modal,
	Select,
	Skeleton,
	Table,
	Tag,
	Tooltip,
} from 'antd';
import {InfoCircleOutlined} from '@ant-design/icons';
import {ColumnsType} from 'antd/lib/table';

import React, {useState} from 'react';
import {useUser} from '@healthvisa/models/admin/users/useUser';

import moment from 'moment';

import {formatPrice} from '@healthvisa/utils';
import {useGetOrders, useUpdateOrder} from '@healthvisa/models/admin/orders/useOrder';
import {CSVLink} from 'react-csv';
import {OrderUpdateRequestParams} from '@healthvisa/models/admin/orders/Order';
import {TableSearch} from '@healthvisa/components/TableSearch';
import {DateRange, inDateRange, isDayPast, matchesSearch, optionsOf} from '@healthvisa/utils/tableFilter';
import {APPOINTMENT_STATUS_OPTIONS} from '@healthvisa/utils/appointmentStatus';

const {Option} = Select;
const {TextArea} = Input;
const {RangePicker} = DatePicker;

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
	appointment?: any;
	metadata?: any;
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
					metadata: order.metadata,

					// description: generateDescription(order),
			  }))
			: [];

	const updateOrder = useUpdateOrder();

	const [search, setSearch] = useState('');
	const [appointmentRange, setAppointmentRange] = useState<DateRange>(null);
	const [bookedRange, setBookedRange] = useState<DateRange>(null);
	const [doctor, setDoctor] = useState<string>();
	const [statusFilter, setStatusFilter] = useState<string>();
	const [payment, setPayment] = useState<string>();
	// What the table shows is also what Export downloads.
	const visibleOrders = orderArray.filter(
		(o) =>
			matchesSearch(search, [o.Order_Id, o.User, o.Mobile, o.doctor]) &&
			inDateRange(o.appointment?.date, appointmentRange) &&
			inDateRange(o.CreatedOn, bookedRange) &&
			(!doctor || o.doctor === doctor) &&
			(!statusFilter || o.Status === statusFilter) &&
			(!payment || o.Payment === payment),
	);

	const [cancelModal, setCancelModal] = useState(false);
	const [cancelReason, setCancelReason] = useState('');
	const [cancelRow, setCancelRow] = useState<DataType | null>(null);

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

	// Cancelling needs a reason, so it routes through a modal instead of the
	// inline status Select. The reason + who/when is written to metadata.
	const openCancel = (record: DataType) => {
		if (isDayPast(record.appointment?.date)) {
			message.warning('Cannot cancel a past appointment.');
			return;
		}
		setCancelRow(record);
		setCancelReason(record.metadata?.cancellation?.reason ?? '');
		setCancelModal(true);
	};

	const submitCancel = () => {
		if (!cancelRow) {
			return;
		}
		if (!cancelReason.trim()) {
			message.warning('Please add a reason for cancelling.');
			return;
		}
		const body: OrderUpdateRequestParams = {
			id: cancelRow.id,
			status: 'cancelled',
			metadata: {
				...(cancelRow.metadata ?? {}),
				cancellation: {
					reason: cancelReason.trim(),
					by: 'admin',
					at: new Date().toISOString(),
				},
			},
		};
		updateOrder.mutate(body, {
			onSuccess: () => {
				message.success('Appointment cancelled');
				setCancelModal(false);
			},
			onError: (errors: any) => {
				message.error(errors?.errors?.data?.message ?? 'Failed to cancel');
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
			title: 'Cancellation',
			key: 'cancellation',
			dataIndex: 'metadata',
			render: (_, {metadata}) => {
				const c = metadata?.cancellation;
				if (!c?.reason) {
					return <span className="text-gray-400">—</span>;
				}
				return (
					<Tooltip title={c.reason}>
						<Tag
							color={c.by === 'admin' ? 'volcano' : 'red'}
							style={{
								cursor: 'pointer',
								display: 'inline-flex',
								alignItems: 'center',
								gap: 4,
							}}
						>
							{c.by === 'admin' ? 'By clinic' : 'By user'}
							<InfoCircleOutlined />
						</Tag>
					</Tooltip>
				);
			},
		},
		{
			title: 'Status',
			key: 'status',
			dataIndex: 'Status',
			render: (_, record) => {
				const {Status, id} = record;
				const past = isDayPast(record.appointment?.date);
				return (
					<Select
						bordered={false}
						value={Status}
						onChange={(value) => {
							if (value === 'cancelled') {
								openCancel(record);
							} else {
								UpdateStatus(id, value);
							}
						}}
						style={{width: 180}}
					>
						<Option value="placed">
							<Tag color="blue">Placed</Tag>
						</Option>
						<Option value="appointment booked">
							<Tag color="cyan">Appointment Booked</Tag>
						</Option>
						<Option value="rejected">
							<Tag color="orange">Rejected</Tag>
						</Option>
						<Option value="completed">
							<Tag color="green">Completed</Tag>
						</Option>
						<Option value="cancelled" disabled={past}>
							<Tag color="red">Cancelled</Tag>
						</Option>
					</Select>
				);
			},
		},
	];

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid ">
				<div className="flex items-center justify-between gap-2 flex-wrap mb-3">
					<h2 className="text-xl font-bold">Doctor Appointments</h2>
					<Button type="primary">
						<CSVLink data={visibleOrders} filename="OrderList" target="_blank">
							Export
						</CSVLink>
					</Button>
				</div>
				<div className="my-2 flex items-center gap-2 flex-wrap">
					<TableSearch placeholder="Search order ID, user, mobile or doctor" onSearch={setSearch} />
					<RangePicker
						placeholder={['Appointment from', 'to']}
						value={appointmentRange}
						onChange={(v) => setAppointmentRange(v as DateRange)}
					/>
					<RangePicker
						placeholder={['Booked from', 'to']}
						value={bookedRange}
						onChange={(v) => setBookedRange(v as DateRange)}
					/>
					<Select
						allowClear
						showSearch
						placeholder="Doctor"
						style={{width: 200}}
						value={doctor}
						onChange={setDoctor}
						options={optionsOf(orderArray.map((o) => o.doctor))}
					/>
					<Select
						allowClear
						placeholder="Status"
						style={{width: 170}}
						value={statusFilter}
						onChange={setStatusFilter}
						options={APPOINTMENT_STATUS_OPTIONS}
					/>
					<Select
						allowClear
						placeholder="Payment"
						style={{width: 130}}
						value={payment}
						onChange={setPayment}
						options={optionsOf(orderArray.map((o) => o.Payment))}
					/>
				</div>
				{isLoading ? (
					<Skeleton active />
				) : (
					<Table
						size="middle"
						rowKey={(obj) => obj.Order_Id}
						pagination={{pageSize: 7, showSizeChanger: false}}
						columns={columns}
						dataSource={visibleOrders}
						style={{width: '100%', border: '2px solid #ECECEC'}}
					/>
				)}

				<Modal
					centered
					title="Cancel appointment"
					visible={cancelModal}
					okText="Cancel appointment"
					okButtonProps={{danger: true}}
					confirmLoading={updateOrder.isLoading}
					onOk={submitCancel}
					onCancel={() => setCancelModal(false)}
				>
					<p className="mb-2 text-gray-500">
						Add a reason for cancelling. This will be visible to the user.
					</p>
					<TextArea
						rows={5}
						value={cancelReason}
						onChange={(e) => setCancelReason(e.target.value)}
						placeholder="Reason for cancellation"
					/>
				</Modal>
			</div>
		</Layout>
	);
};
