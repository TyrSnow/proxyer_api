import { validate } from 'express-jsonschema';
import * as log4js from 'log4js';

const error = log4js.getLogger('error');
export function validate(config: any) {
  if (process.env.NODE_ENV === 'development') {
    return function (req, res, next) {
      validate(config)(req, res, (err) => {
        if (err) {
          return res.status(400).json({
            message: 'Invalid Params',
            debug: err,
          });
        }
        next();
      });
    }
  }
  return function (req, res, next) {
    validate(config)(req, res, (err) => {
      if (err) {
        error.error('[Error]Catched JsonSchemaValidate Error: ', JSON.stringify(err));
        error.debug('[Request]Error captured in url: ', req.originalUrl);
        error.debug('[Request]Error captured with params: ', req.params);
        error.debug('[Request]Error captured with query: ', req.query);
        error.debug('[Request]Error captured with body: ', req.body);

        return res.status(400).json({
          message: 'Invalid Params',
        });
      }
      next();
    });
  }
}
