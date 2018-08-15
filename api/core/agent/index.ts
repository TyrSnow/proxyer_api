import * as cluster from 'cluster';
import { ObjectId } from 'bson';
import * as log4js from 'log4js';
import { createInjector } from "../ioc/factor";

const logger = log4js.getLogger('default');

const handleMap = new Map();
process.on('message', (message) => {
  if (message.handleId) {
    let handle = handleMap.get(message.handleId);
    handleMap.delete(message.handleId);
    handle(message.response);
  }
});

function callMasterAgent(agentName: string, propName: string) {
  return function (...args) {
    const handleId = new ObjectId().toHexString();
    return new Promise((resolve, reject) => {
      handleMap.set(handleId, ((response) => {
        resolve(response);
      }));

      process.send({
        topic: 'agent:call',
        handleId,
        args,
        agentName,
        propName,
      });
    });
  }
}

/**
 * agent类，需要保证返回值一定是一个Promise
 * slaver下所有属性函数会被替换成与master的通讯
 */
export const agent = createInjector('agent', true, (instance) => {
  if (cluster.isMaster) {
    return instance;
  } else { // 替换掉所有属性
    const propType = Object.getPrototypeOf(instance);
    const keys = Reflect.ownKeys(propType);

    keys.map(key => {
      if (key !== 'constructor' && typeof propType[key] === 'function') {
        instance[propType] = callMasterAgent(propType.constructor.name, key as string);
      }
    });

    return instance;
  }
});
