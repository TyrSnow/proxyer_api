import * as log4js from 'log4js';
import { service } from "../core/injector";
import { UserModel } from "../models/User.d";
import User from "../models/User.model";
import { generate_sault, hash_password, valid_password } from "../tools/password";
import CODE from "../constants/code";
import { Regs } from '../constants/reg';
import mask_object from '../tools/maskObject';
import { USER_AUTH } from '../constants/user';

let log = log4js.getLogger('default');

@service()
class UserService {
  create(
    name: string,
    password: string,
    auth: USER_AUTH = USER_AUTH.USER,
    head?: string,
  ): Promise<UserModel.UserInfo> {
    let sault = generate_sault();
    let user = new User({
      name,
      head,
      auth,
      sault,
      password: hash_password(sault, password),
    });

    return user.save().then(
      (_user) => {
        return Promise.resolve({
          _id: _user._id,
          name: _user.name,
          auth: _user.auth,
        });
      },
      (err) => {
        if (err.code === 11000) {
          if (err.errmsg.indexOf('name') !== -1) {
            return Promise.reject(CODE.DUMPLICATE_NAME);
          }
        }
        return Promise.reject(err);
      }
    );
  }

  query_user(
    query: object,
    skip: number,
    size: number,
  ): Promise<Array<UserModel.UserInfo>> {
    return User.find(query, {
      name: 1,
      create_date: 1,
      auth: 1,
      block: 1,
      block_date: 1,
      delete: 1,
      delete_date: 1,
    }).skip(skip).limit(size).exec();
  }

  block_user(
    user_id: string,
    admin_id: string,
  ): Promise<boolean> {
    return User.findOneAndUpdate({
      _id: user_id,
    }, {
      block: true,
      block_date: new Date(),
    }).then((user) => {
      if (user) {
        log.log('[UserService.block_user]user {', user_id, '} blocked by {', admin_id, '}');
        return Promise.resolve(true);
      }
      return Promise.reject(CODE.USER_NOT_EXIST);
    });
  }

  unblock_user(
    user_id: string,
    admin_id: string,
  ): Promise<boolean> {
    return User.findOneAndUpdate({
      _id: user_id,
    }, {
      $unset: {
        block: 1,
        block_date: 1,
      },
    }).then((user) => {
      if (user) {
        log.log('[UserService.unblock_user]user {', user_id, '} unblocked by {', admin_id, '}');
        return Promise.resolve(true);
      }
      return Promise.reject(CODE.USER_NOT_EXIST);
    });
  }

  count_user(
    query: object,
  ): Promise<number> {
    return User.count(query).exec();
  }

  valid_name(
    name: string
  ): Promise<any> {
    return User.findOne({
      name
    }).then(
      (user) => {
        if (user) {
          return Promise.reject(CODE.DUMPLICATE_NAME);
        } else {
          return Promise.resolve();
        }
      }
    )
  }

  find_user(
    user: string
  ): Promise<UserModel.User> {
    log.debug('[UserService.find_user]Input arguments: ', arguments);
    // 判断user的格式
    let query: any = {
      name: user
    };
    if (user.match(Regs.phone)) {
      query = {
        phone: user
      }
    } else if (user.match(Regs.email)) {
      query = {
        email: user
      }
    }
    return User.findOne(query).then(
      (user) => {
        if (user) {
          return Promise.resolve(user);
        } else {
          return Promise.reject(CODE.USER_NOT_EXIST)
        }
      }
    )
  }

  find_user_by_id(
    id: string
  ): Promise<UserModel.User> {
    return User.findOne({
      _id: id
    }).then(
      (user) => {
        if (user) {
          return Promise.resolve(user);
        } else {
          return Promise.reject(CODE.USER_NOT_EXIST)
        }
      }
    )
  }

  valid_password(
    user: UserModel.User,
    pwd: string
  ): Promise<UserModel.User> {
    log.debug('[UserService.valid_password]Input arguments: ', arguments);
    return new Promise((resolve, reject) => {
      if (valid_password(user.sault, pwd, user.password)) {
        resolve(user);
      } else {
        reject(CODE.PASSWORD_NOT_MATCH);
      }
    })
  }

  change_password(
    user: UserModel.User,
    newPwd: string
  ): Promise<any> {
    let { sault } = user;
    let password = hash_password(sault, newPwd);
    return User.findOneAndUpdate({
      _id: user._id
    }, {
      password,
    }, {
      new: true,
    }).then(
      (_user) => {
        if (_user) {
          return Promise.resolve(_user);
        } else {
          return Promise.reject(CODE.USER_NOT_EXIST);
        }
      }
    );
  }

  update_user_profile(
    user_id: string,
    user: UserModel.User,
  ): Promise<any> {
    return User.findOneAndUpdate({
      _id: user_id,
    }, mask_object(user, ['head'])).then(
      (effected) => {
        if (effected) {
          return Promise.resolve(true);
        }
        return Promise.reject(CODE.USER_NOT_EXIST);
      },
      (err) => {
        if (err.code === 11000) {
          if (err.errmsg.indexOf('name') !== -1) {
            return Promise.reject(CODE.DUMPLICATE_NAME);
          }
        }
        return Promise.reject(err);
      }
    );
  }

  update_user_config(
    user_id: string,
    config: UserModel.UserConfig,
  ) {
    return User.findOneAndUpdate({
      _id: user_id,
    }, {
      config,
    }, {
      new: true,
    }).then(effected => {
      if (effected) {
        return Promise.resolve(effected);
      }
      return Promise.reject(CODE.USER_NOT_EXIST);
    })
  }
}

export default UserService;
