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
- `nullPrototype` (`boolean, optional) - created Objects have no prototype so keys like constructor and prototype are allowed without having the risk of a prototype pollution but has a ca. 20-30 % performance penalty, default is false

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
@fastify/deepmerge: merge regex with date x 1,218,057,587 ops/sec ±0.42% (92 runs sampled)
@fastify/deepmerge: merge object with a primitive x 1,227,135,062 ops/sec ±0.55% (95 runs sampled)
@fastify/deepmerge: merge two arrays containing strings x 24,189,601 ops/sec ±0.81% (94 runs sampled)
@fastify/deepmerge: merge two arrays containing objects x 1,484,734 ops/sec ±0.45% (90 runs sampled)
@fastify/deepmerge: merge two flat objects x 13,058,801 ops/sec ±0.60% (95 runs sampled)
@fastify/deepmerge: merge nested objects x 6,268,848 ops/sec ±0.43% (97 runs sampled)
```

`npm run bench:nullprototype` - benchmark deepmerge with nullPrototype set to true:
```
@fastify/deepmerge: merge regex with date x 1,268,527,098 ops/sec ±0.12% (98 runs sampled)
@fastify/deepmerge: merge object with a primitive x 1,276,444,240 ops/sec ±0.10% (98 runs sampled)
@fastify/deepmerge: merge two arrays containing strings x 25,685,858 ops/sec ±0.24% (98 runs sampled)
@fastify/deepmerge: merge two arrays containing objects x 1,572,714 ops/sec ±0.89% (96 runs sampled)
@fastify/deepmerge: merge two flat objects x 10,009,494 ops/sec ±0.83% (89 runs sampled)
@fastify/deepmerge: merge nested objects x 6,349,727 ops/sec ±0.66% (96 runs sampled)
```

`npm run bench:compare` - comparison of @fastify/deepmerge with other popular deepmerge implementation:
```
@fastify/deepmerge x 569,163 ops/sec ±0.20% (100 runs sampled)
deepmerge x 21,584 ops/sec ±0.65% (96 runs sampled)
merge-deep x 89,263 ops/sec ±0.47% (99 runs sampled)
ts-deepmerge x 186,674 ops/sec ±0.54% (92 runs sampled)
deepmerge-ts x 184,958 ops/sec ±0.17% (96 runs sampled)
lodash.merge x 90,968 ops/sec ±0.35% (95 runs sampled)
```

## License

Licensed under [MIT](./LICENSE).