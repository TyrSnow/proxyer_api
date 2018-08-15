import { controller, route } from "../core";
import HostService from "../service/host";
import { SUCCESS, ERROR } from "../helper/response";
import { USER_AUTH } from "../constants/user";
import { auth } from "../middleware/auth";

@controller({
  path: '/hosts',
  use: [auth(USER_AUTH.USER)],
})
class HostController {
  constructor(
    private hostService: HostService,
  ) {}
  
  @route('/:host_id/disable', 'delete')
  enable_host(req, res) {
    const { host_id } = req.params;
    this.hostService.update_host_enable(host_id, true).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
  
  @route('/:host_id', 'delete')
  delete_host(req, res) {
    const { host_id } = req.params;
  
    this.hostService.delete_host(host_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:host_id', 'put')
  update_host_detail(req, res) {
    const { host_id } = req.params;

    this.hostService.update_host(host_id, req.body).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:host_id/disable', 'post')
  disable_host(req, res) {
    const { host_id } = req.params;
    this.hostService.update_host_enable(host_id, false).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:host_id', 'get')
  get_host_detail(req, res) {
    const { host_id } = req.params;

    this.hostService.get_seletive(host_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
}

export default HostController;
