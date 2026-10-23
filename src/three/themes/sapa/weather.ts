import * as T from 'three';
import { skyMist } from '../../core/miniature';
export const createWeather = (group: T.Group) => skyMist(group);
