import {Layout} from '@healthvisa/components';
import {Button, message, Select, Skeleton, Table, Tag, Modal, Input} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import React, {useState} from 'react';
import {useUser} from '@healthvisa/models/admin/users/useUser';
import moment from 'moment';
import {formatPrice} from '@healthvisa/utils';
import {CSVLink} from 'react-csv';
import {
	useDiagnosticItems,
	useGetLabAppointments,
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
}

const {Option} = Select;
const {TextArea} = Input;

export const LabAppointmentsPage = () => {
	const {isLoading, data: userList} = useUser();
	const {data: DiagnosticItems} = useDiagnosticItems();
	const {isLoading: loading, data, refetch} = useGetLabAppointments();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [note, setNote] = useState('');
	const [currentAppointment, setCurrentAppointment] = useState<DataType>();

	const labs = [
		{
			name: 'The Lab Plus, Diagnostic and healthcare',
			shortAddress: 'Mira Road east,  Thane',
			fullAddress:
				'The Lab Plus , Diagnostic and Healthcare,A2-001/002, Ground floor,Prabhakar CHS, Shanti nagar Sector 4,Mira Road east,  Thane - 401107',
			id: '655226191e32a308b449dbda',
			description:
				'The Lab Plus is an NABL Accredited and ISO Certified lab with Specialized Reference Pathology Services run by senior and expert MD Pathologist , Dr Ashish Bhosle. It  is a fast emerging as the credible brand in the area of Diagnostic Health Services. The Lab Plus is driven by the sole objective of providing to its patients,the accuracy of quality reports ensured by qualified & experienced pathologists, radiologists, dentist, speciality doctors. dedicated & skilled technical team and world class top-of-the-line equipment.',
		},
		{
			name: 'NIDAN EXCELLENCE DIAGNOSTICS ',
			shortAddress: 'Sheetal Nagar Mira Road east',
			fullAddress:
				'Saurabh Bldg,Sheetal palace,opp. MTNL, Sheetal Nagar Mira Road east, Mira Bhayandar, Thane -401107 ',
			id: '655226941e32a308b449dbdb',
			description:
				"Nidan excellence Diagnostic Centre opitomizes healthcare excellence with its world-class machinery and facilities. Our cutting-edge technology and top-tier expertise ensure swift, precise, and superior diagnostic services. Your health is priceless to us, and at NIDAN, we're dedicated to providing you with the best possible care for a healthier life.",
		},
		{
			id: '65f9102bc418d083faeda140',
			name: 'B Healthcare',
			shortAddress: 'Mira Road east, Thane',
			fullAddress:
				'The Lab Plus , Diagnostic and Healthcare,A2-001/002, Ground floor,Prabhakar CHS, Shanti nagar Sector 4,Mira Road east,  Thane - 401107',
			description:
				'The Lab Plus is an NABL Accredited and ISO Certified lab with Specialized Reference Pathology Services run by senior and expert MD Pathologist , Dr Ashish Bhosle. It  is a fast emerging as the credible brand in the area of Diagnostic Health Services. The Lab Plus is driven by the sole objective of providing to its patients,the accuracy of quality reports ensured by qualified & experienced pathologists, radiologists, dentist, speciality doctors. dedicated & skilled technical team and world class top-of-the-line equipment.',
			certificate: '',
			image: 'https://hv-documents.s3.ap-south-1.amazonaws.com/Labs/Bhealthcare.png',
			availability: '24 hours',
		},
	];
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
						? appointment?.metadata?.tests.join(', ')
						: '',
					note: appointment.metadata?.note || '',
					metadata: appointment.metadata,
			  }))
			: [];

	const showModal = (record: DataType) => {
		setIsModalVisible(true);
		setNote(record.note);
		setCurrentAppointment(record);
	};

	const handleOk = async () => {
		if (currentAppointment) {
			const body: LabAppointmentUpdateRequestParams = {
				id: currentAppointment.id,
				metadata: {
					...currentAppointment.metadata,
					note,
				},
			};

			updateLabAppointment.mutate(body, {
				onSuccess: (res) => {
					message.success('Note Updated Successfully');
					refetch();
					setIsModalVisible(false);
				},
				onError: (errors: any) => {
					message.error(errors?.errors.data.message);
				},
			});
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
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
			render: (visit) => <span className="font-semibold capitalize">{visit}</span>,
		},
		{
			title: 'Option',
			dataIndex: 'Option',
			key: 'option',
			render: (option) => (
				<span className="font-semibold capitalize">{option}</span>
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
			title: 'Note',
			key: 'note',
			render: (_, record) => (
				<Button type="link" onClick={() => showModal(record)}>
					View/Edit
				</Button>
			),
		},
		{
			title: 'Status',
			key: 'status',
			dataIndex: 'Status',
			render: (_, {Status, id}) => (
				<Select
					bordered={false}
					defaultValue={Status}
					onChange={(value) => UpdateStatus(id, value)}
					style={{width: 180}}>
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
			),
		},
	];

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid ">
				<h2 className="text-xl font-bold">Lab Appointments</h2>
				<Button type="primary" className="self-end mb-2 w-[90px]">
					<CSVLink
						data={appointmentsArray}
						filename="OrderList"
						target="_blank">
						Export
					</CSVLink>
				</Button>
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
							expandedRowRender: (record) => (
								<div className="flex gap-3 ml-10">
									<p className="font-semibold ">Tests selected</p>
									<div className="capitalize flex gap-2">
										{record.tests}
									</div>
								</div>
							),
						}}
					/>
				)}

				{/* Note Modal */}
				<Modal
					centered
					title="View/Edit Note"
					visible={isModalVisible}
					onOk={handleOk}
					onCancel={handleCancel}
					okText="Save">
					<TextArea
						rows={6}
						value={note}
						onChange={(e) => setNote(e.target.value)}
						placeholder="Write your note here..."
					/>
				</Modal>
			</div>
		</Layout>
	);
};
