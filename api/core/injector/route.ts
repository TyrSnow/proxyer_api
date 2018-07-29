/**
 * 修饰controller中的一个成员函数
 */
export function route(path: string, method: string = 'get') {
  const lMethod = method.toLowerCase();

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    descriptor.enumerable = true;
    Object.assign(target[propertyKey], {
      method: lMethod,
      path,
    });
  };
}
