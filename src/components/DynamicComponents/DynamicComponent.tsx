import {PurchaseFieldType} from '@healthvisa/models/admin/products/PurchaseFiledType';
import {Button} from 'antd';
import * as React from 'react';
import {useState} from 'react';
import {
	Checkbox,
	DateInput,
	Radio,
	Select,
	SlotInput,
	TextInput,
	TimeInput,
} from '../PurchaseFieldComponent';

interface IDynamicComponentProps {
	title: string;
	description: string;
	setComponentType: (x: string) => void;
	setField: (x: PurchaseFieldType[]) => void;
	field: PurchaseFieldType[];
}

export const DynamicComponent: React.FC<IDynamicComponentProps> = (props) => {
	const [component, setComponent] = useState('');
	const handlePurchaseComponent = (value: string) => {
		console.log('value-----------------', value);
		props.setComponentType('');
		setComponent('');

		props.setComponentType(value);
		setComponent(value);
	};
	const handlePurchaseComponentCancel = (value: string) => {
		props.setComponentType('');
		setComponent('');
	};

	const getComponent = (type: string) => {
		switch (type) {
			case 'DateInput':
				return (
					<DateInput
						title={type}
						setComponentType={(val) => props.setField([...props.field, val])}
					/>
				);
			case 'SlotInput':
				return (
					<SlotInput
						title={type}
						setComponentType={(val) => props.setField([...props.field, val])}
					/>
				);
			case 'TimeInput':
				return (
					<TimeInput
						title={type}
						setComponentType={(val) => props.setField([...props.field, val])}
					/>
				);
			case 'TextInput':
				return (
					<TextInput
						title={type}
						setComponentType={(val) => props.setField([...props.field, val])}
					/>
				);
			case 'Checkbox':
				return (
					<Checkbox
						title={type}
						setComponentType={(val) => props.setField([...props.field, val])}
					/>
				);
			case 'Radio':
				return (
					<Radio
						title={type}
						setComponentType={(val) => props.setField([...props.field, val])}
					/>
				);
			case 'Select':
				return (
					<Select
						title={type}
						setComponentType={(val) => props.setField([...props.field, val])}
					/>
				);

			default:
				return <div />;
		}
	};

	return (
		<div className="shadow-lg bg-white flex-col border rounded-lg overflow-y-hidden mt-4 p-4 w-[100%]">
			<div>
				<h1>{props.title}</h1>
			</div>
			<div>{props.description}</div>
			<div>
				<Button onClick={() => handlePurchaseComponent(props.title)}>
					Add +
				</Button>
				<Button onClick={() => handlePurchaseComponentCancel(props.title)}>
					Cancel
				</Button>
			</div>
			{getComponent(component)}
			{/* {component === 'DateInput' && <DateInput title="Hi" />} */}
		</div>
	);
};
