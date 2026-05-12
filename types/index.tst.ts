import { expect } from 'tstyche'
import { deepmerge, type DeepMergeFn, type DeepMergeAllFn, DeepMergeDefinedFn, DeepMergeAllDefinedFn } from '.'

expect(deepmerge()).type.toBeAssignableTo<Function>()
expect(deepmerge()).type.toBe<DeepMergeFn>()

expect(deepmerge()({ a: 'a' }, { b: 'b' }).a).type.toBe<string>()
expect(deepmerge()({ a: 'a' }, { b: 'b' }).b).type.toBe<string>()
expect(deepmerge()({ a: 2 }, { b: 'b' }).a).type.toBe<number>()
expect(deepmerge()({ a: 2 }, { b: 'b' }).b).type.toBe<string>()
expect(deepmerge()({ a: 2 }, { a: 'b' }).a).type.toBe<string>()

expect(deepmerge).type.not.toBeCallableWith(1)
expect(deepmerge).type.not.toBeCallableWith({ symbols: 2 })
expect(deepmerge).type.not.toBeCallableWith({ symbol: 2 })

expect(deepmerge({ symbols: true })).type.toBeAssignableTo<Function>()
expect(deepmerge({ symbols: true })).type.toBe<DeepMergeFn>()

expect(deepmerge()('string', { a: 'string' }).a).type.toBe<string>()
expect(deepmerge()(1, { a: 'string' }).a).type.toBe<string>()

expect(deepmerge()<Object, string>({ a: 'string' }, 'string')).type.toBe<string>()
expect(deepmerge()<Object, number>({ a: 'string' }, 1)).type.toBe<number>()
expect(deepmerge()({ a: 'string' }, new Date())).type.toBe<Date>()
expect(deepmerge()({ a: 'string' }, /a/g)).type.toBe<RegExp>()
expect(deepmerge()(/a/, {})).type.toBe<{}>()

expect(deepmerge()({ a: 'string' }, { a: 1 }).a).type.toBe<number>()
expect(deepmerge()({ a: 'string' }, { b: 1 }).a).type.toBe<string>()
expect(deepmerge()({ a: 'string' }, { }).a).type.toBe<string>()
expect(deepmerge()({ a: 'string' }, { b: 1 }).b).type.toBe<number>()
expect(deepmerge()({ a: { a: 'string' } }, { b: 1 }).a).type.toBe<{ a: string }>()
expect(deepmerge()({ a: { a: 'string' } }, { a: { a: 1 } }).a).type.toBe<{ a: number }>()
expect(deepmerge()({ a: { a: 'string' } }, { a: { a: 1, b: 'string' } }).a).type.toBe<{ a: number, b: string }>()
expect(deepmerge()({ a: { a: { a: 'string' } } }, { a: { a: 1, b: 'string' } }).a).type.toBe<{ a: number, b: string }>()
expect(deepmerge()({ a: { a: { a: 'string' } } }, { a: { a: { b: 'string' } } }).a).type.toBe<{ a: { a: string, b: string } }>()
expect(deepmerge()({ a: [1, 2, 3, 4] }, { a: 'string' }).a).type.toBe<string>()
expect(deepmerge()({ a: [1, 2, 3, 4] }, { a: [1, 2, 3, 4] }).a).type.toBe<number[]>()
expect(deepmerge()({ a: [1, 2, 3, 4] }, { a: ['a'] }).a).type.toBe<(number | string)[]>()
expect(deepmerge()({ a: [1, 2, 3, 4] as readonly number[] }, { a: ['a'] }).a).type.toBe<(number | string)[]>()
expect(deepmerge()({ a: [1, 2, 3, 4] as const }, { a: ['a'] as const }).a).type.toBe<[1, 2, 3, 4, 'a']>()
expect(deepmerge()({ a: [1] }, { a: [2] }).a).type.toBe<Array<number>>()
expect(deepmerge()({ a: { b: {} } }, { a: { b: [2] } }).a).type.toBe<{ b: number[] }>()
expect(deepmerge()({ a: { b: {} } }, { a: { b: new Date() } }).a).type.toBe<{ b: Date }>()
expect(deepmerge()({ a: { b: {} } }, { a: { b: /abc/g } }).a).type.toBe<{ b: RegExp }>()
expect(deepmerge()({ a: { b: {} } }, new Date())).type.toBe<Date>()
expect(deepmerge()({ a: { b: {} } }, new Map())).type.toBe<Map<any, any>>()

