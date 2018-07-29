import * as log4js from 'log4js'
import config from '../config'

log4js.configure(config.log);
let logger = log4js.getLogger('default');

logger.info('[Logger]initialized.');
