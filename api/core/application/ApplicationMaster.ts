import * as cluster from 'cluster';
import * as os from 'os';
import { create } from '../ioc/factor';
import { agentLoader } from '../agent/loader';

/**
 * 负责维护cluster
 * @export
 * @class Application
 */
export class ApplicationMaster {
  static defaultConfig = {
    clusterNum: os.cpus().length,
    controllerPath: 'api/controller',
    agentPath: 'api/agent',
  };

  private workerMap: Map<number, cluster.Worker> = new Map();
  private agentMap: Map<string, any> = new Map();
  private agentsClass: any[] = [];
  private config: any;

  constructor(
    config: any,
  ) {
    this.config = Object.assign({}, ApplicationMaster.defaultConfig, config);
    this.agentsClass = agentLoader(this.config.agentPath);
  }
  
  getAgent(agentname: string) {
    let agent = this.agentMap.get(agentname);
    if (agent) {
      return agent;
    }
    let agentClass = this.agentsClass.find((agent) => agent.name === agentname);
    agent = create(agentClass);
    this.agentMap.set(agentname, agent);
    return agent;
  }

  triggerAgent(worker: cluster.Worker, message: any) {
    const {
      handleId, args, agentName, propName,
    } = message;
    let agent = this.getAgent(agentName);
    const response = agent[propName].apply(agent, args);

    worker.send({
      handleId,
      response,
    });
  }

  forkWorker() {
    const worker = cluster.fork();
    worker.on('message', (message) => {
      if (message.topic === 'agent:call') {
        this.triggerAgent(worker, message);
      }
    });

    this.workerMap.set(worker.id, worker);
  }

  start() {
    const { clusterNum } = this.config;
    for (let i = 0; i < clusterNum; i++) {
      this.forkWorker();
    }
  }

  listen(...args) {
    this.start();
  }
}
