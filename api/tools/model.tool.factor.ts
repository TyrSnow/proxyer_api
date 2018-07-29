import * as mongoose from "mongoose";
/**
 * 生成测试用的模型工具箱
 * @param M 
 */
export function modelToolFactor(M: mongoose.Model<any>) {
  return {
    clear() {
      console.log('clear run');
      return M.remove({});
    }
  }
}