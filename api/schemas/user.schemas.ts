/**
 * UserController对应的schema
 */
import { Regs } from '../constants/reg'
const UserSchemas = {
  /** 注册 */
  regist: {
    body: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          required: true
        },
        password: {
          type: 'string',
          required: true
        }
      }
    }
  },
  login: {
    body: {
      type: 'object',
      properties: {
        user: {
          type: 'string',
          required: true
        },
        password: {
          type: 'string',
          required: true
        },
        remember: {
          type: 'boolean'
        }
      }
    }
  },
  changePassword: {
    body: {
      type: 'object',
      properties: {
        oldPwd: {
          type: 'string',
          required: true
        },
        newPwd: {
          type: 'string',
          required: true
        }
      }
    }
  },
  validName: {
    query: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          required: true
        }
      }
    }
  }
}

export default UserSchemas;
