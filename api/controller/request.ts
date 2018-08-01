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

  @route('/:proxy_id', 'get')
  @auth(USER_AUTH.USER)
  list(req, res) {
    const { proxy_id } = req.params;
    const { last_modify = '2017-01-01' } = req.query;

    return this.requestService.list_modify(proxy_id, new Date(last_modify)).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
}

export default RequestController;
