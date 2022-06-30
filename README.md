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
@fastify/deepmerge: merge regex with date x 1,266,447,885 ops/sec ±0.14% (97 runs sampled)
@fastify/deepmerge: merge object with a primitive x 1,266,435,016 ops/sec ±0.33% (97 runs sampled)
@fastify/deepmerge: merge two arrays containing strings x 25,591,739 ops/sec ±0.24% (98 runs sampled)
@fastify/deepmerge: two merge arrays containing objects x 976,182 ops/sec ±0.46% (98 runs sampled)
@fastify/deepmerge: merge two flat objects x 10,027,879 ops/sec ±0.36% (94 runs sampled)
@fastify/deepmerge: merge nested objects x 5,341,227 ops/sec ±0.67% (94 runs sampled)
```

`npm run bench:compare` - comparison of @fastify/deepmerge with other popular deepmerge implementation:
```
@fastify/deepmerge x 403,777 ops/sec ±0.22% (98 runs sampled)
deepmerge x 21,143 ops/sec ±0.83% (93 runs sampled)
merge-deep x 89,447 ops/sec ±0.59% (95 runs sampled)
ts-deepmerge x 185,601 ops/sec ±0.59% (96 runs sampled)
deepmerge-ts x 185,310 ops/sec ±0.50% (92 runs sampled)
lodash.merge x 89,053 ops/sec ±0.37% (99 runs sampled)
```

## License

Licensed under [MIT](./LICENSE).