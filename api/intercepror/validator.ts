import { validate } from 'express-jsonschema';
import * as log4js from 'log4js';

const error = log4js.getLogger('error');

/**
 * 标记一个参数检测的路径
 */
function validator(config: any) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (!target[propertyKey].interceptors) {
      Object.assign(target[propertyKey], {
        interceptors: [],
      });
    }
    if (process.env.NODE_ENV === 'development') { // 开发模式把错误带回去
      target[propertyKey].interceptors.push((req, res, next) => {
        validate(config)(req, res, (err) => {
          if (err) {
            return res.status(400).json({
              note: 'Invalid params.',
              debug: err,
            });
          }
          next();
        });
      });
    } else {
      target[propertyKey].interceptors.push((req, res, next) => {
        validate(config)(req, res, (err) => {
          if (err) {
            error.error('[Error]Catched JsonSchemaValidate Error: ', JSON.stringify(err));
            error.debug('[Request]Error captured in url: ', req.originalUrl);
            error.debug('[Request]Error captured with params: ', req.params);
            error.debug('[Request]Error captured with query: ', req.query);
            error.debug('[Request]Error captured with body: ', req.body);
  
            return res.status(400).json({
              note: 'Invalid params.',
            });
          }
          next();
        });
      });
    }
  };
}

export default validator;
