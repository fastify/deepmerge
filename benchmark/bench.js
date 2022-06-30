'use strict'

const Benchmark = require('benchmark')
const deepmerge = require('..')({ symbol: false })

const sourceSimple = { key1: 'changed', key2: 'value2' }
const targetSimple = { key1: 'value1', key3: 'value3' }

const sourceNested = {
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

const complexArraySource = [{ ...sourceSimple }, { ...sourceSimple }, { ...sourceSimple }, { ...sourceSimple }, { ...sourceSimple }]
const complexArrayTarget = [{ ...targetSimple }, { ...targetSimple }, { ...targetSimple }, { ...targetSimple }, { ...targetSimple }]

new Benchmark.Suite()
  .add('@fastify/deepmerge: merge regex with date', function () {
    deepmerge(regex, date)
  })
  .add('@fastify/deepmerge: merge object with a primitive', function () {
    deepmerge(targetSimple, primitive)
  })
  .add('@fastify/deepmerge: merge two arrays containing strings', function () {
    deepmerge(simpleArrayTarget, simpleArraySource)
  })
  .add('@fastify/deepmerge: two merge arrays containing objects', function () {
    deepmerge(complexArrayTarget, complexArraySource)
  })
  .add('@fastify/deepmerge: merge two flat objects', function () {
    deepmerge(targetSimple, sourceSimple)
  })
  .add('@fastify/deepmerge: merge nested objects', function () {
    deepmerge(targetNested, sourceNested)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run()
