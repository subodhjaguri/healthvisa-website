import {Layout} from '@healthvisa/components';
import {UserUpdateRequestParams} from '@healthvisa/models/admin/users/User';
import {
	useUpdateMembershipExpiry,
	useUpdateUser,
	useUserById,
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
} from 'antd';

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
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
};
