import {XHRErrorResponse} from '@healthvisa/utils';
import {
	useMutation,
	UseMutationOptions,
	UseMutationResult,
	useQuery,
	useQueryClient,
	UseQueryResult,
} from 'react-query';
import {TestKeys} from './api';
import {
	createTest,
	deleteTest,
	getTests,
	getTestsCount,
	ITest,
	TestCreateRequestParams,
	TestQuery,
	TestUpdateRequestParams,
	updateTest,
} from './Test';

export function useTests(
	q: TestQuery,
	enabled: boolean,
): UseQueryResult<ITest[], XHRErrorResponse> {
	return useQuery(
		[TestKeys.GetTests, q.labId, q.diagnosticId, q.search, q.skip],
		() => getTests(q),
		{keepPreviousData: true, enabled},
	);
}

export function useTestsCount(
	q: Partial<TestQuery>,
	enabled: boolean,
): UseQueryResult<{count: number}, XHRErrorResponse> {
	return useQuery(
		[TestKeys.GetTestsCount, q.labId, q.diagnosticId, q.search],
		() => getTestsCount(q),
		{keepPreviousData: true, enabled},
	);
}

export function useUpdateTest(
	queryOptions?: Partial<
		Omit<
			UseMutationOptions<void, XHRErrorResponse, TestUpdateRequestParams>,
			'mutationFn' | 'mutationKey'
		>
	>,
): UseMutationResult<void, XHRErrorResponse, TestUpdateRequestParams> {
	const queryClient = useQueryClient();
	return useMutation((req: TestUpdateRequestParams) => updateTest(req), {
		retry: 0,
		mutationKey: [TestKeys.UpdateTest],
		...queryOptions,
		onSuccess(data, ...rest) {
			queryClient.invalidateQueries([TestKeys.GetTests]);
			return queryOptions?.onSuccess?.(data, ...rest);
		},
	});
}

// Add/delete change the list and its count, so refresh both.
const refreshTests = (queryClient: ReturnType<typeof useQueryClient>) => {
	queryClient.invalidateQueries([TestKeys.GetTests]);
	queryClient.invalidateQueries([TestKeys.GetTestsCount]);
};

export function useCreateTest(): UseMutationResult<
	ITest,
	XHRErrorResponse,
	TestCreateRequestParams
> {
	const queryClient = useQueryClient();
	return useMutation((req: TestCreateRequestParams) => createTest(req), {
		retry: 0,
		mutationKey: [TestKeys.CreateTest],
		onSuccess: () => refreshTests(queryClient),
	});
}

export function useDeleteTest(): UseMutationResult<void, XHRErrorResponse, {id: string}> {
	const queryClient = useQueryClient();
	return useMutation((req: {id: string}) => deleteTest(req), {
		retry: 0,
		mutationKey: [TestKeys.DeleteTest],
		onSuccess: () => refreshTests(queryClient),
	});
}
