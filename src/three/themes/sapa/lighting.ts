import * as T from 'three';
import { lights } from '../../core/miniature';
export const createLighting = (group: T.Group) => lights(group, 0xbcd2de, 0xe5c391, 0xe1eed9, 0xffbd72);
