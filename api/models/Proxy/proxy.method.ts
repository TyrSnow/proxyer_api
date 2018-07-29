import { ProxyModel } from "./index.d";
import { ObjectId } from 'bson';
import CODE from '../../constants/code';

export function add_pattern(pattern: ProxyModel.PatternBase) {
  this.patterns.push(pattern);
  return this.save();
}
