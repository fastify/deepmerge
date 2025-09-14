'use strict'

const test = require('tape').test
const deepmergeDefault = require('../index')

test('default overwrites with undefined', function (t) {
  const merge = deepmergeDefault()
  const actual = merge({ a: 1, b: null, c: [1] }, { a: undefined, b: undefined, c: undefined })
  t.same(actual, { a: undefined, b: undefined, c: undefined })
  t.end()
})

test('onlyDefinedProperties=true preserves target when source undefined (flat)', function (t) {
  const merge = deepmergeDefault({ onlyDefinedProperties: true })
  const actual = merge({ a: 1, b: null, c: [1] }, { a: undefined, b: undefined, c: undefined })
  t.same(actual, { a: 1, b: null, c: [1] })
  t.end()
})

test('onlyDefinedProperties=true preserves nested properties', function (t) {
  const merge = deepmergeDefault({ onlyDefinedProperties: true })
  const target = { a: { x: 1, y: 2 }, b: { z: 3 } }
  const source = { a: { x: undefined }, b: undefined }
  const actual = merge(target, source)
  t.same(actual, { a: { x: 1, y: 2 }, b: { z: 3 } })
  t.end()
})

test('onlyDefinedProperties=true skips new undefined properties (root)', function (t) {
  const merge = deepmergeDefault({ onlyDefinedProperties: true })
  const actual = merge({}, { a: undefined })
  t.equal(Object.hasOwn(actual, 'a'), false)
  t.same(actual, {})
  t.end()
})

test('onlyDefinedProperties=true skips new undefined properties (nested)', function (t) {
  const merge = deepmergeDefault({ onlyDefinedProperties: true })
  const actual = merge({ b: {} }, { b: { c: undefined } })
  t.equal(Object.hasOwn(actual.b, 'c'), false)
  t.same(actual, { b: {} })
  t.end()
})

test('onlyDefinedProperties=true still adds new defined properties', function (t) {
  const merge = deepmergeDefault({ onlyDefinedProperties: true })
  const actual = merge({ a: 1 }, { b: 2 })
  t.same(actual, { a: 1, b: 2 })
  t.end()
})

test('onlyDefinedProperties=true does not change array merging for defined values', function (t) {
  const merge = deepmergeDefault({ onlyDefinedProperties: true })
  const actual = merge([1, 2], [3])
  t.same(actual, [1, 2, 3])
  t.end()
})
