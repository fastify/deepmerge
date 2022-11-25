
globalThis.t.test('Browser support', t => {
  // eslint-disable-next-line no-eval
  eval(globalThis.deepMergeFile)

  t.plan(1)

  const result = module.exports.deepmerge({
    cloneProtoObject (x) { return x }
  })(
    { logger: { foo: 'bar' } },
    { logger: { bar: 'foo' } })
  t.same(result.logger, { foo: 'bar', bar: 'foo' }, 'simple execution')
})
