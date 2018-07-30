import * as mongoose from 'mongoose';
import Host from './Host';
import { ProxyModel } from './index.d';
import { PATTERN_THROTTLE_TYPE } from '../../constants/proxy';

const Schema = mongoose.Schema;

const Pattern = <ProxyModel.PatternSchema>new Schema({
  match: {
    type: String
  },
  allow_methods: [Number],
  throttle: {
    type: Number,
    enum: PATTERN_THROTTLE_TYPE,
    default: PATTERN_THROTTLE_TYPE.NONE,
  },
  speed: Number,
  delay: Number,
  server: {
    type: Schema.Types.ObjectId,
    ref: 'Host',
  },
  enable: {
    type: Boolean,
    default: true,
  },
  pause: {
    type: Boolean,
    default: false,
  },
});

export default Pattern;
