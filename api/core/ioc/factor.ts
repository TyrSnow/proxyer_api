/**
 * 修饰器工厂
 */
// tslint:disable-next-line:no-import-side-effect
import 'reflect-metadata';

// 所有的可注入项空间
const injectPool: Map<string, Function> = new Map();
const singlonFlag: Map<string, boolean> = new Map();
const instancePool: Map<string, any> = new Map();
const injectTree: Map<string, string[]> = new Map();
const optionPool: Map<string, any> = new Map();
const generatePool: Map<string, any> = new Map();

/**
 * 检查新加入的依赖项是否引起了循环依赖
 */
function checkBackendDependency(
  name: string,
  dependencyMap: Map<string, boolean> = new Map(),
  oriName: string = name,
): void {
  const dependencies = injectTree.get(name);
  try {
    dependencies.map((dependency, index) => {
      if (dependency === oriName) {
        throw new Error(`Circle dependency at inject: ${dependency}`);
      }
      dependencyMap.set(dependency, true);
      checkBackendDependency(dependency, dependencyMap, oriName);
    });
  } catch (e) {
    // 补充上自己这一级的名字
    throw new Error(`${e.message} => ${name}`);
  }
}

/**
 * 生成注入器
 */
export function createInjector(
  injectName: string,
  isSinglon: boolean = true,
  generate?: any,
) {
  return (option?: any) => {
    return <T extends {new(...args: any[]): {}}>(injectConstructor: T) => {
      const { name } = injectConstructor;
      const paramsTypes: Function[] = Reflect.getMetadata('design:paramtypes', injectConstructor);

      const dependencies = [];
      if (injectPool[name]) {
        console.debug('Inject name already exist: ', name);

        return;
      } else if (paramsTypes && paramsTypes.length) {
        paramsTypes.forEach((v, i) => {
          // 避免自依赖或者依赖于还未存在的类
          if (v === injectConstructor) {
            throw new Error('不可以依赖自身');
          } else if (!injectPool.get(v.name)) {
            throw new Error(`依赖${i}[${v.name}]不可被注入`);
          }

          // 尝试将依赖项记录下来
          dependencies.push(v.name);
        });
        injectTree.set(name, dependencies);

        // 检查循环依赖
        checkBackendDependency(name);
      } else {
        injectTree.set(name, dependencies);
      }
      optionPool.set(name, option);
      singlonFlag.set(name, isSinglon);
      injectPool.set(name, injectConstructor);
      if (generate) {
        generatePool.set(name, generate);
      }
    };
  };
}

/**
 * 实例化a
 */
export function create<T>(injectConstructor: { new (...args: any[]): T }): T {
  const { name } = injectConstructor;
  // 通过反射机制，获取参数类型列表
  if (instancePool.get(name)) {
    return instancePool.get(name);
  }
  const paramsTypes: Function[] = Reflect.getMetadata('design:paramtypes', injectConstructor);

  let paramInstances = [];
  if (paramsTypes) { // 注入参数
    // 实例化
    paramInstances = paramsTypes.map((v: Function, i) => {
      // 参数不可注入
      if (instancePool.get(v.name)) {
        return instancePool.get(v.name);
      } else if (injectPool.get(v.name)) {
        return create(v as any);
      } else {
        throw new Error(`参数${i}[${v.name}]不可被注入`);
      }
    });
  }

  let instance = new injectConstructor(...paramInstances);
  const option = optionPool.get(name);
  if (option) {
    Object.assign(instance, option);
  }
  let generate = generatePool.get(name);
  if (generate) {
    instance = generate(instance);
  }
  if (singlonFlag.get(name)) { // 非单例不缓存
    instancePool.set(name, instance);
  }

  return instance;
}