expect(deepmerge({ all: true })).type.toBeAssignableTo<Function>()
expect(deepmerge({ all: true })).type.toBe<DeepMergeAllFn>()
expect(deepmerge({ all: true, symbols: true })).type.toBeAssignableTo<Function>()
expect(deepmerge({ all: true, symbols: true })).type.toBe<DeepMergeAllFn>()
expect(deepmerge({ all: true, symbols: true })({ a: 'a' }).a).type.toBe<string>()
expect(deepmerge({ all: true, symbols: true })({ a: 'a' }, { b: 'a' }).a).type.toBe<string>()
expect(deepmerge({ all: true, symbols: true })({ a: 'a' }, { b: 'a' }).b).type.toBe<string>()
expect(deepmerge({ all: true, symbols: true })({ a: 'a' }, { a: 2 }).a).type.toBe<number>()
expect(deepmerge({ all: true, symbols: true })({ a: 'a' }, 2)).type.toBe<number>()
expect(deepmerge({ all: true, symbols: true })({ a: 'a' }, 'string')).type.toBe<string>()

// @ts-expect-error No overload matches this call.
deepmerge({ mergeArray: function () {} })
deepmerge({
  // @ts-expect-error No overload matches this call.
  mergeArray: function () {
    return () => 'test'
  }
})

deepmerge({
  mergeArray: function (options) {
    expect(options.clone).type.toBe<(value: any) => any>()
    const clone = options.clone
    return function (target, source) {
      return clone(target.concat(source))
    }
  }
})
deepmerge({
  mergeArray: function () {
    return function (_target, source) {
      return source
    }
  }
})
deepmerge({
  isMergeableObject: function (value) {
    return true
  }
})

expect(deepmerge.isMergeableObject).type.toBe<(value: any) => boolean>()

expect(deepmerge({ onlyDefinedProperties: true })).type.toBe<DeepMergeDefinedFn>()
expect(deepmerge({ all: true, onlyDefinedProperties: true })).type.toBe<DeepMergeAllDefinedFn>()

interface FullOptions {
  apiUrl: string
  timeout: number
  nested: {
    enabled: boolean
    value: string
  }
}

type PartialOptions = Partial<FullOptions>

const fullTarget: FullOptions = { apiUrl: 'url', timeout: 100, nested: { enabled: true, value: 'test' } }
const partialSource: PartialOptions = { timeout: 200 }

const mergedDefined = deepmerge({ onlyDefinedProperties: true })(fullTarget, partialSource)
expect(mergedDefined.apiUrl).type.toBe<string>()
expect(mergedDefined.timeout).type.toBe<number>()
expect(mergedDefined.nested).type.toBe<{ enabled: boolean; value: string }>()

expect(mergedDefined).type.toBeAssignableTo<FullOptions>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mergedRegular = deepmerge()(fullTarget, partialSource)

type DeepPartialOptions = {
  apiUrl?: string
  timeout?: number
  nested?: {
    enabled?: boolean
    value?: string
  }
}

const deepPartialSource: DeepPartialOptions = { nested: { enabled: false } }
const mergedDeep = deepmerge({ onlyDefinedProperties: true })(fullTarget, deepPartialSource)
expect(mergedDeep.apiUrl).type.toBe<string>()
expect(mergedDeep.timeout).type.toBe<number>()
expect(mergedDeep.nested).type.toBeAssignableTo<{ enabled: boolean; value: string }>()

const mergedAll = deepmerge({ all: true, onlyDefinedProperties: true })(
  fullTarget,
  { timeout: 300 } as PartialOptions,
  { apiUrl: 'newUrl' } as PartialOptions
)
expect(mergedAll).type.toBeAssignableTo<FullOptions>()
