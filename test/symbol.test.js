// based on https://github.com/TehShrike/deepmerge/tree/master/test

const deepmerge = require('../index')({ symbols: true })
const test = require('tap').test

test('copy symbol keys in target that do not exist on the target', function (t) {
  const mySymbol = Symbol('test')
  const src = { [mySymbol]: 'value1' }
  const target = {}

  const res = deepmerge(target, src)

  t.equal(res[mySymbol], 'value1')
  t.deepEqual(Object.getOwnPropertySymbols(res), Object.getOwnPropertySymbols(src))
  t.end()
})

test('copy symbol keys in target that do exist on the target', function (t) {
  const mySymbol = Symbol('test')
  const src = { [mySymbol]: 'value1' }
  const target = { [mySymbol]: 'wat' }

  const res = deepmerge(target, src)

  t.equal(res[mySymbol], 'value1')
  t.end()
})
