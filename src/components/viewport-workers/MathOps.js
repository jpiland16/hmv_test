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