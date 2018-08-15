import { createInjector } from "../ioc/factor";

/**
 * 标记定时任务
 */
export const schedule = createInjector('schedule', true, (instance) => {
  return instance;
});
