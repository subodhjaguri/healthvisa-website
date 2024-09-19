import {Layout} from '@healthvisa/components';
import {AddUserPostResponse} from '@healthvisa/models/admin/users/User';
import {useAddUser} from '@healthvisa/models/admin/users/useUser';
import {Button, Checkbox, Form, Input, message} from 'antd';
import {useRouter} from 'next/router';
import type {CheckboxChangeEvent} from 'antd/es/checkbox';
import React, {useState} from 'react';
import {log} from 'console';
import {Select} from 'antd';
import TextArea from 'antd/lib/input/TextArea';

export const CreateUserPage = () => {
	const router = useRouter();
	const addUser = useAddUser();

	const [status, setStatus] = useState(false);

	const onFinish = (values: any) => {
		console.log(values);
		// const body: AddUserPostResponse = {
		// 	mobileNumber: values.mobileNo,
		// 	name: values.name,
		// 	userName: values.userName,
		// 	metadata: {membershipDetail: []},
		// 	isActive: status,
		// };
		// addUser.mutate(body, {
		// 	onSuccess: (res) => {
		// 		message.success('Added Successfully..!');
		// 		router.push('/admin/users');
		// 	},
		// 	onError: (errors: any) => {
		// 		message.error(errors?.errors.data.message);
		// 	},
		// });
	};
	const onChange = (e: CheckboxChangeEvent) => {
		setStatus(e.target.checked);
	};
	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid   ">
				<div className="flex justify-between items-center pr-4">
					<h1 className="text-xl font-bold">Add User</h1>
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
				<div className="w-full">
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
								className="w-[49%]"
								rules={[
									{
										required: true,
										message: 'Please Enter your Name',
									},
								]}>
								<Input placeholder="Enter Name" />
							</Form.Item>
							<Form.Item
								label="User Name"
								name="userName"
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
								<Input placeholder="Enter Age" type="number" min={0} />
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
								<Select placeholder="Select Gender">
									<Select.Option value="male">Male</Select.Option>
									<Select.Option value="female">Female</Select.Option>
									<Select.Option value="other">Other</Select.Option>
								</Select>
							</Form.Item>
							<Form.Item
								label="Membership"
								name="membership"
								className="w-[49%]">
								<Select
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
									placeholder="Select Membership Status"
									defaultValue="false">
									<Select.Option value="true">Active</Select.Option>
									<Select.Option value="false">Inactive</Select.Option>
								</Select>
							</Form.Item>
						</div>

						<div className="flex justify-between flex-wrap w-full">
							<Form.Item
								label="Mobile Number"
								className="w-[49%]"
								name="mobileNo"
								rules={[
									{
										// eslint-disable-next-line prefer-regex-literals
										// pattern: new RegExp(/^[0-9]+$/),
										required: true,
										message: 'Please enter valid Mobile Number',
									},
								]}>
								<Input
									placeholder="Enter Mobile Number (Don't use 91 or +91)"
									maxLength={10}
									type="tel"
								/>
							</Form.Item>
							<Form.Item label="Status" className="w-[49%]" name="status">
								<Checkbox onChange={onChange}> Active</Checkbox>
							</Form.Item>
						</div>
						<div className="flex justify-between flex-wrap w-full">
							<Form.Item label="EHR" name="ehr" className="w-[49%]">
								<Select
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
									placeholder="Select EHR Status"
									defaultValue="false">
									<Select.Option value="true">Active</Select.Option>
									<Select.Option value="false">Inactive</Select.Option>
								</Select>
							</Form.Item>
						</div>
						<div className="flex ">
							<Button
								loading={addUser.isLoading}
								style={{background: '#198753'}}
								className="w-24 mr-3"
								type="primary"
								htmlType="submit">
								Add
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
		</Layout>
	);
};
