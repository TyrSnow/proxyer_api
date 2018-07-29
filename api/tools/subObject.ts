/**
 * 根据obj的字段生成更新子字段的update
 * @param prefix 
 * @param obj 
 */
export default function subObject(prefix: string, obj: object) {
  if (prefix === '') {
    return obj;
  }
  let updateObj = {};
  for (let key in obj) {
    updateObj[`${prefix}.${key}`] = obj[key];
  }
  return updateObj;
}
