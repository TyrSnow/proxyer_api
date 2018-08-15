import { controller, route, use } from "../core";
import ProxyService from "../service/proxy";
import { SUCCESS, ERROR } from "../helper/response";
import { auth } from "../middleware/auth";
import { USER_AUTH } from "../constants/user";
import ProxyAgent from "../agent/proxy";

@controller({
  path: '/server',
})
class ServerController {
  constructor(
    private proxyService: ProxyService,
    private serverService: ProxyAgent,
  ) {}
  
  @route('/:proxy_id', 'put')
  @use(auth(USER_AUTH.USER))
  restart(req, res) {
    const { proxy_id } = req.params;

    this.proxyService.get_selective(proxy_id).then(
      proxy => this.serverService.restart(proxy_id, proxy),
    ).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:proxy_id', 'post')
  @use(auth(USER_AUTH.USER))
  start(req, res) {
    // 启动一个代理服务器【需要注意已经启动的情况】
    const { proxy_id } = req.params;

    this.proxyService.get_selective(proxy_id).then(
      proxy => {
        return this.serverService.start(proxy_id, proxy);
      },
    ).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
  
  @route('/:proxy_id', 'delete')
  @use(auth(USER_AUTH.USER))
  stop(req, res) {
    const { proxy_id } = req.params;

    this.serverService.stop(proxy_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:proxy_id')
  info(req, res) {
    const { proxy_id } = req.params;

    this.serverService.status(proxy_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
}

export default ServerController;
