'use strict'

// based on https://github.com/TehShrike/deepmerge/tree/3c39fb376158fa3cfc75250cfc4414064a90f582/test
// MIT License
// Copyright (c) 2012 - 2022 James Halliday, Josh Duff, and other contributors of deepmerge

const deepmerge = require('../index')({ symbols: true })
const { test } = require('node:test')

test('add keys in target that do not exist at the root', function (t) {
  const src = { key1: 'value1', key2: 'value2' }
  const target = {}

  const res = deepmerge(target, src)

  t.assert.deepStrictEqual(target, {}, 'merge should be immutable')
  t.assert.deepStrictEqual(res, src)
})

test('merge existing simple keys in target at the roots', function (t) {
  const src = { key1: 'changed', key2: 'value2' }
  const target = { key1: 'value1', key3: 'value3' }

  const expected = {
    key1: 'changed',
    key2: 'value2',
    key3: 'value3'
  }

  t.assert.deepStrictEqual(target, { key1: 'value1', key3: 'value3' })
  t.assert.deepStrictEqual(deepmerge(target, src), expected)
})

test('merge nested objects into target', function (t) {
  const src = {
    key1: {
      subkey1: 'changed',
      subkey3: 'added'
    }
  }
  const target = {
    key1: {
      subkey1: 'value1',
      subkey2: 'value2'
    }
  }

  const expected = {
    key1: {
      subkey1: 'changed',
      subkey2: 'value2',
      subkey3: 'added'
    }
  }

  t.assert.deepStrictEqual(target, {
    key1: {
      subkey1: 'value1',
      subkey2: 'value2'
    }
  })
  t.assert.deepStrictEqual(deepmerge(target, src), expected)
})

test('replace simple key with nested object in target', function (t) {
  const src = {
    key1: {
      subkey1: 'subvalue1',
      subkey2: 'subvalue2'
    }
  }
  const target = {
    key1: 'value1',
    key2: 'value2'
  }

  const expected = {
    key1: {
      subkey1: 'subvalue1',
      subkey2: 'subvalue2'
    },
    key2: 'value2'
  }

  t.assert.deepStrictEqual(target, { key1: 'value1', key2: 'value2' })
  t.assert.deepStrictEqual(deepmerge(target, src), expected)
})

test('should add nested object in target', function (t) {
  const src = {
    b: {
      c: {}
    }
  }

  const target = {
    a: {}
  }

  const expected = {
    a: {},
    b: {
      c: {}
    }
  }

  t.assert.deepStrictEqual(deepmerge(target, src), expected)
})

test('should clone source and target', function (t) {
  const src = {
    b: {
      c: 'foo'
    }
  }

  const target = {
    a: {
      d: 'bar'
    }
  }

  const expected = {
    a: {
      d: 'bar'
    },
    b: {
      c: 'foo'
    }
  }

  const merged = deepmerge(target, src)

  t.assert.deepStrictEqual(merged, expected)

  t.assert.notStrictEqual(merged.a, target.a)
  t.assert.notStrictEqual(merged.b, src.b)
})

test('should clone source and target', function (t) {
  const src = {
    b: {
      c: 'foo'
    }
  }

  const target = {
    a: {
      d: 'bar'
    }
  }

  const merged = deepmerge(target, src)
  t.assert.notStrictEqual(merged.a, target.a)
  t.assert.notStrictEqual(merged.b, src.b)
})

test('should replace object with simple key in target', function (t) {
  const src = { key1: 'value1' }
  const target = {
    key1: {
      subkey1: 'subvalue1',
      subkey2: 'subvalue2'
    },
    key2: 'value2'
  }

  const expected = { key1: 'value1', key2: 'value2' }

  t.assert.deepStrictEqual(target, {
    key1: {
      subkey1: 'subvalue1',
      subkey2: 'subvalue2'
    },
    key2: 'value2'
  })
  t.assert.deepStrictEqual(deepmerge(target, src), expected)
})

