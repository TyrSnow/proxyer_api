/**
 * 用于跳过一些controller级别的中间件
 */
export function skip(middleware: any) {
  return (target: any, propertyKey: string, descroptor: PropertyDescriptor) => {
    if (!target[propertyKey].skips) {
      Object.assign(target[propertyKey], {
        skips: [],
      });
    }

    target[propertyKey].skips.push(middleware);
  }
}
