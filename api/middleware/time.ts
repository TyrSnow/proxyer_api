import * as log4js from 'log4js';

const logger = log4js.getLogger('default');

function time(req, res, next) {
  const startTime = new Date().valueOf();

  const calcResponseTime = () => {
    const now = new Date().valueOf();
    const deltaTime = now - startTime;
    // 调用某个log
    logger.info('[info]Request: ', req.originalUrl, ',cost: ', deltaTime);
  };

  res.once('finish', calcResponseTime);
  res.once('close', calcResponseTime);

  next();
}

export default time;
