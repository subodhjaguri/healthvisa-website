import {Layout} from '@healthvisa/components';
import {
	Button,
	Descriptions,
	Drawer,
	Input,
	InputNumber,
	message,
	Modal,
	Select,
	Skeleton,
	Space,
	Switch,
	Table,
	Tag,
	Timeline,
} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import React, {useState} from 'react';
import moment from 'moment';
import {CSVLink} from 'react-csv';
import {formatPrice} from '@healthvisa/utils';
import {TableSearch} from '@healthvisa/components/TableSearch';
import {matchesSearch} from '@healthvisa/utils/tableFilter';
import {useUser} from '@healthvisa/models/admin/users/useUser';
import {IPayment} from '@healthvisa/models/admin/payments/Payment';
import {useGetPayment, useGetPayments, usePaymentActions} from '@healthvisa/models/admin/payments/usePayment';

const {TextArea} = Input;

const rupees = (paise?: number) => `₹${formatPrice((paise ?? 0) / 100)}`;

const PURPOSE: Record<string, string> = {membership: 'Membership', order: 'Doctor', lab: 'Lab'};

const STATE: Record<string, {label: string; color: string}> = {
	CREATED: {label: 'Starting', color: 'default'},
	PENDING: {label: 'Pending', color: 'gold'},
	COMPLETED: {label: 'Paid', color: 'green'},
	FAILED: {label: 'Failed', color: 'red'},
	EXPIRED: {label: 'Expired (still checked)', color: 'default'},
	STUCK: {label: 'Stuck', color: 'volcano'},
	MISMATCH: {label: 'Amount mismatch', color: 'volcano'},
};

const REFUND: Record<string, {label: string; color: string}> = {
	PENDING: {label: 'Refund in progress', color: 'gold'},
	COMPLETED: {label: 'Refunded', color: 'default'},
	FAILED: {label: 'Refund failed', color: 'red'},
};

/** Paid but the membership/booking was not updated, after several tries. */
const notApplied = (p: IPayment) =>
	p.state === 'COMPLETED' && p.applyState === 'PENDING' && (p.applyAttempts ?? 0) >= 5;

/** Rows someone should look at (design doc §7.1, §7.3, §9). */
export const needsAttention = (p: IPayment) =>
	p.state === 'STUCK' ||
	p.state === 'MISMATCH' ||
	notApplied(p) ||
	p.refundState === 'FAILED' ||
	(p.applyState === 'REFUND_REQUIRED' && (p.refundState ?? 'NONE') === 'NONE');

const refundable = (p: IPayment) =>
	(p.state === 'COMPLETED' || p.state === 'MISMATCH') &&
	(p.gatewayAmount ?? p.amount) - (p.refundedAmount ?? 0) > 0;

