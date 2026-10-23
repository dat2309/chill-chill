import * as T from 'three';
import { skyMist } from '../../core/miniature';
export function createWeather(group: T.Group) { return skyMist(group); }
