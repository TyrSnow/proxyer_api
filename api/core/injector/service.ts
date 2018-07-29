import { createInjector } from './factor';

export const service = createInjector('service', true, (instance) => {
  const propType = Object.getPrototypeOf(instance);

  /**
   * TODO:
   * 把instance上的函数都包一层，在development环境下打印所有参数的日志
   */

  return instance;
});
