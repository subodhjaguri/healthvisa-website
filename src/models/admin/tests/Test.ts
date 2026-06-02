import {ajaxGet, ajaxPatch, getApiUrl} from '@healthvisa/utils';
import {TestAPI, Service} from './api';

export interface ITest {
	id: string;
	name: string;
	price: number; // MRP
	discount?: number; // percent
	labId: string;
	diagnosticId: string;
	profiles?: string[];
	createdAt?: string;
	updatedAt?: string;
}

export interface TestQuery {
	labId?: string;
	diagnosticId?: string;
	search?: string;
	limit: number;
	skip: number;
}

const buildWhere = ({labId, diagnosticId, search}: Partial<TestQuery>) => {
	const where: Record<string, unknown> = {};
	if (labId) where.labId = labId;
	if (diagnosticId) where.diagnosticId = diagnosticId;
	if (search) where.name = {like: search, options: 'i'};
	return where;
};

export function getTests(q: TestQuery): Promise<ITest[]> {
	const filter = {
		where: buildWhere(q),
		limit: q.limit,
		skip: q.skip,
		order: ['createdAt DESC'],
	};
	return ajaxGet<ITest[]>({
		url: getApiUrl(Service, TestAPI.Tests),
		query: {filter: JSON.stringify(filter)},
	});
}

export function getTestsCount(q: Partial<TestQuery>): Promise<{count: number}> {
	return ajaxGet<{count: number}>({
		url: getApiUrl(Service, TestAPI.TestsCount),
		query: {where: JSON.stringify(buildWhere(q))},
	});
}

export interface TestUpdateRequestParams {
	id: string;
	name?: string;
	price?: number;
	discount?: number;
}
export function updateTest({
	id,
	...body
}: TestUpdateRequestParams): Promise<void> {
	return ajaxPatch<Record<string, unknown>, void>({
		data: body,
		url: `${getApiUrl(Service, TestAPI.Tests)}/${id}`,
	});
}
