import { controller, route, use } from "../core";
import ProxyService from "../service/proxy";
import CODE from "../constants/code";
import { SUCCESS, ERROR } from "../helper/response";
import { auth } from "../middleware/auth";
import { USER_AUTH } from "../constants/user";
import InterfaceService from "../service/interface";

@controller({
  path: '/interface',
  use: [auth(USER_AUTH.USER)],
})
class InterfaceController {
  constructor(
    private proxyService: ProxyService,
    private interfaceService: InterfaceService,
  ) {}

  @route('/', 'get')
  analyse_proxy_interfaces(req, res) {
    const { proxyId } = req.query;

    this.proxyService.count_query({
      _id: proxyId,
    }).then(count => {
      if (count === 0) {
        return Promise.reject(CODE.PROXY_NOT_EXIST);
      }

      return this.interfaceService.list_proxy_interfaces(proxyId);
    }).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:interface_id', 'put')
  update_interface_info(req, res) {
    const { interface_id } = req.params;
  }

  @route('/:interface_id/block', 'post')
  block_interface(req, res) {
    const { interface_id } = req.params;

    return this.interfaceService.update_interface(interface_id, {
      block: true,
    }).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
  
  @route('/:interface_id/block', 'delete')
  unblock_interface(req, res) {
    const { interface_id } = req.params;
  
    return this.interfaceService.update_interface(interface_id, {
      block: false,
    }).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
}

export default InterfaceController;
