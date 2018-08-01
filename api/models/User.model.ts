import * as mongoose from 'mongoose';
import { UserModel } from './User';
import { USER_AUTH } from '../constants/user';

const Schema = mongoose.Schema;

let model = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  auth: {
    type: Number,
    enum: USER_AUTH,
    default: USER_AUTH.USER,
  },
  sault: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  config: {
    proxySort: [String],
  },
  head: String,
  block: Boolean,
  block_date: Date,
  delete: Boolean,
  delete_date: Date,
}, {
  timestamps: true,
});

const User = mongoose.model<UserModel.User>('User', model);
export default User;
