import { createInjector } from "../ioc/factor";

export const controller = createInjector('controller', true, (instance) => {
  return instance;
});
