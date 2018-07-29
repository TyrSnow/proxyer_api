import subObject from './subObject';

import { expect, assert } from 'chai';
import 'mocha';

describe('test subObject', () => {
  it('should return expect result', () => {
    let result = subObject('test', {
      name: 'abc',
      title: 1,
    });

    expect(result['test.name']).equal('abc');
    expect(result['test.title']).equal(1);
  });

  it('should return origin obj when prefix is empty', () => {
    let obj = {
      name: 'abc',
      title: 1,
    };
    let result = subObject('', obj);
    expect(result).equal(obj);
  });
});
