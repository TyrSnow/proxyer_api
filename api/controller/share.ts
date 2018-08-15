import { controller, route, use } from "../core";
import { SUCCESS, ERROR } from "../helper/response";

import ShareService from "../service/share";
import UserService from "../service/user";
import TokenService from "../service/token";
import { auth } from "../middleware/auth";
import { USER_AUTH } from "../constants/user";

@controller({
  path: '/share',
})
class ShareController {
  constructor(
    private shareService: ShareService,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  @route('/', 'post')
  @use(auth(USER_AUTH.USER))
  create_share(req, res) {
    const { _id } = req.user;
    const { share_type, payload } = req.body;
    this.shareService.create_share_code(share_type, payload, _id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:share_code', 'get')
  get_share_info(req, res) {
    const { share_code } = req.params;

    this.shareService.get_selective(share_code).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
}

export default ShareController;
