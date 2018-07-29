import * as mongoose from 'mongoose';
import { ProxyModel } from './index.d';
import { PROTOCOL } from '../../constants/http';

const Schema = mongoose.Schema;

const Host = <ProxyModel.HostSchema>new Schema({
  name: String,
  target: {
    type: String,
    required: true,
  },
  protocol: {
    type: Number,
    enum: PROTOCOL,
  },
  changeOrigin: Boolean,
  disable: Boolean,
  active: Boolean,
});

export default Host;