import * as log4js from 'log4js';
import * as jwt from 'jsonwebtoken';
import { service } from "../core/injector";

import config from '../config';

@service()
class TokenService {
  sign(
    payload: object,
    expiresIn: string = '1h',
  ): object {
    return Object.assign({
      token: jwt.sign(
          payload,
          config.secretKey,
          {
              expiresIn
          }
      )
  }, payload);
  }
}

export default TokenService;
