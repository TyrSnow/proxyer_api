import * as mongoose from 'mongoose';
import * as log4js from 'log4js';
let logger = log4js.getLogger('default');

import config from '../config';

mongoose.connect(config.db.uri, {
  autoReconnect: false,
});

(<any>mongoose).Promise = global.Promise;

let db = mongoose.connection;

db.on('error', (err) => {
  logger.fatal('[DB]Initialize error: ', err);
  process.exit();
});
