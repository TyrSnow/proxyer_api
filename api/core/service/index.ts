import { createInjector } from '../ioc/factor';

function logParams(func: any, prefix: string) {
  return function (...args) {
    // this.log && this.log.debug(prefix, func.name, 'called:', args.map(arg => JSON.stringify(arg)).join(','));
    return func.apply(this, args);
  }
}

export const service = createInjector('service', true, (instance) => {
  if (process.env.NODE_ENV === 'development') {
    const propType = Object.getPrototypeOf(instance);
    const prefix = propType.constructor.name;
    const keys = Reflect.ownKeys(propType);
    keys.map(key => {
      if (key !== 'constructor' && typeof propType[key] === 'function') {
        instance[key] = logParams(propType[key], prefix);
      }
    });
  }

  return instance;
});
