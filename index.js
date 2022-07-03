'use strict'

// based on https://github.com/TehShrike/deepmerge
// MIT License
// Copyright (c) 2012 - 2022 James Halliday, Josh Duff, and other contributors of deepmerge

function deepmergeConstructor (options) {
  const prototypeKeys = ['constructor', '__proto__', 'prototype']
  function isPrototypeKey (value) {
    return prototypeKeys.indexOf(value) !== -1
  }
  function isNotPrototypeKey (value) {
    return prototypeKeys.indexOf(value) === -1
  }

  function cloneArray (value) {
    let i = 0
    const il = value.length
    const result = new Array(il)
    for (i = 0; i < il; ++i) {
      result[i] = clone(value[i])
    }
    return result
  }

  function concatArrays (target, source) {
    const tl = target.length
    const sl = source.length
    let i = 0
    const result = new Array(tl + sl)
    for (i = 0; i < tl; ++i) {
      result[i] = clone(target[i])
    }
    for (i = 0; i < sl; ++i) {
      result[i + tl] = clone(source[i])
    }
    return result
  }

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

  function isPrimitive (value) {
    return typeof value !== 'object' || value === null
  }

  function isPrimitiveOrBuiltIn (value) {
    return typeof value !== 'object' || value === null || value instanceof RegExp || value instanceof Date
  }

  function clone (entry) {
    return isMergeableObject(entry)
      ? Array.isArray(entry)
        ? cloneArray(entry)
        : mergeObject({}, entry)
      : entry
  }

  function mergeObjectNullPrototype (target, source) {
    const result = Object.create(null)
    const targetKeys = getKeys(target)
    const sourceKeys = getKeys(source)
    let i, il, key
    for (i = 0, il = targetKeys.length; i < il; ++i) {
      (key = targetKeys[i], true) &&
        (sourceKeys.indexOf(key) === -1) &&
        (result[key] = clone(target[key]))
    }

    for (i = 0, il = sourceKeys.length; i < il; ++i) {
      key = sourceKeys[i]
      if (key in target) {
        if (targetKeys.indexOf(key) !== -1) {
          result[key] = _deepmerge(target[key], source[key])
        } else if (isPrototypeKey(key)) {
          result[key] = clone(source[key])
        }
      } else {
        result[key] = clone(source[key])
      }
    }
    return result
  }

  function mergeObjectWithPrototype (target, source) {
    const targetKeys = getKeys(target)
    const sourceKeys = getKeys(source)
    const result = {}
    let i, il, key
    for (i = 0, il = targetKeys.length; i < il; ++i) {
      isNotPrototypeKey(key = targetKeys[i]) &&
        (sourceKeys.indexOf(key) === -1) &&
        (result[key] = clone(target[key]))
    }

    for (i = 0, il = sourceKeys.length; i < il; ++i) {
      isNotPrototypeKey(key = sourceKeys[i]) &&
        (
          key in target && (targetKeys.indexOf(key) !== -1 && (result[key] = _deepmerge(target[key], source[key])), true) || // eslint-disable-line no-mixed-operators
          (result[key] = clone(source[key]))
        )
    }
    return result
  }
  const mergeObject = options && options.nullPrototype === true
    ? mergeObjectNullPrototype
    : mergeObjectWithPrototype

  function _deepmerge (target, source) {
    const sourceIsArray = Array.isArray(source)
    const targetIsArray = Array.isArray(target)

    if (isPrimitive(source)) {
      return source
    } else if (isPrimitiveOrBuiltIn(target)) {
      return clone(source)
    } else if (sourceIsArray && targetIsArray) {
      return concatArrays(target, source)
    } else if (sourceIsArray !== targetIsArray) {
      return clone(source)
    } else {
      return mergeObject(target, source)
    }
  }

  const createObject = options && options.nullPrototype === true
    ? function () { return Object.create(null) }
    : function () { return {} }

  function _deepmergeAll () {
    switch (arguments.length) {
      case 0:
        return createObject()
      case 1:
        return _deepmerge({}, arguments[0])
      case 2:
        return _deepmerge(arguments[0], arguments[1])
    }
    let result
    for (let i = 0, il = arguments.length; i < il; ++i) {
      result = _deepmerge(result, arguments[i])
    }
    return result
  }

  return options && options.all
    ? _deepmergeAll
    : _deepmerge
}

module.exports = deepmergeConstructor
module.exports.default = deepmergeConstructor
module.exports.deepmerge = deepmergeConstructor
