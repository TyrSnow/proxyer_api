/**
 * 检查并新建必要的文件夹
 */
import * as fs from 'fs';

function createIfNotExist(folder: string) {
  let exists = fs.existsSync(folder);
  if (!exists) {
    fs.mkdirSync(folder);
  }
}

createIfNotExist('profile');