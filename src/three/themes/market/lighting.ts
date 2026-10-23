import * as T from 'three';
import { lights } from '../../core/miniature';
export const createLighting = (group: T.Group) => lights(group, 0xe9b9aa, 0x94c9df, 0xffce91, 0xfff4d5);
