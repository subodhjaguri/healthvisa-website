import {Button, Form, Input, message} from 'antd';
import {useRouter} from 'next/router';
import React from 'react';
import {useAdminLogin} from '@healthvisa/models/admin/auth/useAuth';

const Login = () => {
	const router = useRouter();
	const loginAccount = useAdminLogin();

	// Already signed in → skip the form.
	React.useEffect(() => {
		if (localStorage.getItem('@healthifam-token')) {
			router.replace('/admin/dashboard');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onFinish = (values: {email: string; password: string}) => {
		loginAccount.mutate(
			{email: values.email, password: values.password},
			{
				onSuccess: (data) => {
					localStorage.setItem('@healthifam-token', data.accessToken);
					localStorage.setItem('adminData', JSON.stringify(data.admin));
					router.push('/admin/dashboard');
				},
				onError: () => {
					message.error('Invalid email or password');
				},
			},
		);
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
						rules={[{required: true, message: 'Please input your email!'}]}
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
							loading={loginAccount.isLoading}
							disabled={loginAccount.isLoading}
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

export default Login;
