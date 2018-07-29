import * as fs from 'fs';

export function exists(path: fs.PathLike) {
  return new Promise((resolve, reject) => {
    fs.exists(path, resolve);
  });
}

export function readFile(
  path: fs.PathLike,
  option?: { encoding?: string | null; flag?: string; } | undefined | null
): Promise<Error | string | Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, option, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}