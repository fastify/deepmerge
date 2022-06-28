'use strict'

function deepmergeConstructor (options) {
  const propertyIsEnumerable = Object.prototype.propertyIsEnumerable
  function getSymbolsAndKeys (value) {
    const result = Object.keys(value)
    const keys = Object.getOwnPropertySymbols(value)
    for (let i = 0, il = keys.length; i < il; ++i) {
      propertyIsEnumerable.call(value, keys[i]) && result.push(keys[i])
    }
    return result
  }

  const getKeys = options && options.symbols
    ? getSymbolsAndKeys
    : Object.keys

  function isMergeableObject (value) {
    return typeof value === 'object' && value !== null && !(value instanceof RegExp) && !(value instanceof Date)
  }

  function map (entry) {
    return isMergeableObject(entry) ? _deepmerge(Array.isArray(entry) ? [] : {}, entry) : entry
  }

  function mergeObject (target, source) {
    const result = {}
    if (isMergeableObject(target)) {
      const keys = getKeys(target)
      let i, il
      for (i = 0, il = keys.length; i < il; ++i) {
        const key = keys[i]
        result[key] = map(target[key])
      }
    } else if (typeof target !== 'object' || target === null) {
      return map(source)
    }

    const keys = getKeys(source)
    let i, il
    for (i = 0, il = keys.length; i < il; ++i) {
      const key = keys[i]

      if (key in target) {
        if (!(Object.hasOwnProperty.call(target, key)) && !(Object.propertyIsEnumerable.call(target, key))) {
          continue
        } else if (isMergeableObject(source[key])) {
          result[key] = _deepmerge(target[key], source[key])
          continue
        }
      }
      result[key] = map(source[key])
    }
    return result
  }

  function concatArrays (target, source) {
    const tl = target.length
    const sl = source.length
    let i = 0
    const result = new Array(tl + sl)
    for (i = 0; i < tl; ++i) {
      result[i] = map(target[i])
    }
    for (i = 0; i < sl; ++i) {
      result[i + tl] = map(source[i])
    }
    return result
  }

  function _deepmerge (target, source) {
    const sourceIsArray = Array.isArray(source)
    const targetIsArray = Array.isArray(target)

    if (sourceIsArray !== targetIsArray) {
      return map(source)
    } else if (sourceIsArray) {
      return concatArrays(target, source)
    } else {
      return mergeObject(target, source)
    }
  }

  return _deepmerge
}

module.exports = deepmergeConstructor
module.exports.default = deepmergeConstructor
module.exports.deepmerge = deepmergeConstructor
