/**
 * controller修饰器
 */
import { createInjector } from './factor';

export const controller = createInjector('controller', true);
