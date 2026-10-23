import * as T from 'three';
import { lights } from '../../core/miniature';
export function createLighting(parent: T.Group) { const base = lights(parent, 0x101f37, 0x4b5f78, 0x7caccb, 0xa4b3c6); return { ...base, update(storm: number) { base.update(storm, true); base.hemi.color.setHex(0xa5c6dc); base.hemi.groundColor.setHex(0x677889); base.hemi.intensity = 1.2 + storm * .2; base.sun.intensity = 1.7 - storm * .9; } }; }
