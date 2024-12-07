'use strict'

const fs = require('node:fs')

const { Readable } = require('node:stream')
const deepmerge = require('../index')
const { test } = require('tape')

class Foo {
  constructor(foo) {
    this.foo = foo;
  }
}

test('merge nested objects should be immutable', function (t) {
  t.plan(3)
  const src = {
    key1: { subkey1: 'aaaaaa' }
  }
  const target = {
    key1: { subkey1: 'value1', subkey2: 'value2' }
  }

  const expected = {
    key1: { subkey1: 'aaaaaa', subkey2: 'value2' }
  }

  const result = deepmerge({
    cloneProtoObject (x) {
      t.fail('should not be called')
      return x
    }
  })(target, src)

  t.same(result, expected)

  t.same(target, {
    key1: { subkey1: 'value1', subkey2: 'value2' }
  })

  src.key1.subkey99 = 'changed again'
  t.same(result, expected, 'merge should be immutable')
})

test('should clone the stream properties', async t => {
  const stream = fs.createReadStream(__filename)
  t.teardown(() => stream.destroy())

  const result = deepmerge()({ logger: { foo: 'bar' } }, { logger: { stream } })
  t.equal(typeof result.logger.stream, 'object')
  t.notOk(result.logger.stream instanceof Readable)
  t.notOk(result.logger.stream.__proto___)
})

test('should clone the stream by reference', async t => {
  const stream = fs.createReadStream(__filename)
  t.teardown(() => stream.destroy())

  const result = deepmerge({
    cloneProtoObject (x) {
      t.ok(x instanceof Readable)
      return x
    }
  })({ logger: { foo: 'bar' } }, { logger: { stream } })
  t.equal(typeof result.logger.stream, 'object')
  t.ok(result.logger.stream instanceof Readable)
})

test('should clone the buffer by reference', async t => {
  const result = deepmerge({
    cloneProtoObject (x) {
      t.ok(x instanceof Buffer)
      return x
    }
  })({ logger: { foo: 'bar' } }, { logger: { buffer: Buffer.of(1, 2, 3) } })
  t.equal(typeof result.logger.buffer, 'object')
  t.ok(result.logger.buffer instanceof Buffer)
})

test('should not merge the buffers when cloned by reference', async t => {
  const result = deepmerge({
    cloneProtoObject (x) {
      t.ok(x instanceof Buffer)
      return x
    }
  })(
    { logger: { buffer: Buffer.of(1, 2, 3) } },
    { logger: { buffer: Buffer.of(1, 2, 3) } }
  )
  t.equal(typeof result.logger.buffer, 'object')
  t.ok(result.logger.buffer instanceof Buffer)
  t.same(result.logger.buffer, Buffer.of(1, 2, 3))
})

test('should clone by refernce with proto object in both source and target', async t => {
  t.plan(4)
  const foo2 = new Foo(2) 
  const result = deepmerge({
    cloneProtoObject (x) {
      t.ok(x instanceof Foo)
      return x
    }
  })(
    { foo: new Foo(1) },
    { foo: foo2 }
  )
  t.equal(typeof result.foo, 'object')
  t.ok(result.foo instanceof Foo)
  t.same(result.foo, foo2)
})

test('doc example', async t => {
  const stream = process.stdout

  function cloneByReference (source) {
    return source
  }

  const result = deepmerge({
    cloneProtoObject: cloneByReference
  })(
    {},
    { stream }
  )

  t.ok(result)
  t.pass('should not throw')
})
