import { Router } from 'express';
import { create } from '../injector';
import loadFolder from './loadFolder';

const generateControllerRoute = (controller) => {
  const route = Router();
  const propType = Object.getPrototypeOf(controller);
  Object.keys(propType).map((key) => {
    const { method, path = '', interceptors = [] } = controller[key];
    if (method) {
      interceptors.unshift(path);
      interceptors.push(controller[key].bind(controller));
      route[method].apply(route, interceptors);
    }
  });

  return route;
};

const controllerLoader = () => {
  const route = Router();
  const controllers = loadFolder('api/controller', ['.spec.ts']);
  controllers.map((controllerClass) => {
    console.debug('Start init controller: ', controllerClass.name);
    const controller: any = create(controllerClass);
    if (controller.path) {
      route.use(controller.path, generateControllerRoute(controller));
    } else {
      route.use(generateControllerRoute(controller));
    }
    console.debug('Controller: ', controllerClass.name, ' Load Success');
  });

  return route;
};

export default controllerLoader;

