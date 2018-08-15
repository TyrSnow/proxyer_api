import { controller, route } from "../core";
import RequestService from "../service/request";
import { SUCCESS, ERROR } from "../helper/response";
import InterfaceService from "../service/interface";
import { auth } from "../middleware/auth";
import { USER_AUTH } from "../constants/user";

@controller({
  path: '/task',
  use: [auth(USER_AUTH.USER)],
})
class TaskController {
  constructor(
    private requestService: RequestService,
    private interfaceService: InterfaceService,
  ) {}

  @route('/analyse_proxy_interface', 'put')
  analyse_proxy_interface(req, res) {
    const { proxy_id } = req.query;

    return this.requestService.map_reduce_proxy(proxy_id).then(
      list => {
        return this.interfaceService.create_batch(proxy_id, list);
      },
    ).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
}

export default TaskController;
