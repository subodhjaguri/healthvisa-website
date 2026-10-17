import {Avatar, Badge, Menu, Popover} from 'antd';

import * as React from 'react';
import {ExportOutlined, BellOutlined, DownOutlined} from '@ant-design/icons';
import {useRouter} from 'next/router';
import {useNotificationStore} from '@healthvisa/zustand/useNotificationStore';
import {findAdminNav} from '@healthvisa/constants/adminNav';
import {AdminInfo} from '@healthvisa/models/admin/auth/Auth';
import {getLocalStorage} from '@healthvisa/utils/localstorage';

/** Name/email saved at login (see pages/admin/index.tsx). */
const useAdminInfo = () => {
	const [admin, setAdmin] = React.useState<Partial<AdminInfo>>({});
	React.useEffect(() => {
		try {
			setAdmin(getLocalStorage<AdminInfo>('adminData') ?? {});
		} catch {
			setAdmin({});
		}
	}, []);
	return admin;
};

export const Header = () => {
	const router = useRouter();
	const items = useNotificationStore((s) => s.items);
	const counts = useNotificationStore((s) => s.counts);
	const acknowledge = useNotificationStore((s) => s.acknowledge);
	const dismiss = useNotificationStore((s) => s.dismiss);
	const total = counts.orders + counts.labs + counts.requests;

	const admin = useAdminInfo();
	const displayName = admin.name || admin.email || 'HealthiFam Admin';
	const nav = findAdminNav(router.pathname);
	const isSubPage = nav && router.pathname !== nav.item.path;

	const logoutHandler = () => {
		localStorage.removeItem('@healthifam-token');
		localStorage.removeItem('adminData');
		router.push('/admin');
	};

	const bellContent = (
		<div style={{width: 320}}>
			<div className="flex items-center justify-between px-1 pb-2">
				<span className="font-semibold text-slate-800">Notifications</span>
				{items.length > 0 && (
					// eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
					<span
						onClick={() => acknowledge()}
						className="cursor-pointer text-xs hf-link"
					>
						Mark all as read
					</span>
				)}
			</div>
			{items.length === 0 ? (
				<div className="text-slate-400 text-sm py-6 text-center">
					<BellOutlined style={{fontSize: 22}} />
					<div className="mt-2">You&apos;re all caught up</div>
				</div>
			) : (
				<div style={{maxHeight: 320, overflowY: 'auto'}}>
					{items.map((it) => (
						// eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
						<div
							key={`${it.kind}-${it.id}`}
							onClick={() => {
								dismiss(it);
								router.push(it.route);
							}}
							className="cursor-pointer px-2 py-2 rounded-lg hover:bg-slate-50"
						>
							<div className="text-sm font-medium text-slate-800">
								{it.title}
							</div>
							<div className="text-xs text-slate-500">{it.body}</div>
						</div>
					))}
				</div>
			)}
		</div>
	);

	return (
		<header className="hf-header">
			<div className="min-w-0">
				<div className="hf-header__crumb">
					{nav ? nav.group.title : 'Admin'}
					{isSubPage && (
						<>
							<span className="mx-1">/</span>
							{nav.item.label}
						</>
					)}
				</div>
				<div className="hf-header__title truncate">
					{nav?.item.label ?? 'HealthiFam Admin'}
				</div>
			</div>
			<div className="flex items-center gap-2">
				<Popover placement="bottomRight" content={bellContent} trigger="click">
					<button
						type="button"
						className="hf-icon-btn"
						aria-label="Notifications"
					>
						<Badge count={total} size="small" overflowCount={99}>
							<BellOutlined style={{fontSize: 18, color: '#475569'}} />
						</Badge>
					</button>
				</Popover>
				<div className="w-px h-6 bg-slate-200 mx-2" />
				<Popover
					placement="bottomRight"
					content={
						<Menu
							style={{border: 'none'}}
							items={[
								{
									key: 'logout',
									icon: <ExportOutlined />,
									label: 'Logout',
									onClick: logoutHandler,
								},
							]}
						/>
					}
					trigger="click"
				>
					<button type="button" className="hf-user-btn">
						<Avatar size={34} style={{background: 'var(--hf-primary)'}}>
							{displayName.charAt(0).toUpperCase()}
						</Avatar>
						<span className="hidden md:flex flex-col items-start leading-tight">
							<span className="text-sm font-medium text-slate-800 max-w-[180px] truncate">
								{displayName}
							</span>
							<span className="text-xs text-slate-400">Administrator</span>
						</span>
						<DownOutlined style={{fontSize: 10, color: '#94a3b8'}} />
					</button>
				</Popover>
			</div>
		</header>
	);
};
