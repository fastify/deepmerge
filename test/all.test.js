'use strict'

// based on https://github.com/TehShrike/deepmerge/tree/3c39fb376158fa3cfc75250cfc4414064a90f582/test
// MIT License
// Copyright (c) 2012 - 2022 James Halliday, Josh Duff, and other contributors of deepmerge

const deepmerge = require('../index')({ all: true })
const { test } = require('node:test')

test('return an empty object if first argument is an array with no elements', function (t) {
  t.assert.deepStrictEqual(deepmerge(), {})
})

test('Work just fine if first argument is an array with least than two elements', function (t) {
  const actual = deepmerge({ example: true })
  const expected = { example: true }
  t.assert.deepStrictEqual(actual, expected)
})

test('execute correctly if options object were not passed', function (t) {
  t.assert.doesNotThrow(deepmerge.bind(null, { example: true }, { another: '123' }))
})

test('execute correctly if options object were passed', function (t) {
  t.assert.doesNotThrow(deepmerge.bind(null, { example: true }, { another: '123' }))
})

test('invoke merge on every item in array should result with all props', function (t) {
  const firstObject = { first: true }
  const secondObject = { second: false }
  const thirdObject = { third: 123 }
  const fourthObject = { fourth: 'some string' }

  const mergedObject = deepmerge(firstObject, secondObject, thirdObject, fourthObject)

  t.assert.ok(mergedObject.first === true)
  t.assert.ok(mergedObject.second === false)
  t.assert.ok(mergedObject.third === 123)
  t.assert.ok(mergedObject.fourth === 'some string')
})

test('invoke merge on every item in array with clone should clone all elements', function (t) {
  const firstObject = { a: { d: 123 } }
  const secondObject = { b: { e: true } }
  const thirdObject = { c: { f: 'string' } }

  const mergedWithClone = deepmerge(firstObject, secondObject, thirdObject)

  t.assert.notStrictEqual(mergedWithClone.a, firstObject.a)
  t.assert.notStrictEqual(mergedWithClone.b, secondObject.b)
  t.assert.notStrictEqual(mergedWithClone.c, thirdObject.c)
})

test('invoke merge on every item in array without clone should clone all elements', function (t) {
  const firstObject = { a: { d: 123 } }
  const secondObject = { b: { e: true } }
  const thirdObject = { c: { f: 'string' } }

  const mergedWithoutClone = deepmerge(firstObject, secondObject, thirdObject)

  t.assert.notStrictEqual(mergedWithoutClone.a, firstObject.a)
  t.assert.notStrictEqual(mergedWithoutClone.b, secondObject.b)
  t.assert.notStrictEqual(mergedWithoutClone.c, thirdObject.c)
})
