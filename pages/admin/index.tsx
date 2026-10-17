import {Button, Form, Input, message} from 'antd';
import {LockOutlined, MailOutlined} from '@ant-design/icons';
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
				onError: (err: any) => {
					// Backend message covers both bad credentials and the 429 lockout.
					message.error(err?.errors?.error?.message ?? 'Invalid email or password');
				},
			},
		);
	};

	return (
		<div className="hf-login">
			<div className="hf-login__brand">
				<div className="hf-login__brand-inner">
					<span className="hf-login__logo">
						<img src="/images/Logo.png" alt="HealthiFam" className="h-10 w-auto" />
					</span>
					<h1 className="text-3xl font-semibold text-white mt-10 mb-3 leading-snug">
						Care for every family,
						<br />
						managed in one place.
					</h1>
					<p className="text-white/80 text-sm max-w-sm">
						Confirm appointments, approve memberships, manage the catalog and keep
						members informed: the HealthiFam admin console.
					</p>
				</div>
				<span className="text-white/60 text-xs">© {new Date().getFullYear()} HealthiFam</span>
			</div>

			<div className="hf-login__form">
				<div className="w-full max-w-[380px]">
					<h2 className="text-2xl font-semibold text-slate-800 mb-1">Sign in</h2>
					<p className="text-sm text-slate-500 mb-8">Use your staff email and password.</p>
					<Form
						scrollToFirstError
						layout="vertical"
						name="basic"
						requiredMark={false}
						initialValues={{remember: true}}
						onFinish={onFinish}
						autoComplete="off"
					>
						<Form.Item
							label="Email"
							name="email"
							rules={[{required: true, message: 'Please input your email!'}]}
						>
							<Input size="large" prefix={<MailOutlined className="text-slate-400" />} placeholder="you@healthifam.in" />
						</Form.Item>

						<Form.Item
							label="Password"
							name="password"
							rules={[{required: true, message: 'Please input your password!'}]}
						>
							<Input.Password size="large" prefix={<LockOutlined className="text-slate-400" />} placeholder="Password" />
						</Form.Item>

						<Button
							loading={loginAccount.isLoading}
							disabled={loginAccount.isLoading}
							block
							size="large"
							type="primary"
							htmlType="submit"
							className="mt-2"
						>
							Sign in
						</Button>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default Login;
