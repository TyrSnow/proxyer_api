import { controller, route, use } from "../core";
import ProxyService from "../service/proxy";
import CODE from "../constants/code";
import { SUCCESS, ERROR } from "../helper/response";
import RequestService from "../service/request";
import { auth } from "../middleware/auth";
import { USER_AUTH } from "../constants/user";

@controller({
  path: '/interface',
})
class InterfaceController {
  constructor(
    private proxyService: ProxyService,
    private requestService: RequestService,
  ) {}

  @route('/', 'get')
  @use(auth(USER_AUTH.USER))
  analyse_proxy_interfaces(req, res) {
    const { proxy_id } = req.query;

    this.proxyService.count_query({
      _id: proxy_id,
    }).then(count => {
      if (count === 0) {
        return Promise.reject(CODE.PROXY_NOT_EXIST);
      }

      return this.requestService.map_reduce_proxy(proxy_id);
    }).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
}

export default InterfaceController;
