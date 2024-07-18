import {PurchaseFieldType} from '@healthvisa/models/admin/products/PurchaseFiledType';
import {Button, Checkbox, Form, Input} from 'antd';
import * as React from 'react';

interface IDynamicComponentProps {
	title: string;
	setComponentType: (x: PurchaseFieldType) => void;
}

export const TextInput: React.FC<IDynamicComponentProps> = (props) => {
	const onFinish = async (values: any) => {
		const field = {
			name: values.name,
			order: values.orderNo,
			type: props.title,
			metadata: {
				label: values.label,
				placeholder: values.placeholder,
				maxLength: values.maxLength,
				multiline: values.multiline,
			},
		};
		props.setComponentType(field);
	};
	return (
		<div className="w-[100%] border-2 mt-4 p-3">
			<div className="flex w-[100%]">
				<h1>{props.title} available fields</h1>
			</div>
			<div className="flex w-[100%] p-4 justify-between">
				<Form
					scrollToFirstError
					layout="vertical"
					name="basic"
					className="w-full"
					initialValues={{remember: true}}
					onFinish={onFinish}
					autoComplete="off"
				>
					<Form.Item
						label="Name"
						name="name"
						className="w-[100%]"
						rules={[
							{
								required: true,
								message: 'Please enter Name',
							},
						]}
					>
						<Input placeholder="Enter Name" />
					</Form.Item>
					<Form.Item
						label="Order Number"
						name="orderNo"
						className="w-[100%]"
						rules={[
							{
								required: true,
								message: 'Please enter Order Number',
							},
						]}
					>
						<Input placeholder="Enter Order Number" />
					</Form.Item>
					<Form.Item
						label="Label Text"
						name="label"
						className="w-[100%]"
						rules={[
							{
								required: true,
								message: 'Please enter Label',
							},
						]}
					>
						<Input placeholder="Enter label" />
					</Form.Item>
					<Form.Item
						label="Placeholder Text"
						name="placeholder"
						className="w-[100%]"
					>
						<Input placeholder="Enter Placeholder Text" />
					</Form.Item>
					<Form.Item label="Max Length" name="maxLength" className="w-[100%]">
						<Input placeholder="Enter Max Length" />
					</Form.Item>
					<Form.Item
						label="Is Multiline ?"
						name="multiline"
						className="w-[100%]"
					>
						<Checkbox>Yes</Checkbox>
					</Form.Item>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form>
			</div>
		</div>
	);
};