test('should replace objects with arrays', function (t) {
  const target = { key1: { subkey: 'one' } }

  const src = { key1: ['subkey'] }

  const expected = { key1: ['subkey'] }

  t.assert.deepStrictEqual(deepmerge(target, src), expected)
})

test('should replace arrays with objects', function (t) {
  const target = { key1: ['subkey'] }

  const src = { key1: { subkey: 'one' } }

  const expected = { key1: { subkey: 'one' } }

  t.assert.deepStrictEqual(deepmerge(target, src), expected)
})

test('should replace object with primitive', function (t) {
  const target = { key1: new Date() }

  const src = 'test'

  const expected = 'test'

  t.assert.deepStrictEqual(deepmerge(target, src), expected)
})

test('should replace Date with RegExp', function (t) {
  const target = new Date()

  const src = /a/g

  const expected = /a/g

  t.assert.deepStrictEqual(deepmerge(target, src), expected)
})

test('should replace dates with arrays', function (t) {
  const target = { key1: new Date() }

  const src = { key1: ['subkey'] }

  const expected = { key1: ['subkey'] }

  t.assert.deepStrictEqual(deepmerge(target, src), expected)
})

test('should replace null with arrays', function (t) {
  const target = {
    key1: null
  }

  const src = {
    key1: ['subkey']
  }

  const expected = {
    key1: ['subkey']
  }

  t.assert.deepStrictEqual(deepmerge(target, src), expected)
})

test('should work on simple array', function (t) {
  const src = ['one', 'three']
  const target = ['one', 'two']

  const expected = ['one', 'two', 'one', 'three']

  t.assert.deepStrictEqual(deepmerge(target, src), expected)
  t.assert.ok(Array.isArray(deepmerge(target, src)))
})

test('should work on another simple array', function (t) {
  const target = ['a1', 'a2', 'c1', 'f1', 'p1']
  const src = ['t1', 's1', 'c2', 'r1', 'p2', 'p3']

  const expected = ['a1', 'a2', 'c1', 'f1', 'p1', 't1', 's1', 'c2', 'r1', 'p2', 'p3']
  t.assert.deepStrictEqual(target, ['a1', 'a2', 'c1', 'f1', 'p1'])
  t.assert.deepStrictEqual(deepmerge(target, src), expected)
  t.assert.ok(Array.isArray(deepmerge(target, src)))
})

test('should work on array properties', function (t) {
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

  t.assert.deepStrictEqual(deepmerge(target, src), expected)
  t.assert.ok(Array.isArray(deepmerge(target, src).key1))
  t.assert.ok(Array.isArray(deepmerge(target, src).key2))
})

test('should work on array properties with clone option', function (t) {
  const src = {
    key1: ['one', 'three'],
    key2: ['four']
  }
  const target = {
    key1: ['one', 'two']
  }

  t.assert.deepStrictEqual(target, {
    key1: ['one', 'two']
  })
  const merged = deepmerge(target, src)
  t.assert.notStrictEqual(merged.key1, src.key1)
  t.assert.notStrictEqual(merged.key1, target.key1)
  t.assert.notStrictEqual(merged.key2, src.key2)
})

test('should work on array of objects', function (t) {
  const src = [
    { key1: ['one', 'three'], key2: ['one'] },
    { key3: ['five'] }
  ]
  const target = [
    { key1: ['one', 'two'] },
    { key3: ['four'] }
  ]

  const expected = [
    { key1: ['one', 'two'] },
    { key3: ['four'] },
    { key1: ['one', 'three'], key2: ['one'] },
    { key3: ['five'] }
  ]

  t.assert.deepStrictEqual(deepmerge(target, src), expected)
  t.assert.ok(Array.isArray(deepmerge(target, src)), 'result should be an array')
  t.assert.ok(Array.isArray(deepmerge(target, src)[0].key1), 'subkey should be an array too')
})

