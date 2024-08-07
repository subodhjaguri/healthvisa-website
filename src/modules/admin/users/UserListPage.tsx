import {Layout} from '@healthvisa/components';

import {Button, Checkbox, message, Modal, Skeleton, Space, Table, Tag} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import router from 'next/router';
import React, {useState} from 'react';
import {useDeleteUser, useUser} from '@healthvisa/models/admin/users/useUser';
import {ExclamationCircleFilled} from '@ant-design/icons';
import moment from 'moment';
import {CSVLink} from 'react-csv';
import {CheckboxProps} from 'antd/es/checkbox';

const {confirm} = Modal;
interface DataType {
	key: string;
	mobileNumber: string;
	name: string;
	userName: string;
	status: boolean;
	createdOn: string;
	isEHR: boolean;
}

export const UserListPage = () => {
	const {isLoading, data: userList} = useUser();
	const deleteUser = useDeleteUser();
	const [isEHR, setIsEHR] = useState(false);
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
	const userArray: DataType[] =
		userList && userList?.length > 0
			? userList.map((user, index) => ({
					index: index + 1,
					key: user.id,
					name: user.name,
					mobileNumber: user?.mobileNumber,
					userName: user?.userName,
					status: user?.isActive,
					createdOn: moment(user.createdAt).format('DD MMM YYYY'),
					isEHR: user.isEHR,
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
			title: 'Mobile Number',
			dataIndex: 'mobileNumber',
			key: 'mobileNumber',
		},
		{
			title: 'Status',
			key: 'status',
			dataIndex: 'status',
			render: (_, {status}) => {
				const color = status === false ? 'volcano' : 'green';

				return <Tag color={color}>{status === true ? 'Active' : 'Inactive'}</Tag>;
			},
		},
		{
			title: 'Registered On',
			dataIndex: 'createdOn',
			key: 'createdOn',
		},
		{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<Space size="middle">
					<Button
						size="small"
						onClick={() => router.push(`/admin/users/${record.key}`)}
						type="default"
						style={{
							color: '#1990FF',
							border: '1px solid #1990FF',
							padding: '0 10px',
						}}
						className="uppercase">
						Edit
					</Button>

					<Button
						size="small"
						onClick={() => showModal(record.key)}
						type="default"
						style={{
							color: 'red',
							border: '1px solid red',
							padding: '0 10px',
						}}
						className="uppercase">
						Delete
					</Button>
				</Space>
			),
		},
	];
	const onChange: CheckboxProps['onChange'] = (e) => {
		setIsEHR(e.target.checked);
	};
	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid ">
				<h2 className="text-xl font-bold">List of Users</h2>
				<Button
					type="primary"
					className="self-end mb-2"
					onClick={() => router.push('/admin/users/create')}>
					Add New
				</Button>
				<Button type="primary" className="self-end mb-2 w-[90px]">
					<CSVLink data={userArray} filename="UserList" target="_blank">
						Export
					</CSVLink>
				</Button>
				<div className="my-2">
					<Checkbox onChange={onChange}>Show EHR Users</Checkbox>
				</div>
				{isLoading ? (
					<Skeleton active />
				) : (
					<Table
						size="middle"
						rowKey={(obj) => obj.key}
						pagination={{pageSize: 7, showSizeChanger: false}}
						columns={columns}
						dataSource={
							isEHR ? userArray.filter((user) => user.isEHR) : userArray
						}
						style={{width: '100%', border: '2px solid #ECECEC'}}
					/>
				)}
			</div>
		</Layout>
	);
};
