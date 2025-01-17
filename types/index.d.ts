type DeepMergeFn = <T1, T2>(target: T1, source: T2) => DeepMerge<T1, T2>
type DeepMergeAllFn = <T extends Array<any>>(
  ...targets: T
) => AllRecordsMatchDeepPartial<T> extends true ? First<T> : DeepMergeAll<{}, T>

/**
 * A utility type that recursively makes all properties of an object optional.
 * If a property is itself a nested object, DeepPartial is applied to it as well.
 *
 * @example
 * type User = {
 *   name: string;
 *   address: {
 *     city: string;
 *     zip: number;
 *   };
 * };
 *
 * type PartialUser = DeepPartial<User>;
 * // Resulting type:
 * // {
 * //   name?: string;
 * //   address?: {
 * //     city?: string;
 * //     zip?: number;
 * //   };
 * // }
 */
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown> ? DeepPartial<T[K]> : Partial<T[K]>
}

/**
 * A type utility that checks if T is a record (an object with string keys and any values).
 * If T is a record, it evaluates to true; otherwise, it evaluates to false.
 *
 * @example
 * type Test1 = IsRecord<{ key: string }>; // true
 * type Test2 = IsRecord<string>; // false
 */
type IsRecord<T> = T extends Record<string, any> ? true : false

/**
 * A type utility that verifies whether all elements in a tuple or array T are records.
 * It recursively checks each element in the array.
 *
 * @example
 * type Test1 = AllRecords<[{ a: number }, { b: string }]>; // true
 * type Test2 = AllRecords<[{ a: number }, string]>; // false
 * type Test3 = AllRecords<[]>; // true (an empty array passes the check)
 */
type AllRecords<T extends Array<any>> = T extends [infer F, ...infer R]
  ? IsRecord<F> extends true
    ? R extends [] // If no more elements, return true
      ? true
      : AllRecords<R> // Recursively check the remaining elements
    : false
  : true

/**
 * A type utility that checks whether all elements in an array T are deep partials of the first element.
 *
 * @example
 * type User = {
 *   name: string;
 *   age: number;
 * };
 *
 * type Test1 = AllDeepPartials<[User, { name?: string }]>; // true
 * type Test2 = AllDeepPartials<[User, { name: string; extra: boolean }]>; // false
 * type Test3 = AllDeepPartials<[]>; // false (empty array fails the check)
 */
type AllDeepPartials<T extends Array<any>> = T extends [infer First, ...infer Rest]
  ? Rest extends { [index: number]: DeepPartial<First> } // Check if all following objects are DeepPartial<First>
    ? true
    : false
  : false

/**
 * A type utility that combines the checks of AllRecords and AllDeepPartials.
 * First, it verifies if all elements in the array are records.
 * Then, it ensures all elements are deep partials of the first element.
 *
 * @example
 * type User = {
 *   name: string;
 *   age: number;
 * };
 *
 * type Test1 = AllRecordsMatchDeepPartial<[User, { name?: string }]>; // true
 * type Test2 = AllRecordsMatchDeepPartial<[User, { name: string; extra: boolean }]>; // false
 * type Test3 = AllRecordsMatchDeepPartial<[string, { name?: string }]>; // false
 * type Test4 = AllRecordsMatchDeepPartial<[]>; // false (empty array fails the check)
 */
type AllRecordsMatchDeepPartial<T extends Array<any>> = AllRecords<T> extends true
  ? AllDeepPartials<T> extends true
    ? true
    : false
  : false

type Primitive = null | undefined | string | number | boolean | symbol | bigint

type BuiltIns = Primitive | Date | RegExp

type MergeArrays<T, U> = T extends readonly any[]
  ? U extends readonly any[]
    ? [...T, ...U]
    : never
  : never

type DifferenceKeys<
  T,
  U,
  T0 = Omit<T, keyof U> & Omit<U, keyof T>,
  T1 = { [K in keyof T0]: T0[K] }
> = T1

type IntersectionKeys<T, U> = Omit<T | U, keyof DifferenceKeys<T, U>>

type DeepMergeHelper<
  T,
  U,
  T0 = DifferenceKeys<T, U>
  & { [K in keyof IntersectionKeys<T, U>]: DeepMerge<T[K], U[K]> },
  T1 = { [K in keyof T0]: T0[K] }
  > = T1

type DeepMerge<T, U> =
  U extends BuiltIns
    ? U
    : [T, U] extends [readonly any[], readonly any[]]
        ? MergeArrays<T, U>
        : [T, U] extends [{ [key: string]: unknown }, { [key: string]: unknown }]
            ? DeepMergeHelper<T, U>
            : U

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type First<T> = T extends [infer _I, ...infer _Rest] ? _I : never

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Rest<T> = T extends [infer _I, ...infer _Rest] ? _Rest : never

type DeepMergeAll<R, T> = First<T> extends never
  ? R
  : DeepMergeAll<DeepMerge<R, First<T>>, Rest<T>>

type MergeArrayFnOptions = {
  clone: (value: any) => any;
  isMergeableObject: (value: any) => boolean;
  deepmerge: DeepMergeFn;
  getKeys: (value: object) => string[];
}

type MergeArrayFn = (options: MergeArrayFnOptions) => (target: any[], source: any[]) => any[]

interface Options {
  mergeArray?: MergeArrayFn;
  symbols?: boolean;
  all?: boolean;
}

type DeepmergeConstructor = typeof deepmerge

declare namespace deepmerge {
  export { Options }
  export const deepmerge: DeepmergeConstructor
  export { deepmerge as default }
}

declare function deepmerge (options: Options & { all: true }): DeepMergeAllFn
declare function deepmerge (options?: Options): DeepMergeFn

export = deepmerge
