import * as fs from 'fs';
import * as path from 'path';

function filterExt(fileName: string): string {
  return fileName.replace(/.[\w\d]+$/, '');
}

function ignoreFile(fileName: string, ignores: string[]): boolean {
  if (ignores) {
    const len = ignores.length;
    for (let i = 0; i < len; i += 1) {
      if (fileName.indexOf(ignores[i]) !== -1) {
        return true;
      }
    }
  }

  return false;
}

export default (folder: string, ignores?: string[]) => {
  const paths = fs.readdirSync(folder);

  return paths.filter(fileName => !ignoreFile(fileName, ignores)).map((fileName) => {
    const name = filterExt(fileName);
    const filePath = path.join(process.cwd(), folder, fileName);

    // tslint:disable-next-line:non-literal-require
    return require(filePath).default;
  });
};
