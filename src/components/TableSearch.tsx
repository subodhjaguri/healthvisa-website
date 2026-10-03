import {SearchOutlined} from '@ant-design/icons';
import {Input} from 'antd';
import React, {useEffect, useState} from 'react';

/**
 * Search box for the admin list pages. Filters as you type (debounced) and
 * reports the trimmed text; the page does the matching (see matchesSearch).
 */
export const TableSearch = ({
	placeholder,
	onSearch,
	width,
}: {
	placeholder: string;
	onSearch: (query: string) => void;
	width?: number;
}) => {
	const [value, setValue] = useState('');
	useEffect(() => {
		const t = setTimeout(() => onSearch(value.trim()), 250);
		return () => clearTimeout(t);
	}, [value, onSearch]);
	return (
		<Input
			allowClear
			prefix={<SearchOutlined />}
			placeholder={placeholder}
			value={value}
			onChange={(e) => setValue(e.target.value)}
			style={{width}}
		/>
	);
};
TableSearch.defaultProps = {
	width: 280,
};
