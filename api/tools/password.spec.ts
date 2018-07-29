import { expect, assert } from 'chai';
import 'mocha';

import { generate_sault } from './password';
import { timed } from './timed';

describe('Test generate_sault', () => {
  it('should return a hex number string, and it\'s length is bigger or equal 64. ', () => {
    const result = generate_sault();
    assert.isString(result);
    assert.match(result, /^[\da-fA-F]{64,}$/);
  });

  it('should return a string with seed string before it when a seed argument passed into.', () => {
    const result = generate_sault('test');
    assert.isString(result);
    assert.match(result, /^test[\da-fA-F]{60,}$/);
  });

  it('should return normally when called it 10000 in 1000ms.', () => {
    let cost = timed(10000, generate_sault, []);
    expect(cost).lessThan(1000);
  });
});
