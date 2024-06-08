export function pipe<A0, A1>(arg0: A0, arg1: (arg0: A0) => A1): A1;
export function pipe<A0, A1, A2>(arg0: A0, arg1: (arg0: A0) => A1, arg2: (arg1: A1) => A2): A2;
export function pipe(arg0: unknown, ...fns: Array<(arg: unknown) => unknown>) {
	return fns.reduce((prev, curr) => curr(prev), arg0);
}

export const is = {
	recordOrArray: (val: unknown): val is object => {
		return typeof (val) === 'object' && val !== null && !(val instanceof Date);
	},
	number: (val: unknown): val is number => {
		return typeof (val) === 'number';
	},
	boolean: (val: unknown): val is boolean => {
		return typeof (val) === 'boolean';
	},
	string: (val: unknown): val is string => {
		return typeof (val) === 'string';
	},
	primitive: (val: unknown): val is string | number | boolean => {
		return typeof (val) === 'string' || typeof (val) === 'number' || typeof (val) === 'boolean';
	},
	undefined: (val: unknown): val is undefined => {
		return val === undefined;
	},
	null: (val: unknown): val is null => {
		return val === null;
	},
	date: (val: unknown): val is Date => {
		return val instanceof Date;
	},
	record: (val: unknown): val is Record<string, unknown> => {
		return typeof (val) === 'object' && val !== null && !Array.isArray(val) && !(val instanceof Date);
	},
	array: <T>(val: unknown): val is Array<T> => {
		return Array.isArray(val);
	},
	function: <A extends Array<unknown>, R>(val: unknown): val is (...a: A) => R => {
		return typeof (val) === 'function';
	},
	nullOrUndefined: (val: unknown): val is null | undefined => {
		return val === null || val === undefined;
	},
	scalar: (val: unknown): val is 'number' | 'string' | 'boolean' | 'date' | 'null' | 'undefined' => {
		return typeof (val) === 'string' || typeof (val) === 'number' || typeof (val) === 'boolean' || val === null || val === undefined || val instanceof Date;
	},
	htmlElement: (val: unknown): val is HTMLElement => {
		return val instanceof HTMLElement;
	},
}

export const PromiseObject = async <T extends object>(obj: { [K in keyof T]: Promise<T[K]> }) => {
	const keys = Object.keys(obj) as (keyof T)[];
	const arr = await Promise.all(keys.map(key => obj[key]));
	return keys.reduce((acc, key, i) => ({ ...acc, [key]: arr[i] }), {} as T);
};
