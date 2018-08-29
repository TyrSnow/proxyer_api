import { controller, route, use } from "../core/src";
import { auth } from "../middleware/auth";
import { USER_AUTH } from "../constants/user";
import ConfigService from "../service/config";
import { SUCCESS, ERROR, LIST } from '../helper/response';
import { validate } from "../middleware/validator";
import configSchemas from "../schemas/config.schemas";

@controller({
  path: '/config',
  use: [auth(USER_AUTH.USER)],
})
class ConfigController {
  constructor(
    private configService: ConfigService,
  ) {}

  @route('/', 'post')
  @use(validate(configSchemas.create))
  create(req, res) {
    return this.configService.create(req.body, req.user._id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:configId', 'get')
  detail(req, res) {
    const { configId } = req.params;

    return this.configService.getSelective(configId).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/', 'get')
  list(req, res) {
    const { pageSize, page } = req.query;
    if (pageSize && page) {
      return this.configService.page({}, {}, pageSize, page).then(
        LIST(req, res),
      ).catch(
        ERROR(req, res),
      );
    }

    return this.configService.query({}, {}).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:configId', 'delete')
  delete(req, res) {
    const { configId } = req.params;

    return this.configService.removeById(configId).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
}

export default ConfigController;
