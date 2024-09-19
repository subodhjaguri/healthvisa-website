import {Layout} from '@healthvisa/components';
import {UserUpdateRequestParams} from '@healthvisa/models/admin/users/User';
import {useUpdateUser, useUserById} from '@healthvisa/models/admin/users/useUser';
import {Button, Checkbox, Form, Input, message, Select, Skeleton} from 'antd';
import type {CheckboxChangeEvent} from 'antd/es/checkbox';
import TextArea from 'antd/lib/input/TextArea';

import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';

export const UpdateUserPage = ({id}: {id: string}) => {
	const router = useRouter();
	const ID = id;
	const {data, isLoading} = useUserById({id: ID});
	const updateUser = useUpdateUser();

	const [status, setStatus] = useState(false);
	const [key_, setKey_] = useState(1);
	useEffect(() => {
		setKey_(key_ + 1);
		if (data && data?.isActive) {
			setStatus(data?.isActive);
		}
	}, [data]);
	const onFinish = async (values: any) => {
		console.log(values);
		// const body: UserUpdateRequestParams = {
		// 	id: ID,
		// 	mobileNumber: values.mobileNo,
		// 	name: values.name,
		// 	userName: values.userName,
		// 	metadata: {membershipDetail: []},
		// 	isActive: values.status,
		// };
		// updateUser.mutate(body, {
		// 	onSuccess: (res) => {
		// 		message.success('User Updated Successfully');
		// 		router.push('/admin/users');
		// 	},
		// 	onError: (errors: any) => {
		// 		message.error(errors?.errors.data.message);
		// 	},
		//});
	};
	const onChange = (e: CheckboxChangeEvent) => {
		setStatus(e.target.checked);
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
								type="primary">
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
								autoComplete="off">
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
										]}>
										<Input placeholder="Enter Name" />
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
										]}>
										<Input placeholder="Enter User Name" />
									</Form.Item>
								</div>

								<div className="flex justify-between flex-wrap w-full">
									<Form.Item
										label="Age"
										name="age"
										className="w-[49%]"
										rules={[
											{
												message: 'Please Enter your Age',
											},
											{
												type: 'number',
												min: 0,
												message: 'Age cannot be negative',
											},
										]}>
										<Input
											placeholder="Enter Age"
											type="number"
											min={0}
										/>
									</Form.Item>
									<Form.Item
										label="Address"
										name="address"
										className="w-[49%]"
										rules={[
											{
												message: 'Please enter your Address',
											},
										]}>
										<TextArea placeholder="Enter Address" rows={2} />
									</Form.Item>
								</div>
								<div className="flex justify-between flex-wrap w-full">
									<Form.Item
										label="Gender"
										name="gender"
										className="w-[49%]"
										rules={[
											{
												message: 'Please select your Gender',
											},
										]}>
										<Select placeholder="Select your Gender">
											<Select.Option value="male">
												Male
											</Select.Option>
											<Select.Option value="female">
												Female
											</Select.Option>
											<Select.Option value="other">
												Other
											</Select.Option>
										</Select>
									</Form.Item>
									<Form.Item
										label="Membership"
										name="membership"
										className="w-[49%]"
										rules={[
											{
												message:
													'Please select Membership status',
											},
										]}>
										<Select
											placeholder="Select Membership Status"
											defaultValue="false">
											<Select.Option value="true">
												Active
											</Select.Option>
											<Select.Option value="false">
												Inactive
											</Select.Option>
										</Select>
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
										]}>
										<Input placeholder="Enter Mobile number" />
									</Form.Item>
									<Form.Item
										label="Status"
										className="w-[49%]"
										name="status"
										initialValue={data?.isActive}>
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
										label="EHR"
										name="ehr"
										className="w-[49%]"
										rules={[
											{
												message: 'Please select EHR status',
											},
										]}>
										<Select
											placeholder="Select EHR Status"
											defaultValue="false">
											<Select.Option value="true">
												Active
											</Select.Option>
											<Select.Option value="false">
												Inactive
											</Select.Option>
										</Select>
									</Form.Item>
								</div>

								<div className="flex ">
									<Button
										loading={updateUser.isLoading}
										style={{background: '#198753'}}
										className="w-24 mr-3"
										type="primary"
										htmlType="submit">
										Update
									</Button>
									<Button
										onClick={() => router.back()}
										style={{background: '#F8F9FA', color: 'black'}}
										className="w-24"
										type="primary">
										Cancel
									</Button>
								</div>
							</Form>
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
};
