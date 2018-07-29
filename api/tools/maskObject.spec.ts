import maskObject from './maskObject';

import { expect, assert } from 'chai';
import 'mocha';

describe('Test maskObject', () => {
  const testObj = {
    a: 'abc',
    b: '123',
    c: true,
    d: 123,
  };

  it('should return expect result', () => {
    expect(maskObject(testObj, ['a', 'b'])).to.deep.equal({
      a: 'abc',
      b: '123',
    });
  });

  it('try to mask unexist key, result should have it', () => {
    expect(maskObject(testObj, ['a', 'b', 'e'])).to.deep.equal({
      a: 'abc',
      b: '123',
    });
  });
});