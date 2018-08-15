import { create } from '../ioc/factor';

import loader from '../util/loader';
import walk from '../util/walk';
import timer from '../util/timer';

/**
 * master下加载所有的agents
 */
export function agentLoader(folder: string) {
  const filepaths = walk(folder).filter(filepath => {
    return filepath.indexOf('.spec.') === -1;
  });

  return loader(filepaths);
}