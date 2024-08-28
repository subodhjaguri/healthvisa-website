import {Avatar, Badge, Menu, Popover} from 'antd';

import * as React from 'react';
import {
	UserOutlined,
	SettingOutlined,
	MailOutlined,
	LockOutlined,
	ExportOutlined,
	BellOutlined,
} from '@ant-design/icons';
import {useRouter} from 'next/router';

export const Header = () => {
	const router = useRouter();
	const logoutHandler = () => {
		localStorage.removeItem('@tieet-token');
		localStorage.removeItem('adminData');
		router.push('/admin');
	};
	return (
		<div className="flex h-[4rem] shadow-lg items-center bg-white justify-end overflow-y-hidden">
			<ul className="flex flex-row items-center justify-end  px-3 m-0">
				<Popover
					placement="bottomRight"
					content={
						<Menu>
							<Menu.Item key="one" icon={<SettingOutlined />}>
								Settings
							</Menu.Item>

							<Menu.Item
								onClick={logoutHandler}
								key="five"
								icon={<ExportOutlined />}
							>
								Logout
							</Menu.Item>
						</Menu>
					}
					trigger="click"
				>
					<li className="flex flex-row justify-between items-center list-none text-black">
						<Avatar src="https://joeschmoe.io/api/v1/random" />
						<span className="text-base mx-2 cursor-pointer hover:text-blue-500">
							Healthifam Admin
						</span>
					</li>
				</Popover>
			</ul>
		</div>
	);
};
