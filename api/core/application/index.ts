import * as cluster from 'cluster';
import { ApplicationMaster } from './ApplicationMaster';
import { ClusterWorker } from './ClusterWorker';

let Application: any = ApplicationMaster;

if (
  (cluster.isWorker) ||
  (process.env.CLUSTER === 'disabled') // 不启用cluster
) {
  Application = ClusterWorker;
}
export default Application;
