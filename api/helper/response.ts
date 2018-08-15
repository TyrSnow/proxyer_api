import * as log4js from 'log4js';
import CODE from '../constants/code';
import { Request, Response } from 'express';

const log = log4js.getLogger('default');

/**
 * 列表数据返回
 */
export function LIST(
  req: Request,
  res: Response,
  prefix: string = `${req.method} ${req.originalUrl}`,
) {
  return ({ list = [], page }) => {
    res.json({
      success: true,
      list,
      page,
    });
    log.debug(`${prefix} Success`);
  }
}

/**
 * 标准数据返回
 */
export function SUCCESS(
  req: Request,
  res: Response,
  prefix: string = `${req.method} ${req.originalUrl}`,
) {
  return (data) => {
    res.json({
      success: true,
      data,
    });
    log.debug(`${prefix} Success`);
  };
}

/**
 * 文本数据输出
 */
export function TEXT(
  req: Request,
  res: Response,
  prefix: string = `${req.method} ${req.originalUrl}`,
) {
  return (data: string) => {
    res.send(data);
    log.debug(`${prefix} Success`);
  };
};

/**
 * 标准错误返回
 */
export function ERROR(
  req: Request,
  res: Response,
  prefix: string = `${req.method} ${req.originalUrl}`,
) {
  return (err: any) => {
    if (err instanceof Error) {
      // 未处理的系统错误
      if (err.name === 'CastError') {
        res.status(400).send(CODE.ILLEGAL_ID);
        log.error(`${prefix} unexpect error: ${err}`);
      } else {
        res.status(500).send(CODE.ERROR);
        log.error(`${prefix} unexpect error: ${err}`);
      }
    } else {
      const { status = 200, ...other } = err;
      res.status(status).send(other);
      log.error(`${prefix} expect error: ${JSON.stringify(err)}`);
    }
  };
};
