import {Services} from '@healthvisa/utils';

export enum TestKeys {
	GetTests = 'getTests',
	GetTestsCount = 'getTestsCount',
	UpdateTest = 'updateTest',
	CreateTest = 'createTest',
	DeleteTest = 'deleteTest',
}

export enum TestAPI {
	Tests = '/tests',
	TestsCount = '/tests/count',
}

export const Service: Services = 'product';
