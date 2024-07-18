import {DynamicComponent} from '@healthvisa/components/DynamicComponents/DynamicComponent';
import {PurchaseFieldType} from '@healthvisa/models/admin/products/PurchaseFiledType';
import React, {useState} from 'react';
import {MdDelete} from 'react-icons/md';

export default function notification() {
	const [componentType, setComponentType] = React.useState('');
	const [field, setField] = useState<PurchaseFieldType[]>([]);
	console.log('field-----------------', field);
	const componentList = [
		{
			id: '1',
			title: 'DateInput',
			description: 'Calender or Date Picker',
		},
		{
			id: '2',
			title: 'SlotInput',
			description: 'Pick a time slot',
		},
		{
			id: '3',
			title: 'TimeInput',
			description: 'Time Picker',
		},
		{
			id: '4',
			title: 'TextInput',
			description: 'Input text field',
		},
		{
			id: '5',
			title: 'Checkbox',
			description: 'Checkbox to show acceptance',
		},
		{
			id: '6',
			title: 'Radio',
			description: 'List of serveral item with one selection at a time',
		},
		{
			id: '7',
			title: 'Select',
			description: 'List of serveral item with one selection at a time',
		},
	];

	const handleRemoveComponent = (value: string) => {
		const filteredArr = field.filter((val) => val.name !== value);
		setField(filteredArr);
	};

	return (
		<div className="flex justify-between flex-wrap w-[90%] p-4">
			<div className="w-[40%]">
				{componentList.map((item) => (
					<div key={item.id}>
						<DynamicComponent
							title={item.title}
							description={item.description}
							setComponentType={(val) => setComponentType(val)}
							setField={setField}
							field={field}
						/>
					</div>
				))}
			</div>
			<div className=" flex justify-between flex-wrap w-[50%] h-[30%] overflow-y-hidden">
				{field.map((component) => (
					<div className="shadow-lg flex-col border rounded-lg p-4 w-[40%] h-32 m-4 bg-gray-100">
						<div className="flex justify-between">
							<h4>{component.type}</h4>
							<MdDelete
								color="red"
								onClick={() => handleRemoveComponent(component.name)}
							/>
						</div>
						<div>Name: {component.name}</div>
						<div>Order No.: {component.order}</div>
						<div>Metadata: {component.metadata.label}</div>
						{/* {component.type === 'SlotInput' && (
							<div>{component.metadata.slots}</div>
						)} */}

						{/* <div>Name: {component.metadata}</div> */}
					</div>
				))}
			</div>
		</div>
	);
}
