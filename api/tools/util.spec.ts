import * as mocha from 'mocha';
import { expect, assert } from 'chai';

import { timed } from './timed';
import { randomHex, timingCompair } from './util';

describe('Test randomHex', () => {
  it('should return an hex with expect length', () => {
    expect(randomHex(16).length).to.equal(16);
    expect(randomHex(32).length).to.equal(32);
    expect(randomHex(0).length).to.equal(0);
    expect(randomHex().length).to.equal(32);
  });
});

describe('Test timingCompair', () => {
  it('should return correct', () => {
    expect(timingCompair('123', '123')).to.equal(true, 'should equal');
    expect(timingCompair('123', '456')).to.equal(false, 'should not equal');
    expect(timingCompair('', '456')).to.equal(false, 'should not equal');
    expect(timingCompair('sdfgaerzc', '456')).to.equal(false, 'should not equal');
  });

  it('should cost nearly time no matter what result is', () => {
    timed(1000, timingCompair, [
      'abcdefg hijklmn opqrst uvwxyz 0123456789',
      'abcdefg hijklmn optrst uvwxyz 0123456789',
    ]); // 第一遍跑似乎一定会很慢
    const halfTime = timed(1000, timingCompair, [
      'abcdefg hijklmn opqrst uvwxyz 0123456789',
      'abcdefg hijklmn optrst uvwxyz 0123456789',
    ]);
    const zeroTime = timed(1000, timingCompair, [
      'abcdefg hijklmn opqrst uvwxyz 0123456789',
      'bbcdefg hijklmn opqrst uvwxyz 0123456789',
    ]);
    const fullETime = timed(1000, timingCompair, [
      'abcdefg hijklmn opqrst uvwxyz 0123456788',
      'abcdefg hijklmn opqrst uvwxyz 0123456789',
    ]);
    const fullTime = timed(1000, timingCompair, [
      'abcdefg hijklmn opqrst uvwxyz 0123456789',
      'abcdefg hijklmn opqrst uvwxyz 0123456789',
    ]);
    const zeroRadio = zeroTime / fullTime;
    const halfRadio = halfTime / fullTime;
    const fullERadio = fullETime / fullTime;
    console.log('zeroTime: ', zeroTime, '; halfTime: ', halfTime, '; fullETime: ', fullETime, '; fullTime: ', fullTime);
    console.log('zeroRadio: ', zeroRadio, '; halfRadio: ', halfRadio, '; fullERadio: ', fullERadio);
    expect(Math.abs(zeroRadio - 1)).to.below(0.5);
    expect(Math.abs(halfRadio - 1)).to.below(0.5);
    expect(Math.abs(fullERadio - 1)).to.below(0.5);
  });
});
