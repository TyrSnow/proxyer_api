import { controller, route } from "../core/injector";
import { auth, USER_AUTH } from "../intercepror/auth";
import RequestService from "../service/request";
import { SUCCESS, ERROR } from "../core/response";

@controller({
  path: '/request',
})
class RequestController {
  constructor(
    private requestService: RequestService,
  ) {}

  @route('/:request_id', 'get')
  // @auth(USER_AUTH.SHARE_GUEST)
  get_detail(req, res) {
    const { request_id } = req.params;

    return this.requestService.find_selective(request_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  
  @route('/', 'get')
  @auth(USER_AUTH.USER)
  list(req, res) {
    const { proxy_id, last_modify = '2017-01-01' } = req.query;

    return this.requestService.list_modify(proxy_id, new Date(last_modify)).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
}

export default RequestController;
