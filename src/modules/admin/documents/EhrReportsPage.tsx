import {Layout} from '@healthvisa/components';
import {Button, DatePicker, Skeleton, Table, Typography} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import React, {useState} from 'react';
import moment from 'moment';
import {CSVLink} from 'react-csv';
import {useUser} from '@healthvisa/models/admin/users/useUser';
import {useGetEhrDocuments} from '@healthvisa/models/admin/documents/useDocument';
import {TableSearch} from '@healthvisa/components/TableSearch';
import {DateRange, inDateRange, matchesSearch} from '@healthvisa/utils/tableFilter';

const {Link} = Typography;
const {RangePicker} = DatePicker;

interface DataType {
	User: string;
	Mobile: string;
	title: string;
	patientName: string;
	description: string;
	CreatedOn: string;
	url: string;
	fileType: string;
	id: string;
}

export const EhrReportsPage = () => {
	const {isLoading, data: userList} = useUser();
	const {isLoading: loading, data} = useGetEhrDocuments();

	const reports: DataType[] =
		data && data.length > 0
			? data.map((doc) => {
					const user = userList?.find((u) => u.id === doc.userId);
					return {
						User: user?.name ?? '',
						Mobile: user?.mobileNumber ?? '',
						title: doc.title,
						patientName: doc.patientName ?? '',
						description: doc.description ?? '',
						CreatedOn: moment(doc.createdAt).format('DD MMM YYYY'),
						url: doc.document?.url ?? '',
						fileType: (doc.document?.type ?? '').toUpperCase(),
						id: doc.id,
					};
			  })
			: [];

	const [search, setSearch] = useState('');
	const [uploadedRange, setUploadedRange] = useState<DateRange>(null);
	// What the table shows is also what Export downloads.
	const visibleReports = reports.filter(
		(r) =>
			matchesSearch(search, [r.User, r.Mobile, r.patientName, r.title]) &&
			inDateRange(r.CreatedOn, uploadedRange),
	);

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
			title: 'Report Title',
			dataIndex: 'title',
			key: 'title',
			render: (title) => <span className="font-semibold">{title}</span>,
		},
		{
			title: 'Patient',
			dataIndex: 'patientName',
			key: 'patientName',
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
			render: (description) => (
				<span className="text-xs">{description || '—'}</span>
			),
		},
		{
			title: 'Uploaded On',
			dataIndex: 'CreatedOn',
			key: 'createdOn',
		},
		{
			title: 'Report',
			key: 'report',
			render: (_, record) =>
				record.url ? (
					<Link href={record.url} target="_blank">
						View{record.fileType ? ` (${record.fileType})` : ''}
					</Link>
				) : (
					<span className="text-gray-400">—</span>
				),
		},
	];

	return (
		<Layout>
			<div className="admin-card">
				<div className="flex items-center justify-between gap-2 flex-wrap mb-3">
					<h2 className="admin-page-title">EHR Reports</h2>
					<Button type="primary">
						<CSVLink data={visibleReports} filename="EhrReports" target="_blank">
							Export
						</CSVLink>
					</Button>
				</div>
				<div className="my-2 flex items-center gap-2 flex-wrap">
					<TableSearch placeholder="Search user, mobile, patient or title" onSearch={setSearch} />
					<RangePicker
						placeholder={['Uploaded from', 'to']}
						value={uploadedRange}
						onChange={(v) => setUploadedRange(v as DateRange)}
					/>
				</div>
				{isLoading || loading ? (
					<Skeleton active />
				) : (
					<Table
						size="middle"
						rowKey={(obj) => obj.id}
						pagination={{pageSize: 8, showSizeChanger: false}}
						columns={columns}
						dataSource={visibleReports}
						style={{width: '100%'}}
					/>
				)}
			</div>
		</Layout>
	);
};
