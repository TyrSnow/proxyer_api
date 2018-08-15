/**
 * 修饰某个请求的拦截器
 */
export function use(interceptor: any) {
  return (target: any, propertyKey: string, descroptor: PropertyDescriptor) => {
    if (!target[propertyKey].interceptors) {
      Object.assign(target[propertyKey], {
        interceptors: [],
      });
    }

    target[propertyKey].interceptors.push(interceptor);
  }
}