import {Layout} from '@healthvisa/components';

import {Button, message, Modal, Select, Skeleton, Space, Table, Tag} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import router from 'next/router';
import React, {useState} from 'react';
import {
	useDeleteUser,
	useGetMemberships,
	useGetNewMembers,
	useApproveMembershipRequest,
	useUpdateNewMember,
	useUser,
} from '@healthvisa/models/admin/users/useUser';
import {ExclamationCircleFilled} from '@ant-design/icons';
import {CSVLink} from 'react-csv';
import {TableSearch} from '@healthvisa/components/TableSearch';
import {matchesSearch} from '@healthvisa/utils/tableFilter';
import {NewMemberUpdateRequestParams} from '@healthvisa/models/admin/users/User';
import {formatPrice} from '@healthvisa/utils';
import moment from 'moment';
import {BOOKING_PAYMENT} from '@healthvisa/utils/paymentStatus';

const {confirm} = Modal;

const {Option} = Select;

interface DataType {
	key: string;
	appliedFor: string;
	name: string;
	mobile?: string;
	status: string;
	id: string;
	userId: string;
	metadata?: any;
	documentUrl?: string;
	amount?: number;
	paymentStatus?: string;
	amountPaid?: number;
}

/** How a membership request is (being) paid: the booking labels, worded for requests. */
const PAYMENT_LABEL: Record<string, {label: string; color: string}> = {
	...BOOKING_PAYMENT,
	unpaid: {...BOOKING_PAYMENT.unpaid, label: 'Awaiting online payment'},
	failed: {...BOOKING_PAYMENT.failed, label: 'Online payment failed'},
	offline: {...BOOKING_PAYMENT.offline, label: 'Collect offline'},
};

/** Why Allow Access is off for a request being paid online. */
const APPROVE_HINT: Record<string, string> = {
	pending: 'The member is paying online right now',
	paid: 'Paid online: activated automatically',
};

/** Finished membership requests show a tag instead of the status picker. */
const DONE_STATUS: Record<string, {text: string; color: string}> = {
	approving: {text: 'Approving', color: 'gold'},
	completed: {text: 'Completed', color: 'green'},
	cancelled: {text: 'Cancelled by member', color: 'default'},
	rejected: {text: 'Rejected', color: 'red'},
};

const DoneStatusTag = ({status}: {status: string}) => {
	const shown = DONE_STATUS[status] ?? DONE_STATUS.rejected;
	return <Tag color={shown.color}>{shown.text}</Tag>;
};

