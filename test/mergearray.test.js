'use strict'

// based on https://github.com/TehShrike/deepmerge/tree/3c39fb376158fa3cfc75250cfc4414064a90f582/test
// MIT License
// Copyright (c) 2012 - 2022 James Halliday, Josh Duff, and other contributors of deepmerge

const deepmerge = require('../index')
const {test} = require('node:test')

test('all options are set', function (t) {
  t.plan(4)

  function mergeArray (options) {
    t.assert.deepStrictEqual(typeof options.deepmerge, 'function')
    t.assert.deepStrictEqual(typeof options.isMergeableObject, 'function')
    t.assert.deepStrictEqual(typeof options.getKeys, 'function')
    t.assert.deepStrictEqual(typeof options.clone, 'function')
    return (_a, _b) => []
  }
  const merge = deepmerge({ mergeArray })
  merge([], [])
})

test('cloning works properly', function (t) {
  t.plan(4)

  function cloneMerge (options) {
    const clone = options.clone
    return (_a, b) => clone(b)
  }
  function referenceMerge () {
    return (_a, b) => b
  }
  const a = [1, 2]
  const b = [3, 4]
  t.assert.ok(b !== deepmerge({ mergeArray: cloneMerge })(a, b))
  t.assert.deepStrictEqual(deepmerge({ mergeArray: cloneMerge })(a, b), [3, 4])
  t.assert.ok(b === deepmerge({ mergeArray: referenceMerge })(a, b))
  t.assert.deepStrictEqual(deepmerge({ mergeArray: referenceMerge })(a, b), [3, 4])
})

test('custom merge array', function (t) {
  let mergeFunctionCalled = false
  function overwriteMerge () {
    return function (_target, source) {
      mergeFunctionCalled = true
      return source
    }
  }
  const merge = deepmerge({ mergeArray: overwriteMerge })
  const destination = {
    someArray: [1, 2],
    someObject: { what: 'yes' }
  }
  const source = {
    someArray: [1, 2, 3]
  }

  const actual = merge(destination, source)
  const expected = {
    someArray: [1, 2, 3],
    someObject: { what: 'yes' }
  }

  t.assert.ok(mergeFunctionCalled)
  t.assert.deepStrictEqual(actual, expected)

})

test('merge top-level arrays', function (t) {
  t.plan(2)
  const merge = deepmerge({ mergeArray: overwriteMerge })

  function overwriteMerge () {
    return (_a, b) => b
  }
  const a = [1, 2]
  const b = [3, 4]
  const actual = merge(a, b)
  const expected = [3, 4]

  t.assert.ok(b === actual)
  t.assert.deepStrictEqual(actual, expected)
})

test('cloner function is available for merge functions to use', function (t) {
  t.plan(5)
  let customMergeWasCalled = false
  function cloneMerge (options) {
    const clone = options.clone
    t.assert.ok(options.clone, 'cloner function is available')
    return function (target, source) {
      customMergeWasCalled = true
      return target.concat(source).map(function (element) {
        return clone(element)
      })
    }
  }

  const merge = deepmerge({ mergeArray: cloneMerge })

  const src = {
    key1: ['one', 'three'],
    key2: ['four']
  }
  const target = {
    key1: ['one', 'two']
  }

  const expected = {
    key1: ['one', 'two', 'one', 'three'],
    key2: ['four']
  }

  t.assert.deepStrictEqual(merge(target, src), expected)
  t.assert.ok(customMergeWasCalled)
  t.assert.ok(Array.isArray(merge(target, src).key1))
  t.assert.ok(Array.isArray(merge(target, src).key2))
})
