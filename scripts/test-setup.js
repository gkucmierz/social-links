const { describe, it, test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

global.describe = describe;
global.it = it;
global.test = test;
global.beforeEach = beforeEach;

global.expect = (actual) => ({
  toBe: (expected) => assert.equal(actual, expected),
  toEqual: (expected) => assert.deepEqual(actual, expected),
  toStrictEqual: (expected) => assert.deepEqual(actual, expected),
  toBeTruthy: () => assert.ok(Boolean(actual)),
  toBeFalsy: () => assert.ok(!Boolean(actual)),
  toBeDefined: () => assert.notEqual(actual, undefined),
  toThrowError: () => assert.throws(actual),
  not: {
    toEqual: (expected) => assert.notDeepEqual(actual, expected),
    toBe: (expected) => assert.notEqual(actual, expected),
  }
});
