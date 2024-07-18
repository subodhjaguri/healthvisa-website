import {Button, Popconfirm} from 'antd';
import React, {useState} from 'react';

export const ConfirmPopup = ({handleOk}: {handleOk: () => Promise<void>}) => {
	const [visible, setVisible] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);

	const showPopconfirm = () => {
		setVisible(true);
	};

	const OkHandler = async () => {
		setConfirmLoading(true);
		await handleOk();
		setVisible(false);
		setConfirmLoading(false);
	};

	const handleCancel = () => {
		setVisible(false);
	};

	return (
		<Popconfirm
			title="Are you sure you want to delete this row"
			visible={visible}
			onConfirm={OkHandler}
			okButtonProps={{loading: confirmLoading}}
			onCancel={handleCancel}
			okText="Delete"
		>
			{/* <Button type="primary" onClick={showPopconfirm}>
				Delete
			</Button> */}
			<Button
				size="small"
				type="default"
				style={{
					color: '#1990FF',
					border: '1px solid #1990FF',
					padding: '0 10px',
				}}
				onClick={showPopconfirm}
				className="uppercase"
			>
				Delete
			</Button>
		</Popconfirm>
	);
};
