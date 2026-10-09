import {Layout} from '@healthvisa/components';
import {
	Button,
	DatePicker,
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
import {ColumnsType} from 'antd/lib/table';
import React, {useState} from 'react';
import {useUser} from '@healthvisa/models/admin/users/useUser';
import moment from 'moment';
import {formatPrice} from '@healthvisa/utils';
import {CSVLink} from 'react-csv';
import {TableSearch} from '@healthvisa/components/TableSearch';
import {DateRange, inDateRange, isDayPast, matchesSearch, optionsOf} from '@healthvisa/utils/tableFilter';
import {APPOINTMENT_STATUS_OPTIONS, availableAppointmentStatuses, appointmentStatusColor} from '@healthvisa/utils/appointmentStatus';
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
	test?: string;
	lab?: string;
	Option?: string;
	id: string;
	tests: string;
	note: string;
	metadata: any;
	prescriptionUrl?: string;
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

const {Link} = Typography;
const {Option} = Select;
const {TextArea} = Input;
const {RangePicker} = DatePicker;

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
				refetch();
			},
			onError: (errors: any) => {
				message.error(errors?.errors?.error?.message ?? errors?.errors?.data?.message ?? 'Could not update appointment');
				refetch();
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
					Amount: appointment.amount != null && (appointment.optionSelected !== 'health package' || appointment.healthPackageId)
						? `₹${formatPrice(appointment.amount)}`
						: appointment.optionSelected === 'health package' ? 'Confirm price' : '-',
					Status: appointment.status,
					CreatedOn: moment(appointment.createdAt).format('DD MMM YYYY'),
					test: appointment.healthPackage || (appointment.optionSelected === 'health package' ? 'Package details unavailable' : DiagnosticItems?.find(
						(item) => item.id === appointment.diagnosticId,
					)?.name),
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
					prescriptionUrl: appointment?.prescriptionUrl,
					date: appointment.date,
					slots: appointment.slots,
			  }))
			: [];

	const [search, setSearch] = useState('');
	const [visitRange, setVisitRange] = useState<DateRange>(null);
	const [bookedRange, setBookedRange] = useState<DateRange>(null);
	const [lab, setLab] = useState<string>();
	const [diagnostic, setDiagnostic] = useState<string>();
	const [optionFilter, setOptionFilter] = useState<string>();
	const [statusFilter, setStatusFilter] = useState<string>();
	// What the table shows is also what Export downloads.
	const visibleAppointments = appointmentsArray.filter(
		(a) =>
			matchesSearch(search, [a.User, a.Mobile, a.lab, a.test, a.tests]) &&
			inDateRange(a.date, visitRange) &&
			inDateRange(a.CreatedOn, bookedRange) &&
			(!lab || a.lab === lab) &&
			(!diagnostic || a.test === diagnostic) &&
			(!optionFilter || a.Option === optionFilter) &&
			(!statusFilter || a.Status === statusFilter),
	);

	// Cancelling needs a reason → routes through its own modal (not the inline
	// status Select). Reason + who/when is written to metadata.cancellation.
	const openCancel = (record: DataType) => {
		if (isDayPast(record.date)) {
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
				message.error(errors?.errors?.error?.message ?? errors?.errors?.data?.message ?? 'Failed to cancel');
				refetch();
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
					{option === 'prescription' && record?.prescriptionUrl && (
						// Signed, short-lived link from the API (the S3 folder is private).
						<Link href={record.prescriptionUrl} target="_blank">
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
				const past = isDayPast(record.date);
				return (
						<Select
							bordered={false}
							value={Status}
							disabled={updateLabAppointment.isLoading || availableAppointmentStatuses(Status).length === 1}
						onChange={(value) => {
							if (value === 'cancelled') {
								openCancel(record);
							} else if (value === 'completed' || value === 'rejected') {
								Modal.confirm({
									title: `Mark this appointment ${value}?`,
									content: 'This status is final in the normal workflow.',
									onOk: () => UpdateStatus(id, value),
								});
							} else {
								UpdateStatus(id, value);
							}
						}}
						style={{width: 180}}>
						{availableAppointmentStatuses(Status)
							.filter(value => value !== 'cancelled' || !past || value === Status)
							.map(value => (
								<Option key={value} value={value}>
									<Tag color={appointmentStatusColor[value]}>
										{value.replace(/\b\w/g, c => c.toUpperCase())}
									</Tag>
								</Option>
							))}
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
							data={visibleAppointments}
							filename="OrderList"
							target="_blank">
							Export
						</CSVLink>
					</Button>
				</div>
				<div className="my-2 flex items-center gap-2 flex-wrap">
					<TableSearch placeholder="Search user, mobile, lab or test" onSearch={setSearch} />
					<RangePicker
						placeholder={['Visit from', 'to']}
						value={visitRange}
						onChange={(v) => setVisitRange(v as DateRange)}
					/>
					<RangePicker
						placeholder={['Booked from', 'to']}
						value={bookedRange}
						onChange={(v) => setBookedRange(v as DateRange)}
					/>
					<Select
						allowClear
						showSearch
						placeholder="Lab"
						style={{width: 180}}
						value={lab}
						onChange={setLab}
						options={optionsOf(appointmentsArray.map((a) => a.lab))}
					/>
					<Select
						allowClear
						showSearch
						placeholder="Diagnostic"
						style={{width: 180}}
						value={diagnostic}
						onChange={setDiagnostic}
						options={optionsOf(appointmentsArray.map((a) => a.test))}
					/>
					<Select
						allowClear
						placeholder="Option"
						style={{width: 140}}
						value={optionFilter}
						onChange={setOptionFilter}
						options={optionsOf(appointmentsArray.map((a) => a.Option))}
					/>
					<Select
						allowClear
						placeholder="Status"
						style={{width: 170}}
						value={statusFilter}
						onChange={setStatusFilter}
						options={APPOINTMENT_STATUS_OPTIONS}
					/>
				</div>
				{isLoading || loading ? (
					<Skeleton active />
				) : (
					<Table
						size="middle"
						rowKey={(obj) => obj.id}
						pagination={{pageSize: 7, showSizeChanger: false}}
						columns={columns}
						dataSource={visibleAppointments}
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
