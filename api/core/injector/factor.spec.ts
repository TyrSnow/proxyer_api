import { create, createInjector} from './factor';

import { expect, assert } from 'chai';
import 'mocha';

describe('Test singlon injector', () => {
  // 构建一个injector
  const injector = createInjector('test');
  it('should no error', () => {
    @injector()
    class First {
      private test = 1;
      get_value() {
        return this.test;
      }
    }

    @injector()
    class Second {
      constructor(
        private first: First,
      ) {}

      get_value() {
        return this.first.get_value();
      }
    }

    let second = create(Second);
    expect(second.get_value()).to.equal(1);
  });

  it('should change nothing when injector an exist name', () => {
    @injector()
    class First {
      private test = 2;
      get_value() {
        return this.test;
      }
    }

    @injector()
    class Second {
      get_value() {
        return 3;
      }
    }

    let second = create(Second);
    expect(second.get_value()).to.equal(1);
  });

  class Fourth {}

  it('should has an error when circle dependiences', () => {
    try {
      @injector()
      class Third {
        constructor(
          private fourth: Fourth,
        ) {}
      }
  
      @injector()
      class Fourth {
        constructor(
          private third: Third,
        ) {}
      }
    } catch (e) {
      expect(e).to.exist;
    }
  });

  
  it('should has an error when circle dependiences', () => {
    try {
      @injector()
      class Fifth {
        constructor(
          private fifth: Fifth,
        ) {}
      }
    } catch (e) {
      expect(e.message).to.equal('不可以依赖自身');
    }
  });
});
