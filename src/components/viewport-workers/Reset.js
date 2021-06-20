import * as THREE from 'three'

import { getLocalFromGlobal } from "./MathOps";

const resetValues = {
    ROOT: {
        x: 0,
        y: 0,
        z: 0,
        w: 1
    },
    BACK: {
        x: -0.06,
        y: 0,
        z: 0,
        w: 0.998
    },
    LUA: {
        x: -0.472,
        y: -0.468,
        z: 0.561,
        w: -0.494
    },
    LLA: {
        x: -0.471,
        y: -0.466,
        z: 0.51,
        w: -0.549
    },
    RUA: {
        x: 0.471,
        y: -0.471,
        z: 0.561,
        w: 0.492
    },
    RLA: {
        x: 0.471,
        y: -0.468,
        z: 0.509,
        w: 0.547
    },
    RUL: {
        x: 0.001,
        y:-0.029,
        z: 0.999,
        w: 0.044,
    },
    RLL: {
        x:0.001,
        y:-0.035,
        z:0.999,
        w: 0.04,
    },
    RSHOE: {
        x: 0.006,
        y: 0.467,
        z: 0.883,
        w: 0.043
    },
    LUL: {
        x:-0.001,
        y:-0.032,
        z: 0.999,
        w: -0.044,
    },
    LLL: {
        x:-0.001,
        y:-0.034,
        z:0.999,
        w:-0.04,
    },
    LSHOE: {
        x: -0.006,
        y: 0.465,
        z: 0.884,
        w: -0.043
    },
}

export function resetModel(props) {

    let boneNames = Object.getOwnPropertyNames(resetValues);

    for (let i = 0; i < boneNames.length; i++) {
        let q = resetValues[boneNames[i]];
        props.globalQs[boneNames[i]] = new THREE.Quaternion(q.x, q.y, q.z, q.w);
        let lq = getLocalFromGlobal(props, props.globalQs[boneNames[i]], boneNames[i]);
        props.bones[boneNames[i]].quaternion.set(lq.x, lq.y, lq.z, lq.w);
    }
    
    props.refreshGlobalLocal(props.bones, props.useGlobalQs.current)
    props.setModelNeedsUpdating(true);
}