import production from './production';
import development from './development';
import test from './test';
import IConfig from './index.d';

let config: IConfig;
if (process.env.NODE_ENV === 'production') {
    config = production;
} else if (process.env.NODE_ENV === 'test') {
    config = test;
} else {
    config = development;
}

export default config