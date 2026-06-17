import {Avatar, Badge, Menu, Popover} from 'antd';

import * as React from 'react';
import {
	SettingOutlined,
	ExportOutlined,
	BellOutlined,
} from '@ant-design/icons';
import {useRouter} from 'next/router';
import {useNotificationStore} from '@healthvisa/zustand/useNotificationStore';

export const Header = () => {
	const router = useRouter();
	const items = useNotificationStore((s) => s.items);
	const counts = useNotificationStore((s) => s.counts);
	const acknowledge = useNotificationStore((s) => s.acknowledge);
	const total = counts.orders + counts.labs + counts.requests;

	const logoutHandler = () => {
		localStorage.removeItem('@tieet-token');
		localStorage.removeItem('adminData');
		router.push('/admin');
	};

	const bellContent = (
		<div style={{width: 300}}>
			<div className="flex items-center justify-between px-1 pb-2">
				<span className="font-semibold text-black">Notifications</span>
				{items.length > 0 && (
					// eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
					<span
						onClick={() => acknowledge()}
						className="cursor-pointer text-xs text-blue-500">
						Mark all as read
					</span>
				)}
			</div>
			{items.length === 0 ? (
				<div className="text-gray-400 text-sm py-4 text-center">
					No new notifications
				</div>
			) : (
				<div style={{maxHeight: 320, overflowY: 'auto'}}>
					{items.map((it) => (
						// eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
						<div
							key={`${it.kind}-${it.id}`}
							onClick={() => {
								acknowledge();
								router.push(it.route);
							}}
							className="cursor-pointer px-2 py-2 rounded hover:bg-gray-100">
							<div className="text-sm font-medium text-black">{it.title}</div>
							<div className="text-xs text-gray-500">{it.body}</div>
						</div>
					))}
				</div>
			)}
		</div>
	);

	return (
		<div className="flex h-[4rem] shadow-lg items-center bg-white justify-end overflow-y-hidden">
			<ul className="flex flex-row items-center justify-end  px-3 m-0">
				<Popover
					placement="bottomRight"
					content={bellContent}
					trigger="click">
					<li className="flex items-center list-none mr-5 cursor-pointer">
						<Badge count={total} size="small" overflowCount={99}>
							<BellOutlined style={{fontSize: 20, color: '#4b5563'}} />
						</Badge>
					</li>
				</Popover>
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
								icon={<ExportOutlined />}>
								Logout
							</Menu.Item>
						</Menu>
					}
					trigger="click">
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
