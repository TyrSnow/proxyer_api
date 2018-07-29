/**
 * 将传入参数中需要的字段提取出来
 * @param object 
 * @param keys 
 */
export default function mask_object(object: Object, keys: Array<string>) {
  let result = {};
  keys.map(key => {
    if (object[key]) {
      result[key] = object[key];
    }
  });
  return result;
}