'use strict'

// based on https://github.com/TehShrike/deepmerge/tree/3c39fb376158fa3cfc75250cfc4414064a90f582/test
// MIT License
// Copyright (c) 2012 - 2022 James Halliday, Josh Duff, and other contributors of deepmerge

const deepmerge = require('../index')
const test = require('tap').test

test('all options are set', function (t) {
  t.plan(4)

  function mergeArray (options) {
    t.type(options.deepmerge, 'function')
    t.type(options.isMergeableObject, 'function')
    t.type(options.getKeys, 'function')
    t.type(options.clone, 'function')
    return (a, b) => []
  }
  const merge = deepmerge({ mergeArray })
  merge([], [])
})

test('cloning works properly', function (t) {
  t.plan(4)

  function cloneMerge (options) {
    const clone = options.clone
    return (a, b) => clone(b)
  }
  function referenceMerge () {
    return (a, b) => b
  }
  const a = [1, 2]
  const b = [3, 4]
  t.ok(b !== deepmerge({ mergeArray: cloneMerge })(a, b))
  t.same(deepmerge({ mergeArray: cloneMerge })(a, b), [3, 4])
  t.ok(b === deepmerge({ mergeArray: referenceMerge })(a, b))
  t.same(deepmerge({ mergeArray: referenceMerge })(a, b), [3, 4])
})

test('custom merge array', function (t) {
  let mergeFunctionCalled = false
  function overwriteMerge () {
    return function (target, source) {
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

  t.ok(mergeFunctionCalled)
  t.strictSame(actual, expected)
  t.end()
})

test('merge top-level arrays', function (t) {
  t.plan(2)
  const merge = deepmerge({ mergeArray: overwriteMerge })

  function overwriteMerge () {
    return (a, b) => b
  }
  const a = [1, 2]
  const b = [3, 4]
  const actual = merge(a, b)
  const expected = [3, 4]

  t.ok(b === actual)
  t.strictSame(actual, expected)
})

test('cloner function is available for merge functions to use', function (t) {
  t.plan(5)
  let customMergeWasCalled = false
  function cloneMerge (options) {
    const clone = options.clone
    t.ok(options.clone, 'cloner function is available')
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

  t.strictSame(merge(target, src), expected)
  t.ok(customMergeWasCalled)
  t.ok(Array.isArray(merge(target, src).key1))
  t.ok(Array.isArray(merge(target, src).key2))
})
