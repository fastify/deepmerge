'use strict'

const { test } = require('tape')

const deepmerge = require('../index')

test('Should not break in browser context', async t => {
  const originalBuffer = Buffer
  t.teardown(() => {
    globalThis.Buffer = originalBuffer
  })

  globalThis.Buffer = undefined

  const result = deepmerge({
    cloneProtoObject (x) { return x }
  })(
    { logger: { foo: 'bar' } },
    { logger: { bar: 'foo' } })
  t.same(result.logger, { foo: 'bar', bar: 'foo' }, 'simple execution')
})
