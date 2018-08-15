import * as mongoose from 'mongoose';
import { RequestModel } from './index.d';

let model = new mongoose.Schema({
  url: String,
  realPath: String,
  realHostname: String,
  realPort: String,
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
  },
  query: String,
  params: Object,
  clientIp: String,
  headers: Object,
  data: Object,
  method: Number,
  status: Number,
  cost: Number,
  finished: Boolean,
  mock: Boolean,
  requestContent: String,
  responseContent: String,
  responseHeaders: Object,
  proxy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proxy',
  },
  pattern: String,
}, {
  timestamps: true,
});

model.index({
  'proxy': 1,
});

const Request = mongoose.model<RequestModel.Request>('Request', model);
export default Request;
