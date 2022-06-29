const Benchmark = require('benchmark')
const deepmerge = require('..')({ symbol: false, all: true })

const srcSimple = { key1: 'changed', key2: 'value2' }
const targetSimple = { key1: 'value1', key3: 'value3' }

const srcNested = {
  key1: {
    subkey1: 'subvalue1',
    subkey2: 'subvalue2'
  }
}
const targetNested = {
  key1: 'value1',
  key2: 'value2'
}

const primitive = 'primitive'

const date = new Date()
const regex = /a/g

const simpleArrayTarget = ['a1', 'a2', 'c1', 'f1', 'p1']
const simpleArraySource = ['t1', 's1', 'c2', 'r1', 'p2', 'p3']

const complexArraySource = [{ ...srcSimple }, { ...srcSimple }, { ...srcSimple }, { ...srcSimple }, { ...srcSimple }]
const complexArrayTarget = [{ ...targetSimple }, { ...targetSimple }, { ...targetSimple }, { ...targetSimple }, { ...targetSimple }]

new Benchmark.Suite()
  .add('deepmerge regex with date', function () {
    deepmerge(regex, date)
  })
  .add('deepmerge with primitive', function () {
    deepmerge(targetSimple, primitive)
  })
  .add('deepmerge simple Arrays', function () {
    deepmerge(simpleArrayTarget, simpleArraySource)
  })
  .add('deepmerge complex Arrays', function () {
    deepmerge(complexArrayTarget, complexArraySource)
  })
  .add('deepmerge existing simple keys in target at the roots', function () {
    deepmerge(targetSimple, srcSimple)
  })
  .add('deepmerge nested objects into target', function () {
    deepmerge(targetNested, srcNested)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run()