// based on https://github.com/TehShrike/deepmerge/tree/master/test

const deepmerge = require('../index')({ all: true })
const test = require('tap').test

test('return an empty object if first argument is an array with no elements', function (t) {
  t.same(deepmerge(), {})
  t.end()
})

test('Work just fine if first argument is an array with least than two elements', function (t) {
  const actual = deepmerge({ example: true })
  const expected = { example: true }
  t.same(actual, expected)
  t.end()
})

test('execute correctly if options object were not passed', function (t) {
  t.doesNotThrow(deepmerge.bind(null, { example: true }, { another: '123' }))
  t.end()
})

test('execute correctly if options object were passed', function (t) {
  t.doesNotThrow(deepmerge.bind(null, { example: true }, { another: '123' }))
  t.end()
})

test('invoke merge on every item in array should result with all props', function (t) {
  const firstObject = { first: true }
  const secondObject = { second: false }
  const thirdObject = { third: 123 }
  const fourthObject = { fourth: 'some string' }

  const mergedObject = deepmerge(firstObject, secondObject, thirdObject, fourthObject)

  t.ok(mergedObject.first === true)
  t.ok(mergedObject.second === false)
  t.ok(mergedObject.third === 123)
  t.ok(mergedObject.fourth === 'some string')
  t.end()
})

test('invoke merge on every item in array with clone should clone all elements', function (t) {
  const firstObject = { a: { d: 123 } }
  const secondObject = { b: { e: true } }
  const thirdObject = { c: { f: 'string' } }

  const mergedWithClone = deepmerge(firstObject, secondObject, thirdObject)

  t.not(mergedWithClone.a, firstObject.a)
  t.not(mergedWithClone.b, secondObject.b)
  t.not(mergedWithClone.c, thirdObject.c)

  t.end()
})

test('invoke merge on every item in array without clone should clone all elements', function (t) {
  const firstObject = { a: { d: 123 } }
  const secondObject = { b: { e: true } }
  const thirdObject = { c: { f: 'string' } }

  const mergedWithoutClone = deepmerge(firstObject, secondObject, thirdObject)

  t.not(mergedWithoutClone.a, firstObject.a)
  t.not(mergedWithoutClone.b, secondObject.b)
  t.not(mergedWithoutClone.c, thirdObject.c)

  t.end()
})
