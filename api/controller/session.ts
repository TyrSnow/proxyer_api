import { controller, route, use } from "../core";
import UserService from "../service/user";
import TokenService from "../service/token";
import UserSchemas from "../schemas/user.schemas";
import CODE from "../constants/code";
import { SUCCESS, ERROR } from "../helper/response";
import { auth } from "../middleware/auth";
import { USER_AUTH } from "../constants/user";
import { validate } from "../middleware/validator";


@controller({
  path: '/session'
})
class SessionController {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}
  
  @route('/config/sortList', 'put')
  @use(auth(USER_AUTH.USER))
  modifySortConfig(req, res) {
    const { _id, remember } = req.user;
    const { sortList } = req.body;
    
    return this.userService.update_user_sort_config(_id, sortList).then(
      (changedUser) => this.tokenService.sign({
        _id: changedUser._id,
        name: changedUser.name,
        email: changedUser.email,
        phone: changedUser.phone,
        head: changedUser.head,
        auth: changedUser.auth,
        config: changedUser.config,
        remember: remember,
      }, remember ? '30d' : '1d'),
    ).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/config', 'put')
  @use(auth(USER_AUTH.USER))
  modifyUserConfig(req, res) {
    const { _id, remember } = req.user;
    const config = req.body;

    return this.userService.update_user_config(_id, config).then(
      (changedUser) => this.tokenService.sign({
        _id: changedUser._id,
        name: changedUser.name,
        email: changedUser.email,
        phone: changedUser.phone,
        head: changedUser.head,
        auth: changedUser.auth,
        config: changedUser.config,
        remember: remember,
      }, remember ? '30d' : '1d'),
    ).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/password', 'put')
  @use(auth(USER_AUTH.USER))
  modifyPassword(req, res) {
    const { user, body } = req;
    const { oldPassword, password } = body;
    this.userService.find_user_by_id(user._id).then(
      resUser => {
        if (resUser.block) {
          return Promise.reject(CODE.ACCOUNT_HAS_BLOCKED);
        }
        return this.userService.valid_password(resUser, oldPassword).then(
          () => this.userService.change_password(resUser, password),
        ).then(
          (changedUser) => this.tokenService.sign({
            _id: changedUser._id,
            name: changedUser.name,
            email: changedUser.email,
            phone: changedUser.phone,
            head: changedUser.head,
            auth: changedUser.auth,
            config: changedUser.config,
            remember: user.remember,
          }, user.remember ? '30d' : '1d'),
        );
      }
    ).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/', 'post')
  @use(validate(UserSchemas.login))
  login(req, res) {
    let {
      user, password, remember,
    } = req.body;

    this.userService.find_user(user).then(
      _user => {
        if (_user.block) {
          return Promise.reject(CODE.ACCOUNT_HAS_BLOCKED);
        }
        return this.userService.valid_password(_user, password).then(() => {
          return Promise.resolve(this.tokenService.sign({
            _id: _user._id,
            name: _user.name,
            email: _user.email,
            phone: _user.phone,
            head: _user.head,
            auth: _user.auth,
            config: _user.config,
            remember: remember,
          }, remember ? '30d' : '1d'))
        });
      }
    ).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/', 'get')
  @use(auth(USER_AUTH.USER))
  solve_auth(req, res) {
    let { user } = req;
    let { iat, exp, remember, ...other } = user;
    this.userService.find_user_by_id(user._id).then(
      _user => {
        if (_user.block) {
          return Promise.reject(CODE.ACCOUNT_HAS_BLOCKED);
        }
        if (other.remember) {
          return Promise.resolve(other);
        }
        return Promise.resolve(this.tokenService.sign({
          _id: _user._id,
          name: _user.name,
          email: _user.email,
          phone: _user.phone,
          head: _user.head,
          auth: _user.auth,
          config: _user.config,
          remember,
        }, remember ? '30d' : '1d'));
      }
    ).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

}

export default SessionController;
