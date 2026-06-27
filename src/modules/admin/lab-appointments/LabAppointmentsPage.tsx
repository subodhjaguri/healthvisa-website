import {Layout} from '@healthvisa/components';
import {
	Button,
	message,
	Select,
	Skeleton,
	Table,
	Tag,
	Modal,
	Input,
	Tooltip,
} from 'antd';
import {
	CalendarOutlined,
	ClockCircleOutlined,
	InfoCircleOutlined,
} from '@ant-design/icons';
import {Typography} from 'antd';
const {Link} = Typography;
import {ColumnsType} from 'antd/lib/table';
import React, {useState} from 'react';
import {useUser} from '@healthvisa/models/admin/users/useUser';
import moment from 'moment';
import {formatPrice} from '@healthvisa/utils';
import {CSVLink} from 'react-csv';
import {
	useDiagnosticItems,
	useGetLabAppointments,
	useGetLabs,
	useUpdateLabAppointment,
} from '@healthvisa/models/admin/lab-appointments/useLab';
import {LabAppointmentUpdateRequestParams} from '@healthvisa/models/admin/lab-appointments/Lab';

interface DataType {
	Mobile: string;
	User: string;
	Status: string;
	CreatedOn: string;
	Amount: string;
	visit: string;
	id: string;
	tests: string;
	note: string;
	metadata: any;
	prescription?: string;
	date?: string;
	slots?: string[];
}

// Aligned label for the expanded-row detail rows.
const labelStyle: React.CSSProperties = {
	fontWeight: 600,
	minWidth: 140,
	color: '#555',
	fontSize: 13,
};

const {Option} = Select;
const {TextArea} = Input;

// Day-granular "past": an appointment is past once its calendar day is before
// today. Undated lab visits (no scheduled day) are never past.
const isAppointmentPast = (raw?: string): boolean => {
	if (!raw) {
		return false;
	}
	const d = new Date(raw);
	if (isNaN(d.getTime())) {
		return false;
	}
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return (
		new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() <
		today.getTime()
	);
};

