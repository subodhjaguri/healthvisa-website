// import {LoginRequestParams, useLogin} from '@tieet/models/admin/useLogin';
// import {useAdminData} from '@tieet/zustand/useAdmindata';
import {Button, Checkbox, Form, Input, message} from 'antd';
import {useRouter} from 'next/router';
import React from 'react';

const login = () => {
	// const setAdminData = useAdminData((state) => state.setAdminData);
	const router = useRouter();
	// const loginAccount = useLogin();
	const onFinish = (values: any) => {
		// console.log('values: ', values);

		// Creds for admin login
		if (values.email === 'healthifam@admin.com' && values.password === '12345') {
			router.push('/admin/dashboard');
		} else {
			message.error('Invalid credentials');
		}
	};

	return (
		<div className="w-screen h-screen flex flex-col justify-center items-center bg-slate-300">
			<h1 className="text-5xl text-white">HealthVisa</h1>
			<div className="shadow-2xl p-7 bg-white w-[500px]">
				<h1 className="text-center text-xl">Sign in</h1>
				<Form
					scrollToFirstError
					layout="vertical"
					name="basic"
					initialValues={{remember: true}}
					onFinish={onFinish}
					autoComplete="off"
				>
					<Form.Item
						label="Email"
						name="email"
						rules={[{required: true, message: 'Please input your username!'}]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Password"
						name="password"
						rules={[{required: true, message: 'Please input your password!'}]}
					>
						<Input.Password />
					</Form.Item>

					<div className="flex justify-center">
						<Button
							// loading={loginAccount.isLoading}
							// disabled={loginAccount.isLoading}
							style={{width: '100%'}}
							type="primary"
							htmlType="submit"
						>
							Login
						</Button>
					</div>
				</Form>
			</div>
		</div>
	);
};

export default login;
