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
@fastify/deepmerge: merge regex with date x 1,245,263,207 ops/sec ±0.41% (99 runs sampled)
@fastify/deepmerge: merge object with a primitive x 1,241,361,757 ops/sec ±0.40% (99 runs sampled)
@fastify/deepmerge: merge two arrays containing strings x 24,765,578 ops/sec ±0.50% (94 runs sampled)
@fastify/deepmerge: merge two arrays containing objects x 1,600,598 ops/sec ±0.64% (96 runs sampled)
@fastify/deepmerge: merge two flat objects x 14,327,729 ops/sec ±0.57% (93 runs sampled)
@fastify/deepmerge: merge nested objects x 7,319,512 ops/sec ±0.45% (96 runs sampled)
```

`npm run bench:nullprototype` - benchmark deepmerge with nullPrototype set to true:
```
@fastify/deepmerge: merge regex with date x 1,241,641,471 ops/sec ±0.19% (99 runs sampled)
@fastify/deepmerge: merge object with a primitive x 1,232,239,900 ops/sec ±0.49% (93 runs sampled)
@fastify/deepmerge: merge two arrays containing strings x 24,893,133 ops/sec ±0.56% (95 runs sampled)
@fastify/deepmerge: merge two arrays containing objects x 1,521,465 ops/sec ±0.83% (94 runs sampled)
@fastify/deepmerge: merge two flat objects x 9,414,407 ops/sec ±0.61% (97 runs sampled)
@fastify/deepmerge: merge nested objects x 5,865,123 ops/sec ±0.50% (93 runs sampled)
```

`npm run bench:compare` - comparison of @fastify/deepmerge with other popular deepmerge implementation:
```
@fastify/deepmerge x 618,229 ops/sec ±0.19% (99 runs sampled)
deepmerge x 21,326 ops/sec ±0.43% (95 runs sampled)
merge-deep x 86,034 ops/sec ±0.49% (98 runs sampled)
ts-deepmerge x 183,827 ops/sec ±0.41% (99 runs sampled)
deepmerge-ts x 179,950 ops/sec ±0.62% (95 runs sampled)
lodash.merge x 89,655 ops/sec ±0.44% (99 runs sampled)
```

## License

Licensed under [MIT](./LICENSE).