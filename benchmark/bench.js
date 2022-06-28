const Benchmark = require('benchmark')
const deepmerge = require('..')({ symbol: false })

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

const ArraySrc = [{ ...srcSimple }, { ...srcSimple }, { ...srcSimple }, { ...srcSimple }, { ...srcSimple }]
const ArrayTarget = [{ ...targetSimple }, { ...targetSimple }, { ...targetSimple }, { ...targetSimple }, { ...targetSimple }]

new Benchmark.Suite()
  .add('deepmerge existing simple keys in target at the roots', function () {
    deepmerge(ArrayTarget, ArraySrc)
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
