import {Layout} from '@healthvisa/components';

import {Button, message, Modal, Select, Skeleton, Space, Table, Tag} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import router from 'next/router';
import React from 'react';
import {
	useAllowEHRUser,
	useDeleteUser,
	useGetNewMembers,
	useSelectMembership,
	useUpdateNewMember,
	useUser,
} from '@healthvisa/models/admin/users/useUser';
import {ExclamationCircleFilled} from '@ant-design/icons';
import {CSVLink} from 'react-csv';
import {
	AddMembershipTransactionRequestParams,
	EHRRequestParams,
	NewMemberUpdateRequestParams,
} from '@healthvisa/models/admin/users/User';
import moment from 'moment';

const {confirm} = Modal;

const {Option} = Select;

interface DataType {
	key: string;
	appliedFor: string;
	name: string;
	status: string;
	id: string;
	userId: string;
}

export const NewMembersListPage = () => {
	const {isLoading, data: userList} = useGetNewMembers();
	const {data: usersArray} = useUser();
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
	const allowEHR = useAllowEHRUser();
	const selectMembership = useSelectMembership();
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
				message.error(errors?.errors.data.message);
			},
		});
	};
	const allowAccess = async (appliedFor: string, userId: string) => {
		if (appliedFor === 'EHR') {
			const body: EHRRequestParams = {
				id: userId,
				isEHR: true,
			};
			allowEHR.mutate(body, {
				onSuccess: (res) => {
					message.success('Access granted');
				},
				onError: (errors: any) => {
					message.error(errors?.errors.data.message);
				},
			});
		}
		if (appliedFor === 'membership') {
			const body: AddMembershipTransactionRequestParams = {
				userId,
				membershipId: '633b0a4e54d6933158b38f27',
				optedAt: new Date(),
				isActive: true,
				metadata: {},
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			console.log('>>>>>>>>>>>>>>>>>>>>>>', body);
			selectMembership.mutate(body, {
				onSuccess: (data) => {
					console.log('data: ', data);

					message.success('Access granted');
				},
				onError: (error) => {
					console.log('error ', error);
				},
			});
		}
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
			  }))
			: [];

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
			title: 'Requested On',
			dataIndex: 'createdOn',
			key: 'createdOn',
		},
		{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<Space size="middle">
					{['membership', 'EHR'].includes(record.appliedFor) && (
						<Button
							loading={allowEHR.isLoading || selectMembership.isLoading}
							disabled={['completed' || 'rejected'].includes(record.status)}
							size="small"
							onClick={() => allowAccess(record.appliedFor, record.userId)}
							type="default"
							style={{
								color: '#1990FF',
								border: '1px solid #1990FF',
								padding: '0 10px',
							}}
						>
							Allow Access
						</Button>
					)}
				</Space>
			),
		},
		{
			width: 170,
			title: 'Status',
			key: 'status',
			dataIndex: 'Status',
			render: (_, {status, id}) => (
				<Select
					bordered={false}
					defaultValue={status}
					onChange={(value) => UpdateStatus(id, value)}
					style={{width: 140}}
				>
					<Option value="active">
						<Tag color="blue">Active</Tag>
					</Option>
					<Option value="completed">
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
				<h2 className="text-xl font-bold">List of New Members</h2>
				{/* <Button
					type="primary"
					className="self-end mb-2"
					onClick={() => router.push('/admin/users/create')}>
					Add New
				</Button> */}
				<Button type="primary" className="self-end mb-2 w-[90px]">
					<CSVLink data={userArray} filename="UserList" target="_blank">
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
						dataSource={userArray}
						style={{width: '100%', border: '2px solid #ECECEC'}}
					/>
				)}
			</div>
		</Layout>
	);
};
