import * as mongoose from 'mongoose';
import Host from './Host';
import { ProxyModel } from './index.d';
import { PATTERN_THROTTLE_TYPE, PATTERN_HANDLE_TYPE, PATTERN_MOCK_TYPE } from '../../constants/proxy';

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
  handle: {
    type: Number,
    enum: PATTERN_HANDLE_TYPE,
  },
  mock_status: String,
  mock_type: {
    type: Number,
    enum: PATTERN_MOCK_TYPE,
  },
  mock_content: String,
  server: {
    type: Schema.Types.ObjectId,
    ref: 'Host',
  },
  sort: {
    type: Number,
    default: -1,
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
