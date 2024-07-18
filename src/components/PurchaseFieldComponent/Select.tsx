import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {PurchaseFieldType} from '@healthvisa/models/admin/products/PurchaseFiledType';
import {Button, Form, Input, Space} from 'antd';
import * as React from 'react';

interface IDynamicComponentProps {
	title: string;
	setComponentType: (x: PurchaseFieldType) => void;
}

export const Select: React.FC<IDynamicComponentProps> = (props) => {
	const onFinish = async (values: any) => {
		const field = {
			name: values.name,
			order: values.orderNo,
			type: props.title,
			metadata: {
				label: values.label,
				options: [{label: values.options, id: values.options}],
			},
		};
		console.log('field-----------------------', field);
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
					<Form.List name="options">
						{(fields, {add, remove}) => (
							<>
								{fields.map(({key, name, ...restField}) => (
									<Space
										key={key}
										style={{
											display: 'flex',
											marginBottom: 8,
										}}
										align="baseline"
									>
										<Form.Item
											// eslint-disable-next-line react/jsx-props-no-spreading
											// {...restField}
											label="Add option"
											className="w-[100%]"
											name={[name, 'option']}
											rules={[
												{
													required: true,
													message: 'Add option',
												},
											]}
										>
											<Input placeholder="Add options" />
										</Form.Item>

										<MinusCircleOutlined
											onClick={() => remove(name)}
										/>
									</Space>
								))}
								<Form.Item>
									<Button
										type="dashed"
										onClick={() => add()}
										block
										icon={<PlusOutlined />}
									>
										Add options
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form>
			</div>
		</div>
	);
};
