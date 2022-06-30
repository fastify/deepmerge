'use strict'

// based on https://github.com/TehShrike/deepmerge/tree/3c39fb376158fa3cfc75250cfc4414064a90f582/test
// MIT License
// Copyright (c) 2012 - 2022 James Halliday, Josh Duff, and other contributors of deepmerge

const deepmerge = require('../index')({ symbols: true })
const test = require('tap').test

test('add keys in target that do not exist at the root', function (t) {
  const src = { key1: 'value1', key2: 'value2' }
  const target = {}

  const res = deepmerge(target, src)

  t.same(target, {}, 'merge should be immutable')
  t.same(res, src)
  t.end()
})

test('merge existing simple keys in target at the roots', function (t) {
  const src = { key1: 'changed', key2: 'value2' }
  const target = { key1: 'value1', key3: 'value3' }

  const expected = {
    key1: 'changed',
    key2: 'value2',
    key3: 'value3'
  }

  t.same(target, { key1: 'value1', key3: 'value3' })
  t.same(deepmerge(target, src), expected)
  t.end()
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

  t.same(target, {
    key1: {
      subkey1: 'value1',
      subkey2: 'value2'
    }
  })
  t.same(deepmerge(target, src), expected)
  t.end()
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

  t.same(target, { key1: 'value1', key2: 'value2' })
  t.same(deepmerge(target, src), expected)
  t.end()
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

  t.same(deepmerge(target, src), expected)
  t.end()
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

  t.same(merged, expected)

  t.not(merged.a, target.a)
  t.not(merged.b, src.b)

  t.end()
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
  t.not(merged.a, target.a)
  t.not(merged.b, src.b)

  t.end()
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

  t.same(target, {
    key1: {
      subkey1: 'subvalue1',
      subkey2: 'subvalue2'
    },
    key2: 'value2'
  })
  t.same(deepmerge(target, src), expected)
  t.end()
})

test('should replace objects with arrays', function (t) {
  const target = { key1: { subkey: 'one' } }

  const src = { key1: ['subkey'] }

  const expected = { key1: ['subkey'] }

  t.same(deepmerge(target, src), expected)
  t.end()
})

test('should replace arrays with objects', function (t) {
  const target = { key1: ['subkey'] }

  const src = { key1: { subkey: 'one' } }

  const expected = { key1: { subkey: 'one' } }

  t.same(deepmerge(target, src), expected)
  t.end()
})

test('should replace object with primitive', function (t) {
  const target = { key1: new Date() }

  const src = 'test'

  const expected = 'test'

  t.same(deepmerge(target, src), expected)
  t.end()
})

test('should replace Date with RegExp', function (t) {
  const target = new Date()

  const src = /a/g

  const expected = /a/g

  t.same(deepmerge(target, src), expected)
  t.end()
})

test('should replace dates with arrays', function (t) {
  const target = { key1: new Date() }

  const src = { key1: ['subkey'] }

  const expected = { key1: ['subkey'] }

  t.same(deepmerge(target, src), expected)
  t.end()
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

  t.same(deepmerge(target, src), expected)
  t.end()
})

test('should work on simple array', function (t) {
  const src = ['one', 'three']
  const target = ['one', 'two']

  const expected = ['one', 'two', 'one', 'three']

  t.same(deepmerge(target, src), expected)
  t.ok(Array.isArray(deepmerge(target, src)))
  t.end()
})

test('should work on another simple array', function (t) {
  const target = ['a1', 'a2', 'c1', 'f1', 'p1']
  const src = ['t1', 's1', 'c2', 'r1', 'p2', 'p3']

  const expected = ['a1', 'a2', 'c1', 'f1', 'p1', 't1', 's1', 'c2', 'r1', 'p2', 'p3']
  t.same(target, ['a1', 'a2', 'c1', 'f1', 'p1'])
  t.same(deepmerge(target, src), expected)
  t.ok(Array.isArray(deepmerge(target, src)))
  t.end()
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

  t.same(deepmerge(target, src), expected)
  t.ok(Array.isArray(deepmerge(target, src).key1))
  t.ok(Array.isArray(deepmerge(target, src).key2))
  t.end()
})

test('should work on array properties with clone option', function (t) {
  const src = {
    key1: ['one', 'three'],
    key2: ['four']
  }
  const target = {
    key1: ['one', 'two']
  }

  t.same(target, {
    key1: ['one', 'two']
  })
  const merged = deepmerge(target, src)
  t.not(merged.key1, src.key1)
  t.not(merged.key1, target.key1)
  t.not(merged.key2, src.key2)
  t.end()
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

  t.same(deepmerge(target, src), expected)
  t.ok(Array.isArray(deepmerge(target, src)), 'result should be an array')
  t.ok(Array.isArray(deepmerge(target, src)[0].key1), 'subkey should be an array too')

  t.end()
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
  t.same(merged, expected)
  t.ok(Array.isArray(deepmerge(target, src)), 'result should be an array')
  t.ok(Array.isArray(deepmerge(target, src)[0].key1), 'subkey should be an array too')
  t.not(merged[0].key1, src[0].key1)
  t.not(merged[0].key1, target[0].key1)
  t.not(merged[0].key2, src[0].key2)
  t.not(merged[1].key3, src[1].key3)
  t.not(merged[1].key3, target[1].key3)
  t.end()
})

