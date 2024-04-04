import { describe, test, expect } from 'vitest';

import Test from '../index';

describe('index tests', () => {
  test('default export form index is Object', () => {
    expect(Test).toBeTruthy();
    expect(typeof Test).toBe('function');
  });

  test('new Test() is Object', () => {
    const bp = new Test();
    expect(bp).toBeTruthy();
    expect(typeof bp).toBe('object');
  });
});
