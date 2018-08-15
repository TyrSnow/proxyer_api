import * as jwt from 'express-jwt';
import config from '../config/index';
import { USER_AUTH, hasAuth } from '../constants/user';
import { ERROR } from '../helper/response';
import CODE from '../constants/code';

const requestUser = jwt({
  secret: config.secretKey,
});

export function auth(authType: USER_AUTH) {
  return function (req, res, next) {
    requestUser(req, res, () => {
      if (req.user) {
        if (hasAuth(authType, req.user.auth)) {
          return next();
        }
  
        return ERROR(req, res, `[AUTH]${authType}`)(CODE.LOW_AUTHORIZE);
      } else {
        return ERROR(req, res, `[AUTH]${authType}`)(CODE.NOT_AUTHORIZE);
      }
    });
  }
}
