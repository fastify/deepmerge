'use strict'

const Benchmark = require('benchmark')
const fastifyDeepmerge = require('..')({ symbol: false })
const deepmerge = require('deepmerge')
const mergedeep = require('merge-deep')
const tsDeepmerge = require('ts-deepmerge').default
const deepmergeTs = require('deepmerge-ts').deepmerge
const lodashMerge = require('lodash.merge')

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
    fastifyDeepmerge(regex, date)
  })
  .add('@fastify/deepmerge: merge object with a primitive', function () {
    fastifyDeepmerge(targetSimple, primitive)
  })
  .add('@fastify/deepmerge: merge two arrays containing strings', function () {
    fastifyDeepmerge(simpleArrayTarget, simpleArraySource)
  })
  .add('@fastify/deepmerge: two merge arrays containing objects', function () {
    fastifyDeepmerge(complexArrayTarget, complexArraySource)
  })
  .add('@fastify/deepmerge: merge two flat objects', function () {
    fastifyDeepmerge(targetSimple, sourceSimple)
  })
  .add('@fastify/deepmerge: merge nested objects', function () {
    fastifyDeepmerge(targetNested, sourceNested)
  })
  .add('deepmerge: merge regex with date', function () {
    deepmerge(regex, date)
  })
  .add('deepmerge: merge object with a primitive', function () {
    deepmerge(targetSimple, primitive)
  })
  .add('deepmerge: merge two arrays containing strings', function () {
    deepmerge(simpleArrayTarget, simpleArraySource)
  })
  .add('deepmerge: two merge arrays containing objects', function () {
    deepmerge(complexArrayTarget, complexArraySource)
  })
  .add('deepmerge: merge two flat objects', function () {
    deepmerge(targetSimple, sourceSimple)
  })
  .add('deepmerge: merge nested objects', function () {
    deepmerge(targetNested, sourceNested)
  })
  .add('merge-deep: merge regex with date', function () {
    mergedeep(regex, date)
  })
  .add('merge-deep: merge object with a primitive', function () {
    mergedeep(targetSimple, primitive)
  })
  .add('merge-deep: merge two arrays containing strings', function () {
    mergedeep(simpleArrayTarget, simpleArraySource)
  })
  .add('merge-deep: two merge arrays containing objects', function () {
    mergedeep(complexArrayTarget, complexArraySource)
  })
  .add('merge-deep: merge two flat objects', function () {
    mergedeep(targetSimple, sourceSimple)
  })
  .add('merge-deep: merge nested objects', function () {
    mergedeep(targetNested, sourceNested)
  })
  .add('ts-deepmerge: merge regex with date', function () {
    tsDeepmerge(regex, date)
  })
  .add('ts-deepmerge: merge object with a primitive', function () {
    tsDeepmerge(targetSimple, primitive)
  })
  .add('ts-deepmerge: merge two arrays containing strings', function () {
    tsDeepmerge(simpleArrayTarget, simpleArraySource)
  })
  .add('ts-deepmerge: two merge arrays containing objects', function () {
    tsDeepmerge(complexArrayTarget, complexArraySource)
  })
  .add('ts-deepmerge: merge two flat objects', function () {
    tsDeepmerge(targetSimple, sourceSimple)
  })
  .add('ts-deepmerge: merge nested objects', function () {
    tsDeepmerge(targetNested, sourceNested)
  })
  .add('deepmerge-ts: merge regex with date', function () {
    deepmergeTs(regex, date)
  })
  .add('deepmerge-ts: merge object with a primitive', function () {
    deepmergeTs(targetSimple, primitive)
  })
  .add('deepmerge-ts: merge two arrays containing strings', function () {
    deepmergeTs(simpleArrayTarget, simpleArraySource)
  })
  .add('deepmerge-ts: two merge arrays containing objects', function () {
    deepmergeTs(complexArrayTarget, complexArraySource)
  })
  .add('deepmerge-ts: merge two flat objects', function () {
    deepmergeTs(targetSimple, sourceSimple)
  })
  .add('deepmerge-ts: merge nested objects', function () {
    deepmergeTs(targetNested, sourceNested)
  })
  .add('lodash.merge: merge regex with date', function () {
    lodashMerge(regex, date)
  })
  .add('lodash.merge: merge object with a primitive', function () {
    lodashMerge(targetSimple, primitive)
  })
  .add('lodash.merge: merge two arrays containing strings', function () {
    lodashMerge(simpleArrayTarget, simpleArraySource)
  })
  .add('lodash.merge: two merge arrays containing objects', function () {
    lodashMerge(complexArrayTarget, complexArraySource)
  })
  .add('lodash.merge: merge two flat objects', function () {
    lodashMerge(targetSimple, sourceSimple)
  })
  .add('lodash.merge: merge nested objects', function () {
    lodashMerge(targetNested, sourceNested)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run()
