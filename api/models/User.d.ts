import { Document } from 'mongoose'
import { USER_AUTH } from '../constants/user';

declare namespace UserModel {
  
  interface UserConfig {
    proxySort: string[]
  }

  interface UserInfo {
    _id: any
    name: string
    email?: string
    phone?: string
    head?: string
    auth?: USER_AUTH
  }

  interface User extends UserInfo, Document {
    sault: string
    password: string
    config: UserConfig
    block?: boolean
    block_date?: Date
    delete?: boolean
    delete_date?: Date
  }
}
