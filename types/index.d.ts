declare function deepmerge(options?: Options): DeepMergeFn;

type DeepMergeFn = <T1, T2>(target: T1, source: T2) => DeepMerge<T1, T2>;

export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

export type BuiltIns = Primitive | Date | RegExp;

type MergeTypes<T, U> = T extends Array<infer A1>
  ? U extends Array<infer A2>
  ? Array<A1 | A2>
  : T
  : U


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
  : [T, U] extends [any[], any[]]
  ? MergeTypes<T, U>
  : [T, U] extends [{ [key: string]: unknown }, { [key: string]: unknown }]
  ? DeepMergeHelper<T, U>
  : U

interface Options {
  symbols?: boolean
}

declare function all(objects: object[], options?: Options): object;
declare function all<T>(objects: Partial<T>[], options?: Options): T;

export default deepmerge
export {
  deepmerge,
  Options,
  all
}