import { create } from '../ioc/factor';

import loader from '../util/loader';
import walk from '../util/walk';

/**
 * 加载所有的定时任务
 * TODO:
 * Worker中，返回一个route，包含定时任务函数名的路径，用于立即执行一个定时任务
 * Master中，会创建负责执行定时任务的cluster
 */
export function scheduleLoader(folder: string) {
  const filepaths = walk(folder).filter(filepath => {
    return filepath.indexOf('.spec.') === -1;
  });

  return loader(filepaths);
}
