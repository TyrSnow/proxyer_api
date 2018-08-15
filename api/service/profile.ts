import { service } from "../core";
import * as fs from 'fs';
import * as path from 'path';
import * as profiler from 'v8-profiler';
import { exists, readFile } from "../tools/fs";
import CODE from "../constants/code";

@service()
class ProfileService {
  get_profile_path(
    profile_id: string,
  ): string {
    return path.join(process.cwd(), 'profile', `${profile_id}.cpuprofile`);
  }

  profile(
    continue_time: number,  
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const date = Date.now();
        const id = `cpuprofile${date}`;
        profiler.startProfiling(id);
        setTimeout(() => {
          const profile = profiler.stopProfiling(id);
          profile.export()
          .pipe(fs.createWriteStream(this.get_profile_path(id)))
          .on('finish', () => profile.delete());
        }, continue_time);
        resolve(id);
      } catch(e) {
        reject(e);
      }
    });
  }

  get_profile(
    profile_id: string,
  ): Promise<string | Buffer | void | Error> {
    let profile_path = this.get_profile_path(profile_id);
    return exists(profile_path).then((exist) => {
      if (exist) {
        return readFile(profile_path, { encoding: 'utf-8'});
      }
      return Promise.reject(CODE.RESOURCE_NOT_READY);
    });
  }
}

export default ProfileService;
