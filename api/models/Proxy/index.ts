import * as mongoose from 'mongoose';
import { PROXY_STATUS } from '../../constants/proxy';
import Pattern from './Pattern';
import Host from './Host';
import { ProxyModel } from './index.d';
import { add_pattern } from './proxy.method';

const Schema = mongoose.Schema;

const model = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  desc: String,
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  patterns: [Pattern],
  hosts: [Host],
  prefix: String,
  port: {
    type: Number,
    unique: true,
  },
}, {
  timestamps: true,
});

model.method('add_pattern', add_pattern);

model.methods.detail = function () {
  return this.populate('creator', '_id name');
}

model.post('save', () => {
  // 更新对应的代理服务器
});

const Proxy = mongoose.model<ProxyModel.Proxy>('Proxy', model);

export default Proxy;
