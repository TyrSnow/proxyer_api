import { controller, route, use } from "../core";
import RequestService from "../service/request";
import { SUCCESS, ERROR } from "../helper/response";
import { auth } from "../middleware/auth";
import { USER_AUTH } from "../constants/user";
import CODE from "../constants/code";

const MS_PER_MINITE = 60 * 1000;

@controller({
  path: '/request',
})
class RequestController {
  constructor(
    private requestService: RequestService,
  ) {}

  @route('/:request_id', 'get')
  get_detail(req, res) {
    const { request_id } = req.params;

    return this.requestService.find_selective(request_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  
  @route('/', 'get')
  @use(auth(USER_AUTH.USER))
  list(req, res) {
    const {
      proxy_id,
      last_modify = new Date().valueOf() - MS_PER_MINITE,
    } = req.query;

    return this.requestService.list_modify(proxy_id, new Date(last_modify)).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:request_id', 'post')
  // @use(auth(USER_AUTH.USER))
  send_request(req, res) {
    const { request_id } = req.params;
    const overwrite = req.body;

    return this.requestService.resend(request_id, overwrite).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
}

export default RequestController;
