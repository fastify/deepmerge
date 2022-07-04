# @fastify/deepmerge

![CI](https://github.com/fastify/deepmerge/workflows/CI/badge.svg)
[![NPM version](https://img.shields.io/npm/v/@fastify/deepmerge.svg?style=flat)](https://www.npmjs.com/package/@fastify/deepmerge)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

Merges the enumerable properties of two or more objects deeply. Fastest implementation of deepmerge, see section 'Benchmarks'.

### Install
```
npm i @fastify/deepmerge
```

### Usage

The module exports a function, which provides a function to deepmerge Objects. 

```
deepmerge(options)
```

`options` is optional and can contain following values

- `symbols` (`boolean`, optional) - should also merge object-keys which are symbols, default is false
- `all` (`boolean`, optional) - merges all parameters, default is false

```js
const deepmerge = require('@fastify/deepmegre')()
const result = deepmerge({a: 'value'}, { b: 404 })
console.log(result) // {a: 'value',  b: 404 }
```

```js
const deepmerge = require('@fastify/deepmegre')({ all: true })
const result = deepmerge({a: 'value'}, { b: 404 }, { a: 404 })
console.log(result) // {a: 404,  b: 404 }
```

## Benchmarks

The benchmarks are available in the benchmark-folder. 

`npm run bench` - benchmark various use cases of deepmerge:
```
@@fastify/deepmerge: merge regex with date x 1,256,523,040 ops/sec ±0.16% (92 runs sampled)
@fastify/deepmerge: merge object with a primitive x 1,256,082,915 ops/sec ±0.25% (97 runs sampled)
@fastify/deepmerge: merge two arrays containing strings x 25,392,605 ops/sec ±0.22% (97 runs sampled)
@fastify/deepmerge: two merge arrays containing objects x 1,655,426 ops/sec ±0.65% (96 runs sampled)
@fastify/deepmerge: merge two flat objects x 15,571,029 ops/sec ±0.45% (96 runs sampled)
@fastify/deepmerge: merge nested objects x 7,601,328 ops/sec ±0.31% (96 runs sampled)
```

`npm run bench:compare` - comparison of @fastify/deepmerge with other popular deepmerge implementation:
```
@fastify/deepmerge x 605,343 ops/sec ±0.87% (96 runs sampled)
deepmerge x 20,312 ops/sec ±1.06% (92 runs sampled)
merge-deep x 83,167 ops/sec ±1.30% (94 runs sampled)
ts-deepmerge x 175,977 ops/sec ±0.57% (96 runs sampled)
deepmerge-ts x 174,973 ops/sec ±0.44% (93 runs sampled)
lodash.merge x 89,213 ops/sec ±0.70% (98 runs sampled)
```

## License

Licensed under [MIT](./LICENSE).