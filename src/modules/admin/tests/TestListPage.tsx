import {Layout} from '@healthvisa/components';
import {
	useDiagnosticItems,
	useGetLabs,
} from '@healthvisa/models/admin/lab-appointments/useLab';
import {
	useTests,
	useTestsCount,
	useUpdateTest,
} from '@healthvisa/models/admin/tests/useTest';
import {ITest} from '@healthvisa/models/admin/tests/Test';
import {
	Button,
	Form,
	Input,
	InputNumber,
	message,
	Modal,
	Select,
	Skeleton,
	Table,
} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import {formatPrice} from '@healthvisa/utils';
import React, {useEffect, useMemo, useState} from 'react';

const PAGE_SIZE = 10;

export const TestListPage = () => {
	const {data: labs} = useGetLabs();
	const {data: diagnostics} = useDiagnosticItems();
	const updateTest = useUpdateTest();
	const [form] = Form.useForm();

	const [labId, setLabId] = useState<string | undefined>();
	const [diagnosticId, setDiagnosticId] = useState<string | undefined>();
	const [searchInput, setSearchInput] = useState<string>(''); // immediate field value
	const [search, setSearch] = useState<string>(''); // debounced value used in the query
	const [page, setPage] = useState(1);
	const [editing, setEditing] = useState<ITest | null>(null);

	// Debounce the search so it filters as you type (no button / Enter needed).
	useEffect(() => {
		const t = setTimeout(() => {
			setSearch(searchInput.trim());
			setPage(1);
		}, 400);
		return () => clearTimeout(t);
	}, [searchInput]);

	const enabled = !!(labId || diagnosticId || search);
	const query = {labId, diagnosticId, search: search || undefined};
	const {data: tests, isLoading, isFetching} = useTests(
		{...query, limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE},
		enabled,
	);
	const {data: countRes} = useTestsCount(query, enabled);
	const total = countRes?.count ?? 0;

	const labMap = useMemo(() => {
		const m: Record<string, string> = {};
		(labs ?? []).forEach((l) => (m[l.id] = l.name));
		return m;
	}, [labs]);
	const diagMap = useMemo(() => {
		const m: Record<string, string> = {};
		(diagnostics ?? []).forEach((d) => (m[d.id] = d.name));
		return m;
	}, [diagnostics]);

	const resetPage = () => setPage(1);

	const openEdit = (t: ITest) => {
		setEditing(t);
		form.setFieldsValue({name: t.name, price: t.price, discount: t.discount ?? 0});
	};
	const submitEdit = async () => {
		const v = await form.validateFields();
		if (!editing) return;
		updateTest.mutate(
			{id: editing.id, name: v.name, price: v.price, discount: v.discount},
			{
				onSuccess: () => {
					message.success('Test updated');
					setEditing(null);
				},
				onError: (e: any) => {
					message.error(e?.errors?.data?.message ?? 'Failed to update');
				},
			},
		);
	};

	const columns: ColumnsType<ITest> = [
		{title: 'Name', dataIndex: 'name', key: 'name'},
		{
			title: 'Lab',
			dataIndex: 'labId',
			key: 'labId',
			render: (id: string) => labMap[id] ?? id,
		},
		{
			title: 'Diagnostic',
			dataIndex: 'diagnosticId',
			key: 'diagnosticId',
			render: (id: string) => diagMap[id] ?? id,
		},
		{
			title: 'MRP',
			dataIndex: 'price',
			key: 'price',
			render: (p: number) => `₹${formatPrice(p)}`,
		},
		{
			title: 'Discount',
			dataIndex: 'discount',
			key: 'discount',
			render: (d: number) => `${d ?? 0} %`,
		},
		{
			title: 'Discounted',
			key: 'discounted',
			render: (_, r) =>
				`₹${formatPrice(Math.round(r.price * (1 - (r.discount ?? 0) / 100)))}`,
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, r) => (
				<Button
					size="small"
					onClick={() => openEdit(r)}
					type="default"
					style={{color: '#1990FF', border: '1px solid #1990FF', padding: '0 10px'}}
					className="uppercase"
				>
					Edit
				</Button>
			),
		},
	];

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid ">
				<h1 className="text-xl font-bold mb-2">Tests</h1>

				<div className="flex flex-wrap gap-2 mb-3">
					<Select
						allowClear
						showSearch
						optionFilterProp="label"
						style={{minWidth: 240}}
						placeholder="Filter by Lab"
						value={labId}
						onChange={(v) => {
							setLabId(v);
							resetPage();
						}}
						options={(labs ?? []).map((l) => ({value: l.id, label: l.name}))}
					/>
					<Select
						allowClear
						showSearch
						optionFilterProp="label"
						style={{minWidth: 220}}
						placeholder="Filter by Diagnostic"
						value={diagnosticId}
						onChange={(v) => {
							setDiagnosticId(v);
							resetPage();
						}}
						options={(diagnostics ?? []).map((d) => ({value: d.id, label: d.name}))}
					/>
					<Input
						allowClear
						style={{maxWidth: 260}}
						placeholder="Search test name"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
				</div>

				{!enabled ? (
					<div className="text-gray-500 py-8 text-center">
						Select a Lab or Diagnostic, or search by test name, to view tests.
					</div>
				) : isLoading ? (
					<Skeleton active />
				) : (
					<Table
						size="middle"
						loading={isFetching}
						rowKey={(r) => r.id}
						columns={columns}
						dataSource={tests ?? []}
						pagination={{
							current: page,
							pageSize: PAGE_SIZE,
							total,
							showSizeChanger: false,
							onChange: setPage,
							showTotal: (t) => `${t} tests`,
						}}
						style={{width: '100%', border: '2px solid #ECECEC'}}
					/>
				)}

				<Modal
					title="Edit Test"
					visible={!!editing}
					onOk={submitEdit}
					confirmLoading={updateTest.isLoading}
					onCancel={() => setEditing(null)}
					okText="Save"
				>
					<Form form={form} layout="vertical">
						<Form.Item
							label="Name"
							name="name"
							rules={[{required: true, message: 'Enter name'}]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label="MRP (₹)"
							name="price"
							rules={[{required: true, message: 'Enter MRP'}]}
						>
							<InputNumber min={0} style={{width: '100%'}} />
						</Form.Item>
						<Form.Item label="Discount %" name="discount">
							<InputNumber min={0} max={100} style={{width: '100%'}} />
						</Form.Item>
					</Form>
				</Modal>
			</div>
		</Layout>
	);
};
