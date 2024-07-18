import {DynamicComponent} from '@healthvisa/components/DynamicComponents/DynamicComponent';
import {PurchaseFieldType} from '@healthvisa/models/admin/products/PurchaseFiledType';
import React, {useState} from 'react';
import {MdDelete} from 'react-icons/md';

export const PurchaseField: React.FC = () => {
	const [componentType, setComponentType] = React.useState('');
	const [field, setField] = useState<PurchaseFieldType[]>([]);
	console.log('Show final result--------------', field);

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

	return (
		<div className="flex justify-between flex-wrap w-[90%] p-4">
			<div className="w-[40%]">
				<h2>Purchase Field</h2>
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
			<div className=" flex justify-between flex-wrap w-[50%] h-auto overflow-y-hidden">
				{field.map((component) => (
					<div className="shadow-lg flex-col border rounded-lg overflow-y-hidden p-4 w-[30%] h-36 mt-8 bg-gray-100">
						<div className="flex justify-between flex-wrap">
							<h4>{component.type}</h4>
							<MdDelete color="red" onClick={() => console.log('delete')} />
						</div>
						<div>Name: {component.name}</div>
						<div>Name: {component.order}</div>
					</div>
				))}
				{/* {componentList.map((component) => (
					<div className="shadow-lg flex-col border rounded-lg overflow-y-hidden p-4 w-[30%] h-36 mt-8 bg-gray-100">
						<div className="flex justify-between flex-wrap">
							<h4>{component.title}</h4>
							<MdDelete color="red" onClick={() => console.log('delete')} />
						</div>
						<div>Name: {component.description}</div>
						<div>Name: {component.id}</div>
					</div>
				))} */}
			</div>
		</div>
	);
};