test('should work on array of objects with clone option', function (t) {
  const src = [
    { key1: ['one', 'three'], key2: ['one'] },
    { key3: ['five'] }
  ]
  const target = [
    { key1: ['one', 'two'] },
    { key3: ['four'] }
  ]

  const expected = [
    { key1: ['one', 'two'] },
    { key3: ['four'] },
    { key1: ['one', 'three'], key2: ['one'] },
    { key3: ['five'] }
  ]

  const merged = deepmerge(target, src)
  t.assert.deepStrictEqual(merged, expected)
  t.assert.ok(Array.isArray(deepmerge(target, src)), 'result should be an array')
  t.assert.ok(Array.isArray(deepmerge(target, src)[0].key1), 'subkey should be an array too')
  t.assert.notStrictEqual(merged[0].key1, src[0].key1)
  t.assert.notStrictEqual(merged[0].key1, target[0].key1)
  t.assert.notStrictEqual(merged[0].key2, src[0].key2)
  t.assert.notStrictEqual(merged[1].key3, src[1].key3)
  t.assert.notStrictEqual(merged[1].key3, target[1].key3)
})

test('should treat regular expressions like primitive values', function (t) {
  const target = { key1: /abc/ }
  const src = { key1: /efg/ }
  const expected = { key1: /efg/ }

  t.assert.deepStrictEqual(deepmerge(target, src), expected)
  t.assert.deepStrictEqual(deepmerge(target, src).key1.test('efg'), true)
})

test('should treat regular expressions like primitive values and should not' +
  ' clone even with clone option', function (t) {
  const target = { key1: /abc/ }
  const src = { key1: /efg/ }

  const output = deepmerge(target, src)

  t.assert.deepStrictEqual(output.key1, src.key1)
}
)

test('should treat dates like primitives', function (t) {
  const monday = new Date('2016-09-27T01:08:12.761Z')
  const tuesday = new Date('2016-09-28T01:18:12.761Z')

  const target = {
    key: monday
  }
  const source = {
    key: tuesday
  }

  const expected = {
    key: tuesday
  }
  const actual = deepmerge(target, source)

  t.assert.deepStrictEqual(actual, expected)
  t.assert.deepStrictEqual(actual.key.valueOf(), tuesday.valueOf())
})

test('should treat dates like primitives and should not clone even with clone' +
  ' option', function (t) {
  const monday = new Date('2016-09-27T01:08:12.761Z')
  const tuesday = new Date('2016-09-28T01:18:12.761Z')

  const target = {
    key: monday
  }
  const source = {
    key: tuesday
  }

  const actual = deepmerge(target, source)

  t.assert.deepStrictEqual(actual.key, tuesday)
})

test('should work on array with null in it', function (t) {
  const target = []

  const src = [null]

  const expected = [null]

  t.assert.deepStrictEqual(deepmerge(target, src), expected)
})

test('should clone array\'s element if it is object', function (t) {
  const a = { key: 'yup' }
  const target = []
  const source = [a]

  const output = deepmerge(target, source)

  t.assert.notStrictEqual(output[0], a)
  t.assert.deepStrictEqual(output[0].key, 'yup')
})

test('should clone an array property when there is no target array', function (t) {
  const someObject = {}
  const target = {}
  const source = { ary: [someObject] }
  const output = deepmerge(target, source)

  t.assert.deepStrictEqual(output, { ary: [{}] })
  t.assert.notStrictEqual(output.ary[0], someObject)
})

test('should overwrite values when property is initialised but undefined', function (t) {
  const target1 = { value: [] }
  const target2 = { value: null }
  const target3 = { value: 2 }

  const src = { value: undefined }

  function hasUndefinedProperty (o) {
    t.assert.ok(Object.hasOwn(o, 'value'))
    t.assert.deepStrictEqual(typeof o.value, 'undefined')
  }

  hasUndefinedProperty(deepmerge(target1, src))
  hasUndefinedProperty(deepmerge(target2, src))
  hasUndefinedProperty(deepmerge(target3, src))
})

