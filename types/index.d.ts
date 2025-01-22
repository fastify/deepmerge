type DeepMergeFn = <T1, T2>(target: T1, source: T2) => DeepMerge<T1, T2>
type DeepMergeAllFn = <T extends Array<any>>(...targets: T) => DeepMergeAll<{}, T>

type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint

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
  export { Options, DeepMergeFn, DeepMergeAllFn }
  export const deepmerge: DeepmergeConstructor
  export { deepmerge as default }
}

declare function deepmerge (options: Options & { all: true }): DeepMergeAllFn
declare function deepmerge (options?: Options): DeepMergeFn

export = deepmerge