export const LabAppointmentsPage = () => {
	const {isLoading, data: userList} = useUser();
	const {data: DiagnosticItems} = useDiagnosticItems();
	const {data: labs = []} = useGetLabs();
	const {isLoading: loading, data, refetch} = useGetLabAppointments();
	const [cancelModal, setCancelModal] = useState(false);
	const [cancelReason, setCancelReason] = useState('');
	const [cancelRow, setCancelRow] = useState<DataType>();
	const updateLabAppointment = useUpdateLabAppointment();
	const UpdateStatus = async (id: string, status: string) => {
		const body: LabAppointmentUpdateRequestParams = {
			id,
			status,
		};
		updateLabAppointment.mutate(body, {
			onSuccess: (res) => {
				message.success('Appointment Updated Successfully');
			},
			onError: (errors: any) => {
				message.error(errors?.errors.data.message);
			},
		});
	};

	const appointmentsArray: DataType[] =
		data && data?.length > 0
			? data.map((appointment) => ({
					User:
						userList?.find((user) => user.id === appointment.userId)?.name ??
						'',
					Mobile:
						userList?.find((user) => user.id === appointment.userId)
							?.mobileNumber ?? '',
					Amount: appointment.amount
						? `₹${formatPrice(appointment.amount)}`
						: '-',
					Status: appointment.status,
					CreatedOn: moment(appointment.createdAt).format('DD MMM YYYY'),
					test: DiagnosticItems?.find(
						(item) => item.id === appointment.diagnosticId,
					)?.name,
					lab: labs.find((item) => item.id === appointment.labId)?.name,
					visit: appointment.visit,
					id: appointment.id,
					Option: appointment.optionSelected,
					tests: appointment?.metadata?.tests
						? appointment?.metadata?.tests
								.map((test: any) => test?.name)
								.join(', ')
						: '',
					note: appointment.metadata?.note || '',
					metadata: appointment.metadata,
					prescription: appointment?.prescription || '',
					date: appointment.date,
					slots: appointment.slots,
			  }))
			: [];

	// Cancelling needs a reason → routes through its own modal (not the inline
	// status Select). Reason + who/when is written to metadata.cancellation.
	const openCancel = (record: DataType) => {
		if (isAppointmentPast(record.date)) {
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
		const body: LabAppointmentUpdateRequestParams = {
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
		updateLabAppointment.mutate(body, {
			onSuccess: () => {
				message.success('Appointment cancelled');
				refetch();
				setCancelModal(false);
			},
			onError: (errors: any) => {
				message.error(errors?.errors?.data?.message ?? 'Failed to cancel');
			},
		});
	};

	const columns: ColumnsType<DataType> = [
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
			title: 'Lab',
			dataIndex: 'lab',
			key: 'lab',
		},
		{
			title: 'Visit',
			dataIndex: 'visit',
			key: 'visit',
			render: (visit) => (
				<span className="font-semibold capitalize">{visit}</span>
			),
		},
		{
			title: 'Option',
			dataIndex: 'Option',
			key: 'option',
			render: (option, record) => (
				<>
					<div className="font-semibold capitalize">{option}</div>
					{option === 'prescription' && record?.prescription && (
						// <Button
						//   size="small"
						//   onClick={() => window.open(`https://hv-documents.s3.ap-south-1.amazonaws.com/${record.prescription}`,'_blank')}
						//   type="link"
						//   style={{ color: '#1990FF', border: '1px solid #1990FF', padding: '0 10px' }}
						// >
						//   View Prescription
						// </Button>

						<Link
							href={`https://hv-documents.s3.ap-south-1.amazonaws.com/${record.prescription}`}
							target="_blank"
							//   style={{ marginLeft: 8 }}
						>
							View
						</Link>
					)}
				</>
			),
		},
		{
			title: 'Test',
			dataIndex: 'test',
			key: 'test',
		},
		{
			title: 'Amount',
			dataIndex: 'Amount',
			key: 'amount',
			render: (amount) => <span className="font-bold">{amount}</span>,
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
				const past = isAppointmentPast(record.date);
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
						style={{width: 180}}>
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
					<h2 className="text-xl font-bold">Lab Appointments</h2>
					<Button type="primary">
						<CSVLink
							data={appointmentsArray}
							filename="OrderList"
							target="_blank">
							Export
						</CSVLink>
					</Button>
				</div>
				{isLoading || loading ? (
					<Skeleton active />
				) : (
					<Table
						size="middle"
						rowKey={(obj) => obj.id}
						pagination={{pageSize: 7, showSizeChanger: false}}
						columns={columns}
						dataSource={appointmentsArray}
						style={{width: '100%', border: '2px solid #ECECEC'}}
						expandable={{
							expandedRowRender: (record) => {
								const testList = record.tests
									? record.tests.split(',').map((t) => t.trim()).filter(Boolean)
									: [];
								const slotList = (record.slots || []).filter(Boolean);
								return (
									<div
										style={{
											marginLeft: 40,
											padding: '10px 14px',
											background: '#FAFAFA',
											borderRadius: 8,
											border: '1px solid #F0F0F0',
											display: 'flex',
											flexDirection: 'column',
											gap: 10,
										}}>
										<div style={{display: 'flex', alignItems: 'center'}}>
											<span style={labelStyle}>Tests selected</span>
											<div style={{display: 'flex', gap: 6, flexWrap: 'wrap'}}>
												{testList.length ? (
													testList.map((t, i) => (
														<Tag
															key={i}
															color="default"
															style={{margin: 0, textTransform: 'capitalize'}}>
															{t}
														</Tag>
													))
												) : (
													<span style={{color: '#999'}}>—</span>
												)}
											</div>
										</div>

										{record.visit === 'home' ? (
											<div style={{display: 'flex', alignItems: 'center'}}>
												<span style={labelStyle}>Home visit schedule</span>
												<div
													style={{
														display: 'flex',
														gap: 6,
														flexWrap: 'wrap',
														alignItems: 'center',
													}}>
													{record.date ? (
														<Tag
															icon={<CalendarOutlined />}
															color="geekblue"
															style={{margin: 0}}>
															{record.date}
														</Tag>
													) : null}
													{slotList.length ? (
														slotList.map((s, i) => (
															<Tag
																key={i}
																icon={<ClockCircleOutlined />}
																color="cyan"
																style={{margin: 0}}>
																{s}
															</Tag>
														))
													) : (
														<span style={{color: '#999'}}>
															No slots selected
														</span>
													)}
												</div>
											</div>
										) : null}
									</div>
								);
							},
						}}
					/>
				)}

				{/* Cancel Modal */}
				<Modal
					centered
					title="Cancel appointment"
					visible={cancelModal}
					okText="Cancel appointment"
					okButtonProps={{danger: true}}
					confirmLoading={updateLabAppointment.isLoading}
					onOk={submitCancel}
					onCancel={() => setCancelModal(false)}>
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
