import { Router } from 'express';
import * as path from 'path';
import * as url from 'url';
import { create } from '../ioc/factor';

import loader from '../util/loader';
import walk from '../util/walk';
import timer from '../util/timer';

const generateControllerRoute = (controller) => {
  const route = Router();
  const { use = [] } = controller;
  const propType = Object.getPrototypeOf(controller);
  Object.keys(propType).map((key) => {
    const { method, path = '', interceptors = [] } = controller[key];
    const handlers = use.concat(interceptors);
    if (method) {
      handlers.unshift(path);
      handlers.push(controller[key].bind(controller));
      route[method].apply(route, handlers);
    }
  });

  return route;
};

function controllerLoader(folder: string) {
  const route = Router();
  const basePath = path.join(process.cwd(), folder);
  const filepaths = walk(folder).filter(filepath => {
    return filepath.indexOf('.spec.') === -1;
  });

  loader(filepaths).map((controllerClass) => {
    const controller: any = create(controllerClass);
    const controllerPath = controller.path;
    const offsetPath = path.relative(basePath, path.dirname(controllerClass.filepath));
    const routePath = controllerPath || `/${offsetPath}`;
    if (routePath !== '') {
      route.use(routePath, generateControllerRoute(controller));
    } else {
      route.use(generateControllerRoute(controller));
    }
  });

  return route;
}

export default timer(controllerLoader);
