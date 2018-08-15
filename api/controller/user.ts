import { controller, route, use } from "../core";
import UserService from "../service/user";
import TokenService from "../service/token";
import { SUCCESS, ERROR, LIST } from "../helper/response";
import UserSchemas from "../schemas/user.schemas";
import { auth } from "../middleware/auth";
import { USER_AUTH } from "../constants/user";
import { validate } from "../middleware/validator";

@controller({
  path: '/users',
})
class UserController {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  @route('/', 'post')
  @use(validate(UserSchemas.regist))
  regist(req, res) {
    let { name, password, head } = req.body;
    this.userService.create(name, password, head).then(
      _user => {
        return Promise.resolve(this.tokenService.sign({
          _id: _user._id,
          name: _user.name,
          email: _user.email,
          phone: _user.phone,
          head: _user.head,
          auth: _user.auth,
        }, '1d'));
      }
    ).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/names')
  @use(validate(UserSchemas.validName))
  valid_name(req, res) {
    let { name } = req.query;
    this.userService.valid_name(name).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/', 'get')
  @use(auth(USER_AUTH.ADMIN))
  list_all(req, res) {
    let { size, current } = req.query;
    
    this.userService.count_user({
      auth: USER_AUTH.USER,
    }).then(
      (total) => {
        let skip = (current - 1) * size;
        if (skip > total) {
          return Promise.resolve({
            list: [],
            page: {
              total,
              size,
              current,
            },
          });
        }
        return this.userService.query_user({
          auth: USER_AUTH.USER,
        }, skip, parseInt(size)).then((list) => {
          return Promise.resolve({
            list,
            page: {
              total,
              size,
              current,
            },
          });
        });
      }
    ).then(
      LIST(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
}

export default UserController;
