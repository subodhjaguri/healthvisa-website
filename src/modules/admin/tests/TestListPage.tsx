import {Layout} from '@healthvisa/components';
import {
	useDiagnosticItems,
	useGetLabs,
} from '@healthvisa/models/admin/lab-appointments/useLab';
import {
	useCreateTest,
	useDeleteTest,
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
	Popconfirm,
	Select,
	Skeleton,
	Table,
} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import {formatAmount, formatPrice} from '@healthvisa/utils';
import React, {useEffect, useMemo, useState} from 'react';

const PAGE_SIZE = 10;

export const TestListPage = () => {
	const {data: labs} = useGetLabs();
	const {data: diagnostics} = useDiagnosticItems();
	const updateTest = useUpdateTest();
	const createTest = useCreateTest();
	const deleteTest = useDeleteTest();
	const [form] = Form.useForm();

	const [labId, setLabId] = useState<string | undefined>();
	const [diagnosticId, setDiagnosticId] = useState<string | undefined>();
	const [searchInput, setSearchInput] = useState<string>(''); // immediate field value
	const [search, setSearch] = useState<string>(''); // debounced value used in the query
	const [page, setPage] = useState(1);
	// The modal edits an existing test, or adds a new one ('new').
	const [editing, setEditing] = useState<ITest | 'new' | null>(null);
	const isNew = editing === 'new';

	// Debounce the search so it filters as you type (no button / Enter needed).
	useEffect(() => {
		const t = setTimeout(() => {
			setSearch(searchInput.trim());
			setPage(1);
		}, 400);
		return () => clearTimeout(t);
	}, [searchInput]);

	// No filter = all tests, newest first (paged on the server, so this stays cheap).
	const query = {labId, diagnosticId, search: search || undefined};
	const {data: tests, isLoading, isFetching} = useTests(
		{...query, limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE},
		true,
	);
	const {data: countRes} = useTestsCount(query, true);
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

	const labOptions = useMemo(
		() => (labs ?? []).map((l) => ({value: l.id, label: l.name})),
		[labs],
	);
	// In the add form, offer only labs attached to the chosen diagnostic — the app
	// lists a diagnostic's tests only at those labs, so others would be unreachable.
	const addDiagnosticId = Form.useWatch('diagnosticId', form);
	const addLabOptions = useMemo(() => {
		const allowed = (diagnostics ?? []).find((d) => d.id === addDiagnosticId)?.labs;
		return allowed ? labOptions.filter((o) => allowed.includes(o.value)) : [];
	}, [diagnostics, addDiagnosticId, labOptions]);
	const diagnosticOptions = useMemo(
		() => (diagnostics ?? []).map((d) => ({value: d.id, label: d.name})),
		[diagnostics],
	);

	const resetPage = () => setPage(1);

	const openEdit = (t: ITest) => {
		setEditing(t);
		form.setFieldsValue({name: t.name, price: t.price, discount: t.discount ?? 0});
	};
	const openAdd = () => {
		setEditing('new');
		// Start from the current filters — the usual way tests are browsed.
		const allowedLabs = (diagnostics ?? []).find((d) => d.id === diagnosticId)?.labs;
		form.setFieldsValue({
			name: '',
			price: undefined,
			discount: 0,
			diagnosticId,
			labId: labId && allowedLabs?.includes(labId) ? labId : undefined,
		});
	};
	const submitEdit = async () => {
		// Invalid fields are already shown inline by the form.
		const v = await form.validateFields().catch(() => null);
		if (!v || !editing) return;
		if (isNew) {
			createTest.mutate(
				{
					name: v.name.trim(),
					price: v.price,
					discount: v.discount ?? 0,
					labId: v.labId,
					diagnosticId: v.diagnosticId,
				},
				{
					onSuccess: () => {
						message.success('Test added');
						setEditing(null);
					},
					onError: (e: any) => {
						message.error(e?.errors?.error?.message ?? 'Failed to add test');
					},
				},
			);
			return;
		}
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
			// Same per-test amount the app shows and the API charges (to the paisa).
			render: (_, r) => `₹${formatAmount(r.price * (1 - (r.discount ?? 0) / 100))}`,
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, r) => (
				<div className="flex gap-2">
					<Button
						size="small"
						onClick={() => openEdit(r)}
						className="hf-action hf-action--edit"
					>
						Edit
					</Button>
					<Popconfirm
						title="Delete this test? Existing bookings keep their own copy."
						okText="Yes"
						cancelText="No"
						onConfirm={() =>
							deleteTest.mutate(
								{id: r.id},
								{
									onSuccess: () => {
										message.success('Test deleted');
									},
									onError: (e: any) => {
										message.error(e?.errors?.error?.message ?? 'Failed to delete');
									},
								},
							)
						}
					>
						<Button size="small" className="hf-action hf-action--delete">
							Delete
						</Button>
					</Popconfirm>
				</div>
			),
		},
	];

	return (
		<Layout>
			<div className="admin-card">
				<div className="flex justify-between items-center mb-2">
					<h1 className="admin-page-title">Tests</h1>
					<Button type="primary" onClick={openAdd}>
						Add Test
					</Button>
				</div>

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
						options={labOptions}
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
						options={diagnosticOptions}
					/>
					<Input
						allowClear
						style={{maxWidth: 260}}
						placeholder="Search test name"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
				</div>

				{isLoading ? (
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
						style={{width: '100%'}}
					/>
				)}

				<Modal
					title={isNew ? 'Add Test' : 'Edit Test'}
					visible={!!editing}
					onOk={submitEdit}
					confirmLoading={updateTest.isLoading || createTest.isLoading}
					onCancel={() => setEditing(null)}
					okText={isNew ? 'Add' : 'Save'}
				>
					<Form form={form} layout="vertical">
						{isNew && (
							<>
								<Form.Item
									label="Diagnostic"
									name="diagnosticId"
									rules={[{required: true, message: 'Select a diagnostic'}]}
								>
									<Select
										showSearch
										optionFilterProp="label"
										placeholder="Select diagnostic"
										options={diagnosticOptions}
										onChange={() => form.setFieldsValue({labId: undefined})}
									/>
								</Form.Item>
								<Form.Item
									label="Lab"
									name="labId"
									rules={[{required: true, message: 'Select a lab'}]}
									extra="Only labs that offer this diagnostic (set on the Diagnostics page)."
								>
									<Select
										showSearch
										optionFilterProp="label"
										placeholder={addDiagnosticId ? 'Select lab' : 'Select a diagnostic first'}
										disabled={!addDiagnosticId}
										options={addLabOptions}
									/>
								</Form.Item>
							</>
						)}
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
