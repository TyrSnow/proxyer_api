import * as log4js from 'log4js';
import * as jwt from 'jsonwebtoken';
import { service } from "../core";

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

  decode(
    token: string,
  ) {
    return jwt.verify(token, config.secretKey);
  }

  get_token_from_req(req: any) {
    if (req.headers.authorization) {
      let splitAuth = req.headers.authorization.split(' ');
      if (splitAuth[0] === 'Bearer') {
        return splitAuth[1];
      }
    }
    return;
  }
}

export default TokenService;
