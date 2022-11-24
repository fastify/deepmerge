'use strict'

const fs = require('fs')
const vm = require('vm')

const { test } = require('tap')

test('should not break in browser context', async t => {
  const testRunner = fs.readFileSync('./test/browser/compability.spec.js', 'utf8')
  const deepMergeFile = fs.readFileSync('./index.js', 'utf8')

  const context = vm.createContext({
    t,
    Buffer: undefined,
    console,
    require,
    module: { exports: {} },
    deepMergeFile
  })

  const global = await vm.runInContext(testRunner, context)
  t.equal(global.pass, global.count)
  t.equal(global.fail, 0)
})
