import * as THREE from 'three'

export function getGlobalFromLocal(props, bones, localQ, currentBoneName) {
    let globalQ = new THREE.Quaternion();
    globalQ.copy(localQ); 

    while (props.parentOf[currentBoneName]) {
        globalQ.premultiply(bones[props.parentOf[currentBoneName]].quaternion)
        currentBoneName = props.parentOf[currentBoneName];
    }

    return globalQ;
}

/**
 * Calculates the global quaternion orientation of a bone's local
 * orientation.
 * @param {Object} parentMap An Object mapping the name of a bone to
 * the name of its parent.
 * @param {Array} bones An Array containing every THREE.js Bone object.
 * @param {THREE.Quaternion} localQ The orientation of the target bone.
 * @param {String} currentBoneName The name of the target bone.
 * @returns The global orientation of the target bone, where the identity
 * transformation (wxyz) = (1, 0, 0, 0) represents pointing in the x
 * direction with local up on the y direction.
 */
export function proplessGlobalFromLocal(parentMap, bones, localQ, currentBoneName) {
    let globalQ = new THREE.Quaternion();
    globalQ.copy(localQ); 

    while (parentMap[currentBoneName]) {
        globalQ.premultiply(bones[parentMap[currentBoneName]].quaternion)
        currentBoneName = parentMap[currentBoneName];
    }

    return globalQ;
}

export function getLocalFromGlobal(props, globalQ, currentBoneName) {
    let localQ = new THREE.Quaternion();

    while (props.parentOf[currentBoneName]) {
        let parentQ = new THREE.Quaternion();
        parentQ.copy(props.bones[props.parentOf[currentBoneName]].quaternion);
        localQ.multiply(parentQ.invert())
        currentBoneName = props.parentOf[currentBoneName];
    }

    localQ.multiply(globalQ);
    return localQ;
}

/**
 * Calculates the local quaternion corresponding to a bone's global
 * orientation.
 * @param {Object} parentMap An Object mapping the name of a bone to
 * the name of its parent.
 * @param {Array} bones An Array containing every THREE.js Bone object.
 * @param {THREE.Quaternion} globalQ The orientation of the target bone.
 * @param {String} currentBoneName The name of the target bone.
 * @returns The local orientation of the target bone, where the identity
 * transformation (wxyz) = (1, 0, 0, 0) represents sharing the orientation
 * of the bone's parent. (or the default orientation if the bone has no
 * parent).
 */
export function proplessLocalFromGlobal(parentMap, bones, globalQ, currentBoneName) {
    let localQ = new THREE.Quaternion();

    while (parentMap[currentBoneName]) {
        let parentQ = new THREE.Quaternion();
        parentQ.copy(bones[parentMap[currentBoneName]].quaternion);
        localQ.multiply(parentQ.invert())
        currentBoneName = parentMap[currentBoneName];
    }

    localQ.multiply(globalQ);
    return localQ; 
}