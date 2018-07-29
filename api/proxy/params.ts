import * as program from 'commander';

program
  .version('0.1.0', '-v, --version')
  .option('-p, --port <n>', 'port number proxy will listen to', parseInt)
  .option('-h, --host [value]', 'api server host')
  .option('-pid, --proxy <value>', 'proxy id');

program.parse(process.argv);

const { port = 4000, host = '127.0.0.1:8081', seed = process.pid, proxy } = program;

export default {
  port,
  host,
  seed,
  proxy,
}