test('should overwrite null with the source', function (t) {
  const expected = { a: 'string' }
  const actual = deepmerge(null, { a: 'string' })

  t.assert.deepStrictEqual(actual, expected)
})

test('dates should copy correctly in an array', function (t) {
  const monday = new Date('2016-09-27T01:08:12.761Z')
  const tuesday = new Date('2016-09-28T01:18:12.761Z')

  const target = [monday, 'dude']
  const source = [tuesday, 'lol']

  const expected = [monday, 'dude', tuesday, 'lol']
  const actual = deepmerge(target, source)

  t.assert.deepStrictEqual(actual, expected)
})

test('merging objects with own __proto__ in target', function (t) {
  const user = {}
  const malicious = JSON.parse('{ "__proto__": { "admin": true } }')
  const mergedObject = deepmerge(malicious, user)
  t.assert.ok(!mergedObject.__proto__.admin, 'non-plain properties should not be merged') // eslint-disable-line no-proto
  t.assert.ok(!mergedObject.admin, 'the destination should have an unmodified prototype')
})

test('merging objects with own prototype in target', function (t) {
  const user = {}
  const malicious = JSON.parse('{ "prototype": { "admin": true } }')
  const mergedObject = deepmerge(malicious, user)
  t.assert.ok(!mergedObject.admin, 'the destination should have an unmodified prototype')
})

test('merging objects with own __proto__ in source', function (t) {
  const user = {}
  const malicious = JSON.parse('{ "__proto__": { "admin": true } }')
  const mergedObject = deepmerge(user, malicious)
  t.assert.ok(!mergedObject.__proto__.admin, 'non-plain properties should not be merged') // eslint-disable-line no-proto
  t.assert.ok(!mergedObject.admin, 'the destination should have an unmodified prototype')
})

test('merging objects with own prototype in source', function (t) {
  const user = {}
  const malicious = JSON.parse('{ "prototype": { "admin": true } }')
  const mergedObject = deepmerge(user, malicious)
  t.assert.ok(!mergedObject.admin, 'the destination should have an unmodified prototype')
})

test('merging objects with plain and non-plain properties in target', function (t) {
  const parent = {
    parentKey: 'should be undefined'
  }

  const target = Object.create(parent)
  target.plainKey = 'should be replaced'

  const source = {
    parentKey: 'foo',
    plainKey: 'bar',
    newKey: 'baz'
  }

  const mergedObject = deepmerge(target, source)
  t.assert.deepStrictEqual(undefined, mergedObject.parentKey, 'inherited properties of target should be removed, not merged or ignored')
  t.assert.deepStrictEqual('bar', mergedObject.plainKey, 'enumerable own properties of target should be merged')
  t.assert.deepStrictEqual('baz', mergedObject.newKey, 'properties not yet on target should be merged')
})

test('merging objects with plain and non-plain properties in source', function (t) {
  const parent = {
    parentKey: 'should be foo'
  }

  const source = Object.create(parent)
  source.plainKey = 'bar'

  const target = {
    parentKey: 'foo',
    plainKey: 'should be bar',
    newKey: 'baz'
  }

  const mergedObject = deepmerge(target, source)
  t.assert.deepStrictEqual('foo', mergedObject.parentKey, 'inherited properties of source should not be merged')
  t.assert.deepStrictEqual('bar', mergedObject.plainKey, 'enumerable own properties of source should be merged')
  t.assert.deepStrictEqual('baz', mergedObject.newKey, 'properties set on target should not be modified')
})

test('merging objects with null prototype', function (t) {
  const target = Object.create(null)
  const source = Object.create(null)
  target.wheels = 4
  target.trunk = { toolbox: ['hammer'] }
  source.trunk = { toolbox: ['wrench'] }
  source.engine = 'v8'
  const expected = {
    wheels: 4,
    engine: 'v8',
    trunk: {
      toolbox: ['hammer', 'wrench']
    }
  }

  t.assert.deepStrictEqual(expected, deepmerge(target, source))
})
