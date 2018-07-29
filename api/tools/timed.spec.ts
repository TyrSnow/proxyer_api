import * as mocha from 'mocha';
import { expect, assert } from 'chai';

import { timed } from './timed';

describe('Test timed', () => {
  it('should return an number', () => {
    function test() {
      let sum = 0;
      for (let i = 0; i < 100; i += 1) {
        sum += i;
      }

      return sum;
    }

    const costTime = timed(100, test, []);
    expect(costTime).to.be.above(0);
    expect(typeof costTime).to.equal('number');
  });

  it('should use the context', () => {
    const testCase = {
      timed: 0,
      handler() {
        // tslint:disable-next-line:no-invalid-this
        this.timed += 1;
      },
    };

    const costTime = timed(1000, testCase.handler, [], testCase);
    expect(testCase.timed).to.equal(1000);
  });
});
