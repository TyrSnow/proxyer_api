import maskObject from './maskObject';

import { expect, assert } from 'chai';
import 'mocha';

import User from '../models/User.model';
import { modelToolFactor } from './model.tool.factor';

let userTool = modelToolFactor(User);

describe('Test modelTool', () => {
  it('should clean model when clear is called', () => {
  });
});