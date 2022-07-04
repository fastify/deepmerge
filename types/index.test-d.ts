import { expectAssignable, expectError, expectType } from "tsd";
import { deepmerge } from ".";

expectType<string>(deepmerge()({ a: 'a' }, { b: 'b' }).a)
expectType<string>(deepmerge()({ a: 'a' }, { b: 'b' }).b)
expectType<number>(deepmerge()({ a: 2 }, { b: 'b' }).a)
expectType<string>(deepmerge()({ a: 2 }, { b: 'b' }).b)
expectType<string>(deepmerge()({ a: 2 }, { a: 'b' }).a)

expectError(deepmerge(1))
expectError(deepmerge({ symbols: 2 }))
expectError(deepmerge({ symbol: 2 }))

expectAssignable<Function>(deepmerge({ symbols: true }))

expectType<string>(deepmerge()('string', { a: 'string' }).a)
expectType<string>(deepmerge()(1, { a: 'string' }).a)

expectType<string>(deepmerge()({ a: 'string' }, 'string'))
expectType<number>(deepmerge()({ a: 'string' }, 1))
expectType<Date>(deepmerge()({ a: 'string' }, new Date()))
expectType<RegExp>(deepmerge()({ a: 'string' }, /a/g))
expectType<{}>(deepmerge()(/a/, {}))

expectType<number>(deepmerge()({ a: 'string' }, { a: 1 }).a)
expectType<string>(deepmerge()({ a: 'string' }, { b: 1 }).a)
expectType<string>(deepmerge()({ a: 'string' }, { }).a)
expectType<number>(deepmerge()({ a: 'string' }, { b: 1 }).b)
expectType<{ a: string }>(deepmerge()({ a: { a: 'string' } }, { b: 1 }).a)
expectType<{ a: number }>(deepmerge()({ a: { a: 'string' } }, { a: { a: 1 } }).a)
expectType<{ a: number, b: string }>(deepmerge()({ a: { a: 'string' } }, { a: { a: 1, b: 'string' } }).a)
expectType<{ a: number, b: string }>(deepmerge()({ a: { a: { a: 'string' } } }, { a: { a: 1, b: 'string' } }).a)
expectType<{ a: { a: string, b: string } }>(deepmerge()({ a: { a: { a: 'string' } } }, { a: { a: { b: 'string' } } }).a)
expectType<string>(deepmerge()({ a: [1,2,3,4] }, { a: 'string' }).a)
expectType<number[]>(deepmerge()({ a: [1,2,3,4] }, { a: [1,2,3,4] }).a)
expectType<(number|string)[]>(deepmerge()({ a: [1,2,3,4] }, { a: ['a'] }).a)
expectType<Array<number>>(deepmerge()({ a: [1] }, { a: [2] }).a)
expectType<{b: number[]}>(deepmerge()({ a: {b: {}} }, { a: {b: [2]} }).a)
expectType<{b: Date}>(deepmerge()({ a: {b: {}} }, { a: {b: new Date()} }).a)
expectType<{b: RegExp}>(deepmerge()({ a: {b: {}} }, { a: {b: /abc/g } }).a)
expectType<Date>(deepmerge()({ a: {b: {}} }, new Date()))
expectType<Map<any, any>>(deepmerge()({ a: {b: {}} }, new Map()))

expectAssignable<Function>(deepmerge({ all: true }))
expectAssignable<Function>(deepmerge({ all: true, symbols: true }))
expectType<string>(deepmerge({all: true, symbols: true})({a: 'a'}).a)
expectType<string>(deepmerge({all: true, symbols: true})({a: 'a'}, {b: 'a'}).a)
expectType<string>(deepmerge({all: true, symbols: true})({a: 'a'}, {b: 'a'}).b)
expectType<number>(deepmerge({all: true, symbols: true})({a: 'a'}, {a: 2}).a)
expectType<number>(deepmerge({all: true, symbols: true})({a: 'a'}, 2))
expectType<string>(deepmerge({all: true, symbols: true})({a: 'a'}, 'string'))

expectError(deepmerge({ mergeArray: function () { } }))
expectError(deepmerge({ mergeArray: function () { return () => 'test' } }))
deepmerge({
  mergeArray: function (options) {
    expectType<(value: any) => any>(options.clone)
    const clone = options.clone
    return function (target, source) {
      return clone(target.concat(source))
    }
  }
})
deepmerge({
  mergeArray: function () {
    return function (target, source) {
      return source
    }
  }
})