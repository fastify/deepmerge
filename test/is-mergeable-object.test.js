'use strict'

// based on https://github.com/TehShrike/deepmerge/tree/3c39fb376158fa3cfc75250cfc4414064a90f582/test
// MIT License
// Copyright (c) 2012 - 2022 James Halliday, Josh Duff, and other contributors of deepmerge

const deepmerge = require('../index')
const test = require('tape').test

test('custom isMergeableObject', { skip: typeof FormData === "undefined" }, function (t) {
  function customIsMergeableObject (value) {
    return (
      typeof value === 'object' &&
      value !== null &&
      !(value instanceof RegExp) &&
      !(value instanceof Date) &&
      !(value instanceof FormData)
    )
  }

  const merge = deepmerge({
    isMergeableObject: customIsMergeableObject,
  })
  const destination = {
    someArray: [1, 2],
    someObject: new FormData()
  }

  const formdata = new FormData()
  const source = {
    someObject: formdata,
  }

  const actual = merge(destination, source)
  const expected = {
    someArray: [1, 2],
    someObject: formdata
  }

  t.deepEqual(actual, expected)
  t.end()
})