export const PaymentsPage = () => {
	const {data: payments, isLoading} = useGetPayments();
	const {data: users} = useUser();
	const [openId, setOpenId] = useState<string>();
	const {data: detail, isLoading: detailLoading} = useGetPayment(openId);
	const actions = usePaymentActions();
	const [search, setSearch] = useState('');
	const [purpose, setPurpose] = useState<string>();
	const [state, setState] = useState<string>();
	const [attentionOnly, setAttentionOnly] = useState(false);
	const [refundOpen, setRefundOpen] = useState(false);
	const [refundAmount, setRefundAmount] = useState<number>();
	const [refundReason, setRefundReason] = useState('');

	const userById = React.useMemo(() => new Map((users ?? []).map((u) => [u.id, u])), [users]);
	const rows = (payments ?? []).map((p) => ({
		...p,
		key: p.id,
		user: userById.get(p.userId)?.name ?? '',
		mobile: userById.get(p.userId)?.mobileNumber ?? '',
		label: p.metadata?.label ?? PURPOSE[p.purpose],
		date: moment(p.createdAt).format('DD MMM YYYY, HH:mm'),
	}));
	// What the table shows is also what Export downloads.
	const visible = rows.filter(
		(p) =>
			matchesSearch(search, [p.merchantOrderId, p.transactionId, p.user, p.mobile, p.label]) &&
			(!purpose || p.purpose === purpose) &&
			(!state || p.state === state) &&
			(!attentionOnly || needsAttention(p)),
	);
	const csv = visible.map((p) => ({
		Date: p.date,
		User: p.user,
		Mobile: p.mobile,
		For: p.label,
		Purpose: PURPOSE[p.purpose],
		Amount: (p.amount / 100).toFixed(2),
		State: STATE[p.state]?.label ?? p.state,
		Refunded: ((p.refundedAmount ?? 0) / 100).toFixed(2),
		'Refund state': p.refundState ?? 'NONE',
		'PhonePe transaction': p.transactionId ?? '',
		'Merchant order ID': p.merchantOrderId,
	}));

	const run = async (fn: () => Promise<unknown>, done: string) => {
		try {
			await fn();
			message.success(done);
		} catch (e: any) {
			message.error(e?.errors?.error?.message ?? 'Request failed');
		}
	};

	const submitRefund = () => {
		if (!detail) return;
		if (refundReason.trim().length < 3) {
			message.warning('Please add a reason for the refund.');
			return;
		}
		Modal.confirm({
			title: `Refund ${refundAmount ? `₹${formatPrice(refundAmount)}` : 'everything left'}?`,
			content: 'The money goes back to the member through PhonePe. This cannot be undone.',
			okText: 'Refund',
			okButtonProps: {danger: true},
			onOk: () =>
				run(
					() =>
						actions.refund.mutateAsync({
							id: detail.id,
							amount: refundAmount,
							reason: refundReason.trim(),
						}),
					'Refund started',
				).then(() => setRefundOpen(false)),
		});
	};

	const columns: ColumnsType<(typeof rows)[number]> = [
		{title: 'Date', dataIndex: 'date', key: 'date'},
		{
			title: 'Member',
			key: 'user',
			render: (_, p) => (
				<div>
					<div>{p.user || '—'}</div>
					<div className="text-gray-400">{p.mobile}</div>
				</div>
			),
		},
		{
			title: 'For',
			key: 'for',
			render: (_, p) => (
				<div>
					<div>{p.label}</div>
					<Tag>{PURPOSE[p.purpose]}</Tag>
				</div>
			),
		},
		{title: 'Amount', key: 'amount', render: (_, p) => <span className="font-bold">{rupees(p.amount)}</span>},
		{
			title: 'State',
			key: 'state',
			render: (_, p) => (
				<Space size={4} wrap>
					<Tag color={STATE[p.state]?.color}>{STATE[p.state]?.label ?? p.state}</Tag>
					{notApplied(p) && <Tag color="volcano">Paid – not applied</Tag>}
					{p.refundState && REFUND[p.refundState] && (
						<Tag color={REFUND[p.refundState].color}>
							{REFUND[p.refundState].label} {rupees(p.refundedAmount)}
						</Tag>
					)}
					{p.applyState === 'REFUND_REQUIRED' && (p.refundState ?? 'NONE') === 'NONE' && (
						<Tag color="volcano">Refund owed</Tag>
					)}
				</Space>
			),
		},
		{title: 'PhonePe transaction', dataIndex: 'transactionId', key: 'txn', render: (t) => t ?? '—'},
		{
			title: '',
			key: 'open',
			fixed: 'right',
			render: (_, p) => (
				<Button size="small" onClick={() => setOpenId(p.id)}>
					Details
				</Button>
			),
		},
	];

	return (
		<Layout>
			<div className="flex flex-col bg-white p-4 shadow-xl border border-[#dde4eb] border-solid ">
				<div className="flex items-center justify-between gap-2 flex-wrap mb-3">
					<h2 className="text-xl font-bold">Online Payments</h2>
					<Button type="primary">
						<CSVLink data={csv} filename="Payments" target="_blank">
							Export
						</CSVLink>
					</Button>
				</div>
				<div className="my-2 flex items-center gap-2 flex-wrap">
					<TableSearch placeholder="Search order ID, transaction, member or item" onSearch={setSearch} />
					<Select
						allowClear
						placeholder="For"
						style={{width: 150}}
						value={purpose}
						onChange={setPurpose}
						options={Object.entries(PURPOSE).map(([value, label]) => ({value, label}))}
					/>
					<Select
						allowClear
						placeholder="State"
						style={{width: 200}}
						value={state}
						onChange={setState}
						options={Object.entries(STATE).map(([value, {label}]) => ({value, label}))}
					/>
					<span className="flex items-center gap-2">
						<Switch checked={attentionOnly} onChange={setAttentionOnly} />
						Needs attention
					</span>
				</div>
				{isLoading ? (
					<Skeleton active />
				) : (
					<Table
						size="middle"
						pagination={{pageSize: 10, showSizeChanger: false}}
						columns={columns}
						dataSource={visible}
						style={{width: '100%', border: '2px solid #ECECEC'}}
						scroll={{x: 'max-content'}}
					/>
				)}
			</div>

			<Drawer width={560} title="Payment" visible={!!openId} onClose={() => setOpenId(undefined)} destroyOnClose>
				{detailLoading || !detail ? (
					<Skeleton active />
				) : (
					<>
						<Descriptions column={1} size="small" bordered>
							<Descriptions.Item label="For">{detail.metadata?.label ?? PURPOSE[detail.purpose]}</Descriptions.Item>
							<Descriptions.Item label="Amount">{rupees(detail.amount)}</Descriptions.Item>
							{detail.gatewayAmount != null && detail.gatewayAmount !== detail.amount && (
								<Descriptions.Item label="PhonePe reported">{rupees(detail.gatewayAmount)}</Descriptions.Item>
							)}
							<Descriptions.Item label="State">
								<Tag color={STATE[detail.state]?.color}>{STATE[detail.state]?.label ?? detail.state}</Tag>
								{detail.applyState && <Tag>{detail.applyState}</Tag>}
							</Descriptions.Item>
							{detail.applyError && <Descriptions.Item label="Apply error">{detail.applyError}</Descriptions.Item>}
							<Descriptions.Item label="Refunded">{rupees(detail.refundedAmount)}</Descriptions.Item>
							<Descriptions.Item label="Payment mode">{detail.paymentMode ?? '—'}</Descriptions.Item>
							<Descriptions.Item label="PhonePe transaction">{detail.transactionId ?? '—'}</Descriptions.Item>
							<Descriptions.Item label="Merchant order ID">{detail.merchantOrderId}</Descriptions.Item>
							<Descriptions.Item label="Created">{moment(detail.createdAt).format('DD MMM YYYY, HH:mm:ss')}</Descriptions.Item>
						</Descriptions>

						<Space className="my-4" wrap>
							<Button
								loading={actions.recheck.isLoading}
								onClick={() => run(() => actions.recheck.mutateAsync(detail.id), 'Checked with PhonePe')}>
								Re-check with PhonePe
							</Button>
							{detail.refundState === 'PENDING' && (
								<Button
									loading={actions.refundCheck.isLoading}
									onClick={() => run(() => actions.refundCheck.mutateAsync(detail.id), 'Refund status updated')}>
									Check refund
								</Button>
							)}
							{refundable(detail) && (
								<Button danger onClick={() => setRefundOpen(true)}>
									Refund…
								</Button>
							)}
						</Space>

						{refundOpen && (
							<div className="p-3 mb-4 border border-solid border-[#ECECEC] rounded">
								<p className="mb-2">
									Left to refund:{' '}
									<b>{rupees((detail.gatewayAmount ?? detail.amount) - (detail.refundedAmount ?? 0))}</b>. Leave
									the amount empty to refund all of it.
								</p>
								<InputNumber
									min={0.01}
									precision={2}
									prefix="₹"
									placeholder="Amount"
									style={{width: 200}}
									value={refundAmount}
									onChange={(v) => setRefundAmount(typeof v === 'number' ? v : undefined)}
								/>
								<TextArea
									className="mt-2"
									rows={3}
									placeholder="Reason (kept in the payment's history)"
									value={refundReason}
									onChange={(e) => setRefundReason(e.target.value)}
								/>
								<Space className="mt-2">
									<Button danger type="primary" loading={actions.refund.isLoading} onClick={submitRefund}>
										Refund
									</Button>
									<Button onClick={() => setRefundOpen(false)}>Cancel</Button>
								</Space>
							</div>
						)}

						{!!detail.refunds?.length && (
							<>
								<h3 className="font-bold mb-2">Refunds</h3>
								{detail.refunds.map((r) => (
									<div key={r.merchantRefundId} className="mb-2">
										<Tag color={REFUND[r.state]?.color}>{r.state}</Tag> {rupees(r.amount)} · {r.reason} ·{' '}
										{r.by === 'system' ? 'automatic' : 'staff'} · {moment(r.at).format('DD MMM, HH:mm')}
									</div>
								))}
							</>
						)}

						<h3 className="font-bold mt-4 mb-2">History</h3>
						<Timeline>
							{detail.events.map((e) => (
								<Timeline.Item key={e.id}>
									<b>{e.kind}</b> {e.detail}{' '}
									<span className="text-gray-400">{moment(e.createdAt).format('DD MMM, HH:mm:ss')}</span>
								</Timeline.Item>
							))}
						</Timeline>
					</>
				)}
			</Drawer>
		</Layout>
	);
};
