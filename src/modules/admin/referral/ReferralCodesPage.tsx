import {Layout} from '@healthvisa/components';
import {
	useAddReferralCode,
	useDeleteReferralCode,
	useGetReferralCodes,
	useUpdateReferralCode,
} from '@healthvisa/models/admin/referral/useReferral';
import {IReferralCode} from '@healthvisa/models/admin/referral/Referral';
import {useUser} from '@healthvisa/models/admin/users/useUser';
import {
	Button,
	Form,
	Input,
	message,
	Modal,
	Popconfirm,
	Skeleton,
	Space,
	Switch,
	Table,
} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import moment from 'moment';
import React, {useEffect, useMemo, useState} from 'react';

export const ReferralCodesPage = () => {
	const {isLoading, data: codes} = useGetReferralCodes();
	const {data: users} = useUser();
	const addReferralCode = useAddReferralCode();
	const updateReferralCode = useUpdateReferralCode();
	const deleteReferralCode = useDeleteReferralCode();

	// Per-code count of users attributed to a referral code (set at
	// registration or first membership). Keyed by uppercased code.
	const userTally = useMemo(() => {
		const tally: Record<string, number> = {};
		(users || []).forEach((user) => {
			if (!user?.referralCode) {
				return;
			}
			const key = String(user.referralCode).toUpperCase();
			tally[key] = (tally[key] ?? 0) + 1;
		});
		return tally;
	}, [users]);

	const [form] = Form.useForm();
	const [modalOpen, setModalOpen] = useState(false);
	const [editing, setEditing] = useState<IReferralCode | null>(null);
	const saving = addReferralCode.isLoading || updateReferralCode.isLoading;

	useEffect(() => {
		if (!modalOpen) {
			return;
		}
		if (editing) {
			form.setFieldsValue({
				referrerName: editing.referrerName,
				isActive: editing.isActive ?? true,
				notes: editing.notes ?? '',
			});
		} else {
			form.resetFields();
		}
	}, [modalOpen, editing, form]);

	const openCreate = () => {
		setEditing(null);
		setModalOpen(true);
	};

	const openEdit = (record: IReferralCode) => {
		setEditing(record);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setEditing(null);
	};

	const onFinish = (values: any) => {
		const payload = {
			referrerName: values.referrerName,
			isActive: values.isActive ?? true,
			notes: values.notes || undefined,
		};

		if (editing) {
			updateReferralCode.mutate(
				{id: editing.id, ...payload},
				{
					onSuccess: () => {
						message.success('Referral code updated');
						closeModal();
					},
					onError: (err: any) => {
						message.error(
							err?.errors?.error?.message ?? 'Failed to update referral code',
						);
					},
				},
			);
		} else {
			// Send a typed custom code if provided; otherwise let the server generate.
			const createPayload = values.code?.trim()
				? {...payload, code: values.code.trim()}
				: payload;
			addReferralCode.mutate(createPayload, {
				onSuccess: () => {
					message.success('Referral code created');
					closeModal();
				},
				onError: (err: any) => {
					message.error(
						err?.errors?.error?.message ?? 'Failed to create referral code',
					);
				},
			});
		}
	};

	const handleDelete = (id: string) => {
		deleteReferralCode.mutate(
			{id},
			{
				onSuccess: () => {
					message.success('Deleted Successfully..!');
				},
				onError: (err: any) => {
					message.error(err?.errors?.error?.message ?? 'Failed to delete');
				},
			},
		);
	};

	const toggleActive = (record: IReferralCode, isActive: boolean) => {
		updateReferralCode.mutate(
			{id: record.id, isActive},
			{
				onSuccess: () => {
					message.success(isActive ? 'Referral code active' : 'Referral code disabled');
				},
				onError: (err: any) => {
					message.error(err?.errors?.error?.message ?? 'Failed to update');
				},
			},
		);
	};

	const columns: ColumnsType<IReferralCode> = [
		{title: 'Code', dataIndex: 'code', key: 'code'},
		{title: 'Referrer Name', dataIndex: 'referrerName', key: 'referrerName'},
		{
			title: 'Active',
			key: 'isActive',
			render: (_, record) => (
				<Switch
					checked={record.isActive ?? true}
					loading={updateReferralCode.isLoading}
					onChange={(checked) => toggleActive(record, checked)}
				/>
			),
		},
		{
			title: 'Users',
			key: 'users',
			render: (_, record) => userTally[record.code?.toUpperCase()] ?? 0,
		},
		{
			title: 'Created On',
			key: 'createdAt',
			render: (_, record) =>
				record.createdAt ? moment(record.createdAt).format('DD MMM YYYY') : '—',
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<Space size="middle">
					<Button
						size="small"
						onClick={() => openEdit(record)}
						type="default"
						style={{color: '#1990FF', border: '1px solid #1990FF', padding: '0 10px'}}
						className="uppercase">
						Edit
					</Button>
					<Popconfirm
						title="Delete this referral code? This cannot be undone."
						okText="Yes"
						okType="danger"
						cancelText="No"
						onConfirm={() => handleDelete(record.id)}>
						<Button
							size="small"
							type="default"
							style={{color: 'red', border: '1px solid red', padding: '0 10px'}}
							className="uppercase">
							Delete
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid ">
				<div className="flex items-center justify-between gap-2 flex-wrap mb-3">
					<h1 className="text-xl font-bold">Referrals</h1>
					<Button type="primary" onClick={openCreate}>
						Create Referral
					</Button>
				</div>

				{isLoading ? (
					<Skeleton active />
				) : (
					<Table
						size="middle"
						rowKey={(obj) => obj.id}
						pagination={{pageSize: 7, showSizeChanger: false}}
						columns={columns}
						dataSource={codes ?? []}
						style={{width: '100%', border: '2px solid #ECECEC'}}
					/>
				)}
			</div>

			<Modal
				title={editing ? 'Edit Referral' : 'Create Referral'}
				visible={modalOpen}
				onCancel={closeModal}
				okText={editing ? 'Save' : 'Create'}
				confirmLoading={saving}
				onOk={() => form.submit()}
				destroyOnClose>
				<Form
					form={form}
					layout="vertical"
					name="referral-form"
					onFinish={onFinish}
					autoComplete="off"
					initialValues={{isActive: true}}>
					{editing ? (
						<Form.Item label="Code">
							<Input value={editing.code} disabled />
						</Form.Item>
					) : (
						<Form.Item
							label="Code (optional)"
							name="code"
							extra="Leave blank to auto-generate a code.">
							<Input placeholder="e.g. an existing code" />
						</Form.Item>
					)}
					<Form.Item
						label="Referrer Name"
						name="referrerName"
						rules={[{required: true, message: 'Please enter the referrer name'}]}>
						<Input placeholder="e.g. City Hospital / MedPlus Pharmacy" />
					</Form.Item>
					<Form.Item label="Active" name="isActive" valuePropName="checked">
						<Switch />
					</Form.Item>
					<Form.Item label="Notes" name="notes">
						<Input.TextArea rows={3} placeholder="Optional notes" />
					</Form.Item>
				</Form>
			</Modal>
		</Layout>
	);
};
