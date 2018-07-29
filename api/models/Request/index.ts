import * as mongoose from 'mongoose';
import { RequestModel } from './index.d';

let model = new mongoose.Schema({
  url: String,
  method: String,
  status: String,
  proxy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proxy',
  },
  pattern: String,
});

const Request = mongoose.model<RequestModel.Request>('Request', model);
export default Request;
