import {IAppVersion} from '@healthvisa/models/admin/appVersion/AppVersion';
import {Layout} from '@healthvisa/components';
import {
	useGetAppVersion,
	useUpdateAppVersion,
} from '@healthvisa/models/admin/appVersion/useAppVersion';
import {Button, Form, Input, InputNumber, message, Skeleton} from 'antd';
import React, {useEffect} from 'react';

/** Minimum / latest supported Android app build (REVIEW_FIX_PLAN.md Part 4). */
export const AppVersionPage = () => {
	const {data, isLoading} = useGetAppVersion();
	const update = useUpdateAppVersion();
	const [form] = Form.useForm();

	useEffect(() => {
		if (data) form.setFieldsValue(data);
	}, [data, form]);

	const onFinish = (values: IAppVersion) =>
		update.mutate(values, {
			onSuccess: () => {
				message.success('App version settings saved');
			},
			onError: (err: any) => {
				message.error(err?.errors?.error?.message || 'Could not save');
			},
		});

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid max-w-[720px]">
				<h2 className="text-xl font-bold mb-1">App versions</h2>
				<p className="text-gray-500 mb-4">
					Build numbers are the Android <b>versionCode</b> of the app on the
					Play Store. Raise &quot;Latest build&quot; after a new build is live
					to offer an optional update. Raise &quot;Minimum build&quot; only for
					breaking changes, once that build is live on Play — older builds then
					can&apos;t log in until they update.
				</p>
				{isLoading ? (
					<Skeleton active />
				) : (
					<Form form={form} layout="vertical" onFinish={onFinish}>
						<div className="flex gap-4 flex-wrap">
							<Form.Item
								label="Minimum build (must update below this)"
								name="minBuild"
								rules={[
									{
										required: true,
										message: 'Please enter the minimum build',
									},
								]}
							>
								<InputNumber min={1} precision={0} style={{width: 220}} />
							</Form.Item>
							<Form.Item
								label="Latest build (offered as optional update)"
								name="latestBuild"
								dependencies={['minBuild']}
								rules={[
									{
										required: true,
										message: 'Please enter the latest build',
									},
									({getFieldValue}) => ({
										validator: (_, value) =>
											value == null ||
											value >= getFieldValue('minBuild')
												? Promise.resolve()
												: Promise.reject(
														new Error(
															'Must be at least the minimum build',
														),
												  ),
									}),
								]}
							>
								<InputNumber min={1} precision={0} style={{width: 220}} />
							</Form.Item>
						</div>
						<Form.Item
							label="Message shown when an update is required"
							name="message"
							rules={[
								{
									required: true,
									whitespace: true,
									message: 'Please enter the message',
								},
							]}
						>
							<Input.TextArea rows={3} maxLength={300} showCount />
						</Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							loading={update.isLoading}
						>
							Save
						</Button>
					</Form>
				)}
			</div>
		</Layout>
	);
};
