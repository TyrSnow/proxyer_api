import { controller, route } from "../core/injector";
import { auth, USER_AUTH } from "./../intercepror/auth";
import HostService from "../service/host";
import { SUCCESS, ERROR } from "../core/response";

@controller({
  path: '/hosts',
})
class HostController {
  constructor(
    private hostService: HostService,
  ) {}
  
  @route('/:host_id/disable', 'delete')
  @auth(USER_AUTH.USER)
  enable_host(req, res) {
    const { host_id } = req.params;
    this.hostService.update_host_enable(host_id, true).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
  
  @route('/:host_id', 'delete')
  @auth(USER_AUTH.USER)
  delete_host(req, res) {
    const { host_id } = req.params;
  
    this.hostService.delete_host(host_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:host_id', 'put')
  @auth(USER_AUTH.USER)
  update_host_detail(req, res) {
    const { host_id } = req.params;

    this.hostService.update_host(host_id, req.body).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:host_id/disable', 'post')
  @auth(USER_AUTH.USER)
  disable_host(req, res) {
    const { host_id } = req.params;
    this.hostService.update_host_enable(host_id, false).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:host_id', 'get')
  @auth(USER_AUTH.USER)
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
