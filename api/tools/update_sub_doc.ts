import { Types } from "mongoose";

/**
 * 仅更改doc的指定的字段
 */
export default function update_sub_doc(doc: Types.Subdocument, data: object, keys: string[]) {
  keys.map(key => {
    if (typeof data[key] !== 'undefined') {
      if (data[key] === null) {
        doc.set(key, undefined);
      } else {
        doc.set(key, data[key]);
      }
    }
  });

  return doc;
}