test('should treat regular expressions like primitive values', function (t) {
  const target = { key1: /abc/ }
  const src = { key1: /efg/ }
  const expected = { key1: /efg/ }

  t.same(deepmerge(target, src), expected)
  t.same(deepmerge(target, src).key1.test('efg'), true)
  t.end()
})

test('should treat regular expressions like primitive values and should not' +
  ' clone even with clone option', function (t) {
  const target = { key1: /abc/ }
  const src = { key1: /efg/ }

  const output = deepmerge(target, src)

  t.equal(output.key1, src.key1)
  t.end()
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

  t.same(actual, expected)
  t.equal(actual.key.valueOf(), tuesday.valueOf())
  t.end()
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

  t.equal(actual.key, tuesday)
  t.end()
})

test('should work on array with null in it', function (t) {
  const target = []

  const src = [null]

  const expected = [null]

  t.same(deepmerge(target, src), expected)
  t.end()
})

test('should clone array\'s element if it is object', function (t) {
  const a = { key: 'yup' }
  const target = []
  const source = [a]

  const output = deepmerge(target, source)

  t.not(output[0], a)
  t.equal(output[0].key, 'yup')
  t.end()
})

test('should clone an array property when there is no target array', function (t) {
  const someObject = {}
  const target = {}
  const source = { ary: [someObject] }
  const output = deepmerge(target, source)

  t.same(output, { ary: [{}] })
  t.not(output.ary[0], someObject)
  t.end()
})

test('should overwrite values when property is initialised but undefined', function (t) {
  const target1 = { value: [] }
  const target2 = { value: null }
  const target3 = { value: 2 }

  const src = { value: undefined }

  function hasUndefinedProperty (o) {
    t.ok(Object.hasOwnProperty.call(o, 'value'))
    t.equal(typeof o.value, 'undefined')
  }

  hasUndefinedProperty(deepmerge(target1, src))
  hasUndefinedProperty(deepmerge(target2, src))
  hasUndefinedProperty(deepmerge(target3, src))

  t.end()
})

test('should overwrite null with the source', function (t) {
  const expected = { a: 'string' }
  const actual = deepmerge(null, { a: 'string' })

  t.same(actual, expected)
  t.end()
})

test('dates should copy correctly in an array', function (t) {
  const monday = new Date('2016-09-27T01:08:12.761Z')
  const tuesday = new Date('2016-09-28T01:18:12.761Z')

  const target = [monday, 'dude']
  const source = [tuesday, 'lol']

  const expected = [monday, 'dude', tuesday, 'lol']
  const actual = deepmerge(target, source)

  t.same(actual, expected)
  t.end()
})

test('merging objects with own __proto__ in target', function (t) {
  const user = {}
  const malicious = JSON.parse('{ "__proto__": { "admin": true } }')
  const mergedObject = deepmerge(malicious, user)
  t.notOk(mergedObject.__proto__.admin, 'non-plain properties should not be merged') // eslint-disable-line no-proto
  t.notOk(mergedObject.admin, 'the destination should have an unmodified prototype')
  t.end()
})

test('merging objects with own prototype in target', function (t) {
  const user = {}
  const malicious = JSON.parse('{ "prototype": { "admin": true } }')
  const mergedObject = deepmerge(malicious, user)
  t.notOk(mergedObject.admin, 'the destination should have an unmodified prototype')
  t.end()
})

test('merging objects with own __proto__ in source', function (t) {
  const user = {}
  const malicious = JSON.parse('{ "__proto__": { "admin": true } }')
  const mergedObject = deepmerge(user, malicious)
  t.notOk(mergedObject.__proto__.admin, 'non-plain properties should not be merged') // eslint-disable-line no-proto
  t.notOk(mergedObject.admin, 'the destination should have an unmodified prototype')
  t.end()
})

test('merging objects with own prototype in source', function (t) {
  const user = {}
  const malicious = JSON.parse('{ "prototype": { "admin": true } }')
  const mergedObject = deepmerge(user, malicious)
  t.notOk(mergedObject.admin, 'the destination should have an unmodified prototype')
  t.end()
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
  t.equal(undefined, mergedObject.parentKey, 'inherited properties of target should be removed, not merged or ignored')
  t.equal('bar', mergedObject.plainKey, 'enumerable own properties of target should be merged')
  t.equal('baz', mergedObject.newKey, 'properties not yet on target should be merged')
  t.end()
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
  t.equal('foo', mergedObject.parentKey, 'inherited properties of source should not be merged')
  t.equal('bar', mergedObject.plainKey, 'enumerable own properties of source should be merged')
  t.equal('baz', mergedObject.newKey, 'properties set on target should not be modified')
  t.end()
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

  t.same(expected, deepmerge(target, source))
  t.end()
})
