import {Tooltip} from 'antd';
import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons';
import {ADMIN_NAV, findAdminNav} from '@healthvisa/constants/adminNav';
import {getLocalStorage, setLocalStorage} from '@healthvisa/utils/localstorage';

const COLLAPSE_KEY = '@healthifam-sidebar-collapsed';

export const DrawerComponent = () => {
	const router = useRouter();
	const activePath = findAdminNav(router.pathname)?.item.path;

	const [collapsed, setCollapsed] = React.useState(false);
	React.useEffect(() => {
		try {
			setCollapsed(getLocalStorage<boolean>(COLLAPSE_KEY) === true);
		} catch {
			// storage unavailable: stay expanded
		}
	}, []);
	// Keep the current page's entry visible on short screens.
	React.useEffect(() => {
		document
			.querySelector('.hf-sidebar__item--active')
			?.scrollIntoView({block: 'nearest'});
	}, [activePath]);
	const toggle = () => {
		const next = !collapsed;
		setCollapsed(next);
		try {
			setLocalStorage(COLLAPSE_KEY, next);
		} catch {
			// storage unavailable: the choice just isn't remembered
		}
	};

	return (
		<aside className={`hf-sidebar ${collapsed ? 'hf-sidebar--collapsed' : ''}`}>
			<div className="hf-sidebar__brand">
				<Link href="/admin/dashboard">
					{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
					<a className="flex items-center">
						<img
							src="/images/Logo.png"
							alt="HealthiFam"
							className={
								collapsed
									? 'h-7 w-10 object-cover object-left'
									: 'h-9 w-auto object-contain'
							}
						/>
					</a>
				</Link>
			</div>

			<nav className="hf-sidebar__nav">
				{ADMIN_NAV.map((group) => (
					<div key={group.title} className="hf-sidebar__group">
						<div className="hf-sidebar__group-title">
							{collapsed ? '•' : group.title}
						</div>
						{group.items.map((item) => {
							const link = (
								<Link key={item.path} href={item.path}>
									{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
									<a
										className={`hf-sidebar__item ${
											activePath === item.path
												? 'hf-sidebar__item--active'
												: ''
										}`}
									>
										<span className="hf-sidebar__icon">
											{item.icon}
										</span>
										{!collapsed && (
											<span className="truncate">{item.label}</span>
										)}
									</a>
								</Link>
							);
							// Labels are hidden when collapsed, so show them on hover.
							return collapsed ? (
								<Tooltip
									key={item.path}
									title={item.label}
									placement="right"
								>
									<div>{link}</div>
								</Tooltip>
							) : (
								link
							);
						})}
					</div>
				))}
			</nav>

			<button type="button" className="hf-sidebar__toggle" onClick={toggle}>
				{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
				{!collapsed && <span>Collapse</span>}
			</button>
		</aside>
	);
};
