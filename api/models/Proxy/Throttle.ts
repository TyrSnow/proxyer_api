import * as mongoose from 'mongoose';
import { ProxyModel } from './index.d';

const Schema = mongoose.Schema;

const Throttle = <ProxyModel.Throttle>new Schema({
  speed: Number,
  delay: Number,
});

export default Throttle;
