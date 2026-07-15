import {Layout} from '@healthvisa/components';
import {UserUpdateRequestParams, IFamilyMember} from '@healthvisa/models/admin/users/User';
import {
	useUpdateMembershipExpiry,
	useUpdateUser,
	useUserById,
	useFamilyMembersByUserId,
	useAddFamilyMember,
	useUpdateFamilyMember,
	useDeleteFamilyMember,
} from '@healthvisa/models/admin/users/useUser';
import {
	Button,
	DatePicker,
	Form,
	Input,
	InputNumber,
	message,
	Select,
	Skeleton,
	Table,
	Modal,
	Divider,
	Space,
} from 'antd';
import {ExclamationCircleFilled} from '@ant-design/icons';
import moment from 'moment';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';

export const UpdateUserPage = ({id}: {id: string}) => {
	const router = useRouter();
	const {data, isLoading} = useUserById({id});
	const updateUser = useUpdateUser();
	const updateMembershipExpiry = useUpdateMembershipExpiry();

	// The membership expiry lives on the user's membershipDetail snapshot; only
	// editable when the user actually has a membership.
	const currentEndDate: string | undefined =
		data?.metadata?.membershipDetail?.[0]?.endDate || undefined;
	const hasMembership = (data?.metadata?.membershipDetail?.length ?? 0) > 0;

	const [key_, setKey_] = useState(1);
	const saving = updateUser.isLoading || updateMembershipExpiry.isLoading;
	useEffect(() => {
		// Remount the form once data arrives so initialValue props take effect.
		setKey_((k) => k + 1);
	}, [data]);

	// Family Members state and hooks
	const {data: familyMembers = [], isLoading: loadingMembers} = useFamilyMembersByUserId(id);
	const addFamilyMemberMut = useAddFamilyMember();
	const updateFamilyMemberMut = useUpdateFamilyMember();
	const deleteFamilyMemberMut = useDeleteFamilyMember();

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingMember, setEditingMember] = useState<IFamilyMember | null>(null);
	const [modalForm] = Form.useForm();

	const handleAddEditMember = async (values: any) => {
		const memberData = {
			name: values.name,
			age: Number(values.age),
			gender: values.gender,
			relationship: values.relationship,
			userId: id,
			metadata: {
				phone: values.phone,
			},
		};

		try {
			if (editingMember && editingMember.id) {
				await updateFamilyMemberMut.mutateAsync({
					id: editingMember.id,
					userId: id,
					data: memberData,
				});
				message.success('Family member updated successfully');
			} else {
				await addFamilyMemberMut.mutateAsync(memberData);
				message.success('Family member added successfully');
			}
			setIsModalVisible(false);
			setEditingMember(null);
			modalForm.resetFields();
		} catch (err: any) {
			message.error(err?.errors?.error?.message || 'Operation failed');
		}
	};

	const showAddModal = () => {
		setEditingMember(null);
		modalForm.resetFields();
		setIsModalVisible(true);
	};

	const showEditModal = (member: IFamilyMember) => {
		setEditingMember(member);
		modalForm.setFieldsValue({
			name: member.name,
			age: member.age,
			gender: member.gender,
			relationship: member.relationship,
			phone: member.metadata?.phone || '',
		});
		setIsModalVisible(true);
	};

	const handleDeleteMember = (memberId: string) => {
		Modal.confirm({
			title: 'Are you sure you want to delete this family member?',
			icon: <ExclamationCircleFilled />,
			okText: 'Delete',
			okType: 'danger',
			cancelText: 'Cancel',
			centered: true,
			onOk() {
				return new Promise((resolve, reject) => {
					deleteFamilyMemberMut.mutate(
						{id: memberId, userId: id},
						{
							onSuccess: () => {
								message.success('Family member deleted successfully');
								resolve(null);
							},
							onError: (err: any) => {
								message.error(err?.errors?.error?.message || 'Failed to delete family member');
								reject();
							},
						},
					);
				});
			},
		});
	};

	const memberColumns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Age',
			dataIndex: 'age',
			key: 'age',
		},
		{
			title: 'Gender',
			dataIndex: 'gender',
			key: 'gender',
		},
		{
			title: 'Relationship',
			dataIndex: 'relationship',
			key: 'relationship',
		},
		{
			title: 'Mobile Number',
			dataIndex: 'phone',
			key: 'phone',
			render: (_: any, record: IFamilyMember) => record.metadata?.phone || '—',
		},
		{
			title: 'Action',
			key: 'action',
			render: (_: any, record: IFamilyMember) => (
				<Space size="middle">
					<Button
						size="small"
						onClick={() => showEditModal(record)}
						type="default"
						style={{
							color: '#1990FF',
							border: '1px solid #1990FF',
							padding: '0 10px',
						}}
					>
						Edit
					</Button>
					<Button
						size="small"
						onClick={() => record.id && handleDeleteMember(record.id)}
						type="default"
						style={{
							color: 'red',
							border: '1px solid red',
							padding: '0 10px',
						}}
					>
						Delete
					</Button>
				</Space>
			),
		},
	];

	const onFinish = async (values: any) => {
		try {
			// uniqueId (the membership ID) is a plain user field, so it's updated
			// inline with the rest of the details. Send it only when it changed.
			const newUniqueId = Number(values.uniqueId);
			const uniqueIdChanged =
				Number.isInteger(newUniqueId) && newUniqueId !== data?.uniqueId;
			await updateUser.mutateAsync({
				id,
				mobileNumber: values.mobileNo,
				name: values.name,
				userName: values.userName,
				isActive: values.status,
				...(uniqueIdChanged ? {uniqueId: newUniqueId} : {}),
			} as UserUpdateRequestParams);

			// Membership expiry lives on the membership row (not the user model),
			// so it has its own endpoint. Send only when the user has a membership
			// and the day changed; end-of-day keeps it valid through that date.
			const expiry = values.membershipExpiry;
			if (
				hasMembership &&
				expiry &&
				(!currentEndDate || !expiry.isSame(currentEndDate, 'day'))
			) {
				await updateMembershipExpiry.mutateAsync({
					userId: id,
					endDate: expiry.clone().endOf('day').toISOString(),
				});
			}

			message.success('User Updated Successfully');
			router.push('/admin/users');
		} catch (errors: any) {
			message.error(
				errors?.errors?.error?.message ||
					errors?.errors?.data?.message ||
					'Failed to update user',
			);
		}
	};
	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid   ">
				{isLoading ? (
					<Skeleton active />
				) : (
					<div>
						<div className="flex justify-between items-center pr-4">
							<h1 className="text-xl font-bold">Update</h1>
							<Button
								onClick={() => router.back()}
								style={{
									background: '#F8F9FA',
									color: 'black',
								}}
								className="w-24"
								type="primary"
							>
								Back
							</Button>
						</div>
						<div key={key_} className="w-full">
							<Form
								scrollToFirstError
								layout="vertical"
								name="basic"
								className="w-full"
								initialValues={{remember: true}}
								onFinish={onFinish}
								autoComplete="off"
							>
								<div className="flex justify-between flex-wrap w-full">
									<Form.Item
										label="Name"
										name="name"
										initialValue={data?.name}
										className="w-[49%]"
										rules={[
											{
												required: true,
												message: 'Please enter your Name',
											},
										]}
									>
										<Input placeholder="Enter your Name" />
									</Form.Item>
									<Form.Item
										label="User Name"
										name="userName"
										initialValue={data?.userName}
										className="w-[49%]"
										rules={[
											{
												required: true,
												message: 'Please enter your User Name',
											},
										]}
									>
										<Input placeholder="Enter your User Name" />
									</Form.Item>
								</div>
								<div className="flex justify-between flex-wrap w-full">
									<Form.Item
										label="Mobile Number"
										className="w-[49%]"
										name="mobileNo"
										initialValue={data?.mobileNumber}
										rules={[
											{
												required: true,
												message: 'Please enter Mobile number',
											},
										]}
									>
										<Input placeholder="Enter Mobile number" />
									</Form.Item>
									<Form.Item
										label="Status"
										className="w-[49%]"
										name="status"
										initialValue={data?.isActive}
									>
										<Select
											style={{width: '100%'}}
											options={[
												{
													value: true,
													label: 'Active',
												},
												{
													value: false,
													label: 'In-Active',
												},
											]}
										/>
									</Form.Item>
								</div>
								<div className="flex justify-between flex-wrap w-full">
									<Form.Item
										label="Membership ID"
										className="w-[49%]"
										name="uniqueId"
										initialValue={data?.uniqueId}
										tooltip="The ID printed on the member's card. Use a whole number, kept unique per member."
										rules={[
											{
												type: 'integer',
												min: 1,
												message: 'Enter a valid whole number',
											},
										]}
									>
										<InputNumber
											style={{width: '100%'}}
											placeholder="e.g. 100234"
											controls={false}
										/>
									</Form.Item>
									{hasMembership && (
										<Form.Item
											label="Membership Expiry"
											className="w-[49%]"
											name="membershipExpiry"
											initialValue={
												currentEndDate ? moment(currentEndDate) : undefined
											}
											tooltip="Extend/adjust when the membership expires (e.g. after collecting an offline renewal payment)."
										>
											<DatePicker
												className="w-full"
												format="DD MMM YYYY"
												allowClear={false}
											/>
										</Form.Item>
									)}
								</div>
								<div className="flex ">
									<Button
										loading={saving}
										style={{background: '#198753'}}
										className="w-24 mr-3"
										type="primary"
										htmlType="submit"
									>
										Update
									</Button>
									<Button
										onClick={() => router.back()}
										style={{background: '#F8F9FA', color: 'black'}}
										className="w-24"
										type="primary"
									>
										Cancel
									</Button>
								</div>
							</Form>

							<Divider style={{margin: '32px 0'}} />

							<div>
								<div className="flex justify-between items-center mb-4 pr-4">
									<div>
										<h2 className="text-lg font-bold">Family Members ({familyMembers.length} / 6)</h2>
										{!hasMembership && (
											<span style={{color: '#fa8c16', fontSize: '13px'}}>
												⚠️ Warning: This user does not have an active membership. Added family members may not be fully active on the mobile app.
											</span>
										)}
									</div>
									<Button
										type="primary"
										onClick={showAddModal}
										disabled={familyMembers.length >= 6}
									>
										+ Add Member
									</Button>
								</div>
								<Table
									loading={loadingMembers}
									dataSource={familyMembers}
									columns={memberColumns}
									rowKey="id"
									pagination={false}
									style={{width: '100%', border: '1px solid #ECECEC'}}
								/>
							</div>

							<Modal
								title={editingMember ? 'Edit Family Member' : 'Add Family Member'}
								visible={isModalVisible}
								onCancel={() => {
									setIsModalVisible(false);
									setEditingMember(null);
									modalForm.resetFields();
								}}
								footer={null}
								destroyOnClose
								centered
							>
								<Form
									form={modalForm}
									layout="vertical"
									name="add_edit_member"
									onFinish={handleAddEditMember}
								>
									<Form.Item
										label="Name"
										name="name"
										rules={[{required: true, message: 'Please enter Name'}]}
									>
										<Input placeholder="Enter Name" />
									</Form.Item>
									<div className="flex justify-between flex-wrap w-full">
										<Form.Item
											label="Age"
											name="age"
											className="w-[49%]"
											rules={[
												{required: true, message: 'Please enter Age'},
												{
													validator: (_, value) => {
														const ageVal = Number(value);
														if (value === undefined || value === null || value === '') {
															return Promise.resolve();
														}
														if (Number.isInteger(ageVal) && ageVal >= 1 && ageVal <= 120) {
															return Promise.resolve();
														}
														return Promise.reject(new Error('Age must be 1 to 120'));
													}
												}
											]}
										>
											<InputNumber style={{width: '100%'}} placeholder="Age" min={1} max={120} precision={0} />
										</Form.Item>
										<Form.Item
											label="Gender"
											name="gender"
											className="w-[49%]"
											rules={[{required: true, message: 'Please select Gender'}]}
										>
											<Select
												style={{width: '100%'}}
												placeholder="Select Gender"
												options={[
													{value: 'Male', label: 'Male'},
													{value: 'Female', label: 'Female'},
													{value: 'Other', label: 'Other'},
												]}
											/>
										</Form.Item>
									</div>
									<div className="flex justify-between flex-wrap w-full">
										<Form.Item
											label="Relationship"
											name="relationship"
											className="w-[49%]"
											rules={[{required: true, message: 'Please enter Relationship'}]}
										>
											<Input placeholder="e.g. Spouse, Son, Mother" />
										</Form.Item>
										<Form.Item
											label="Mobile Number"
											name="phone"
											className="w-[49%]"
											rules={[
												{required: true, message: 'Please enter Mobile Number'},
												{
													pattern: /^[0-9]{10}$/,
													message: 'Please enter a valid 10-digit Mobile number',
												},
											]}
										>
											<Input placeholder="Enter 10-digit number" maxLength={10} />
										</Form.Item>
									</div>
									<div className="flex justify-end gap-2 mt-4">
										<Button
											onClick={() => {
												setIsModalVisible(false);
												setEditingMember(null);
												modalForm.resetFields();
											}}
										>
											Cancel
										</Button>
										<Button
											type="primary"
											htmlType="submit"
											loading={addFamilyMemberMut.isLoading || updateFamilyMemberMut.isLoading}
										>
											{editingMember ? 'Update' : 'Add'}
										</Button>
									</div>
								</Form>
							</Modal>
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
};
