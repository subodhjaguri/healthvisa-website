// Type definitions for Normalize Object 2.0.4
// Project: https://github.com/duereg/normalize-object
// Definitions by: Subham Jaguri <subham.jaguri@techlious.com>
// TypeScript Version: 4.0

declare module 'normalize-object' {
	type Casing =
		| 'upper'
		| 'lower'
		| 'snake'
		| 'pascal'
		| 'camel'
		| 'kebab'
		| 'constant'
		| 'title'
		| 'capital'
		| 'sentence';

	interface NormalizationMethod {
		(object: any, casing: Casing): any;
	}

	declare const normalize: NormalizationMethod;

	export default normalize;
}