export const NewMembersListPage = () => {
	const {isLoading, data: userList, refetch} = useGetNewMembers();
	const {data: usersArray} = useUser();
	const {data: plans} = useGetMemberships();
	const planById = React.useMemo(
		() => new Map((plans || []).map((p) => [p.id, p])),
		[plans],
	);
	const planTitleById = React.useMemo(() => {
		const map: Record<string, string> = {};
		(plans || []).forEach((p) => (map[p.id] = p.title));
		return map;
	}, [plans]);
	const deleteUser = useDeleteUser();

	const handleDelete = async (id: string) => {
		deleteUser.mutate(
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
			title: 'Are you sure you want to delete this?',
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
	const approveMembership = useApproveMembershipRequest();
	const [pendingApprovalId, setPendingApprovalId] = useState<string | null>(null);
	const updateNewMember = useUpdateNewMember();

	const UpdateStatus = async (id: string, status: string) => {
		const body: NewMemberUpdateRequestParams = {
			id,
			status,
		};
		updateNewMember.mutate(body, {
			onSuccess: (res) => {
				message.success('User Updated Successfully');
			},
			onError: (errors: any) => {
				message.error(errors?.errors?.data?.message ?? errors?.errors?.error?.message ?? 'Could not update request');
			},
		});
	};
	// Paid / being paid online: the payment activates it, not Allow Access.
	// ₹ due: priced by the server (`amount`); older requests from their snapshot.
	const amountDue = (record: DataType) =>
		record.amount ??
		record.metadata?.referral?.finalPrice ??
		record.metadata?.renewalDiscount?.finalPrice ??
		planById.get(record.metadata?.membershipId)?.discountPrice;
	const canApprove = (record: DataType) =>
		['active', 'approving'].includes(record.status) &&
		!['pending', 'paid'].includes(record.paymentStatus ?? '') &&
		(!pendingApprovalId || pendingApprovalId === record.id);
	const allowAccess = (record: DataType) => {
		const plan = planById.get(record.metadata?.membershipId);
		if (!plan) {
			message.error('No valid membership plan on this request — cannot approve.');
			return;
		}
		const amount = amountDue(record);
		confirm({
			title: record.status === 'approving' ? 'Resume membership approval?' : 'Allow membership access?',
			icon: <ExclamationCircleFilled />,
			content: `${record.name || 'This user'} · ${plan.title}${amount != null ? ` · Collect ₹${formatPrice(amount)} offline` : ''}. This will grant access and complete the request.`,
			okText: record.status === 'approving' ? 'Resume Approval' : 'Allow Access',
			onOk: async () => {
				setPendingApprovalId(record.id);
				try {
					await approveMembership.mutateAsync({
						id: record.id,
						resume: record.status === 'approving',
					});
					message.success('Membership access granted; request completed');
				} catch (error: any) {
					refetch();
					message.error(error?.errors?.error?.message ?? 'Could not approve membership');
					throw error;
				} finally {
					setPendingApprovalId(null);
				}
			},
		});
	};

	const userArray: DataType[] =
		userList && userList?.length > 0
			? userList.map((user, index) => ({
					index: index + 1,
					key: user.id,
					name: usersArray?.find((u) => u.id === user.userId)?.name ?? '',
					appliedFor: user?.appliedFor,
					status: user?.status,
					mobile:
						usersArray?.find((u) => u.id === user.userId)?.mobileNumber ?? '',
					id: user.id,
					userId: user.userId,
					createdOn: moment(user.createdAt).format('DD MMM YYYY'),
					metadata: user?.metadata || {},
					documentUrl: user?.documentUrl,
					amount: user?.amount,
					// Requests from before online payment have no status: offline.
					paymentStatus:
						user?.appliedFor === 'membership' ? user?.paymentStatus ?? 'offline' : undefined,
					amountPaid: user?.amountPaid,
			  }))
			: [];

	const [search, setSearch] = useState('');
	// What the table shows is also what Export downloads.
	const visibleRequests = userArray.filter((r) =>
		matchesSearch(search, [
			r.name,
			r.mobile,
			r.appliedFor,
			r.status,
			r.paymentStatus && PAYMENT_LABEL[r.paymentStatus]?.label,
		]),
	);

	const columns: ColumnsType<DataType> = [
		{
			title: 'Sr. No.',
			dataIndex: 'index',
			key: 'index',
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Mobile',
			dataIndex: 'mobile',
			key: 'mobile',
		},

		{
			title: 'Requested For',
			dataIndex: 'appliedFor',
			key: 'appliedFor',
		},
		{
			title: 'Plan',
			key: 'plan',
			render: (_, {appliedFor, metadata}) =>
				appliedFor === 'membership'
					? planTitleById[metadata?.membershipId] ||
					  metadata?.membershipId ||
					  '—'
					: '—',
		},
		{
			title: 'Discount / Payment',
			key: 'discount',
			render: (_, record) => {
				const {appliedFor, metadata, paymentStatus, amountPaid} = record;
				if (appliedFor !== 'membership') {
					return '—';
				}
				// First-time purchases may carry a referral discount; renewals carry
				// the flat renewal discount. The server prices `amount` with them.
				const referral = metadata?.referral;
				const renewal = metadata?.renewal ? metadata?.renewalDiscount : undefined;
				const due = amountDue(record);
				const label = PAYMENT_LABEL[paymentStatus!] ?? PAYMENT_LABEL.offline;
				const shown = paymentStatus === 'paid' ? amountPaid ?? due : due;
				return (
					<Space direction="vertical" size={2}>
						{referral && (
							<span>
								{referral.code}
								{referral.referrerName ? ` · ${referral.referrerName}` : ''}
							</span>
						)}
						{!referral && renewal && <span>{`Renewal ${renewal.percent}% off`}</span>}
						<Tag color={label.color}>
							{label.label}
							{shown != null ? ` · ₹${formatPrice(shown)}` : ''}
						</Tag>
					</Space>
				);
			},
		},
		{
			title: 'Requested On',
			dataIndex: 'createdOn',
			key: 'createdOn',
		},
		{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<Space size="middle">
					{record.appliedFor === 'membership' && (
							<Button
								disabled={!canApprove(record)}
								title={APPROVE_HINT[record.paymentStatus ?? '']}
								loading={pendingApprovalId === record.id}
								size="small"
								onClick={() => allowAccess(record)}
							type="default"
							// Blue only while it can be used, so a done request looks disabled.
							style={canApprove(record) ? {
								color: '#1990FF',
								border: '1px solid #1990FF',
								padding: '0 10px',
							} : {padding: '0 10px'}}>
								{record.status === 'approving' ? 'Resume Approval' : 'Allow Access'}
						</Button>
					)}
					{record.appliedFor === 'order medicine' &&
						record?.documentUrl && (
							<Button
								size="small"
								// Signed, short-lived link from the API (the S3 folder is private).
								onClick={() => window.open(record.documentUrl, '_blank')}
								type="default"
								style={{
									color: '#1990FF',
									border: '1px solid #1990FF',
									padding: '0 10px',
								}}>
								View Prescription
							</Button>
						)}
				</Space>
			),
		},
		{
			width: 170,
			title: 'Status',
			fixed: 'right',
			key: 'status',
			dataIndex: 'Status',
				render: (_, {status, id, appliedFor}) =>
				appliedFor === 'membership' && status !== 'active' ? (
					<DoneStatusTag status={status} />
				) : (
					<Select
						bordered={false}
						value={status}
						disabled={updateNewMember.isLoading}
						onChange={(value) => {
							if (appliedFor === 'membership' && value === 'rejected') {
								confirm({
									title: 'Reject this membership request?',
									okText: 'Reject',
									okType: 'danger',
									onOk: () => UpdateStatus(id, value),
								});
							} else {
								UpdateStatus(id, value);
							}
						}}
						style={{width: 140}}>
					<Option value="active">
						<Tag color="blue">Active</Tag>
					</Option>
						<Option value="completed" disabled={appliedFor === 'membership'}>
						<Tag color="green">Completed</Tag>
					</Option>
					<Option value="rejected">
						<Tag color="red">Rejected</Tag>
					</Option>
					</Select>
				),
		},
	];

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid ">
				<div className="flex items-center justify-between gap-2 flex-wrap mb-3">
					<h2 className="text-xl font-bold">List of User Requests</h2>
					<Button type="primary">
						<CSVLink data={visibleRequests} filename="UserList" target="_blank">
							Export
						</CSVLink>
					</Button>
				</div>
				<div className="my-2">
					<TableSearch placeholder="Search name, mobile, request or status" onSearch={setSearch} />
				</div>
				{isLoading ? (
					<Skeleton active />
				) : (
					<Table
						size="middle"
						rowKey={(obj) => obj.key}
						pagination={{pageSize: 7, showSizeChanger: false}}
						columns={columns}
						dataSource={visibleRequests}
						style={{width: '100%', border: '2px solid #ECECEC'}}
						// Wide table: scroll it sideways inside the page, Status stays visible.
						scroll={{x: 'max-content'}}
					/>
				)}
			</div>
		</Layout>
	);
};
