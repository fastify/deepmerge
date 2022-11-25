'use strict'

// based on https://github.com/TehShrike/deepmerge/tree/3c39fb376158fa3cfc75250cfc4414064a90f582/test
// MIT License
// Copyright (c) 2012 - 2022 James Halliday, Josh Duff, and other contributors of deepmerge

const deepmerge = require('../index')({ symbols: true })
const test = require('tape').test

test('copy symbol keys in target that do not exist on the target', function (t) {
  const mySymbol = Symbol('test')
  const src = { [mySymbol]: 'value1' }
  const target = {}

  const res = deepmerge(target, src)

  t.equal(res[mySymbol], 'value1')
  t.same(Object.getOwnPropertySymbols(res), Object.getOwnPropertySymbols(src))
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

test('does not copy enumerable symbol keys in source', function (t) {
  const mySymbol = Symbol('test')
  const src = { }
  const target = { [mySymbol]: 'wat' }

  Object.defineProperty(src, mySymbol, {
    value: 'value1',
    writable: false,
    enumerable: false
  })

  const res = deepmerge(target, src)

  t.equal(res[mySymbol], 'wat')
  t.end()
})
