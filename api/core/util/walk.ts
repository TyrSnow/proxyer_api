import * as fs from 'fs';
import * as path from 'path';

function walk(folder: string) {
  let filepaths = [];
  const paths = fs.readdirSync(folder);
  paths.map(file => {
    const filepath = path.join(process.cwd(), folder, file);
    const stat = fs.lstatSync(filepath);
    if (stat.isDirectory()) {
      filepaths = filepaths.concat(walk(filepath));
    } else {
      filepaths.push(filepath);
    }
  });

  return filepaths;
}

export default walk;
