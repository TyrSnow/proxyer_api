import { service } from "../core/src";
import { ConfigModel } from "../models/config/index.d";
import Config from "../models/Config";
import BaseService from '../common/BaseService';

@service({
  model: Config,
})
export default class ConfigService extends BaseService {
  protected model = Config;
}
