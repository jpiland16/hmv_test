import * as THREE from 'three'

export function updateSingleQValue(props, boneId, qIndex, newValue) {
    let newSliderValues = { ...props.sliderValues }; // Create shallow clone of old model state
    newSliderValues[boneId][qIndex] = newValue;
    props.setSliderValues(newSliderValues);
}

export function batchUpdateObject(props, boneId, slideArray) {
    let newSliderValues = Object.getOwnPropertyNames(props.sliderValuesShadowCopy).length > 0 ? {...props.sliderValuesShadowCopy} : { ...props.sliderValues }; // Create shallow clone of old model state
    newSliderValues[boneId] = slideArray;
    let newQ = new THREE.Quaternion(slideArray[0], slideArray[1], slideArray[2], slideArray[3]);
    
    let newGlobalQ = props.useGlobalQs.current ? 
        newQ :
        props.getGlobalFromLocal(props, props.bones, newQ, boneId);

    let newLocalQ = props.useGlobalQs.current ?
        props.getLocalFromGlobal(props, newQ, boneId) :
        newQ;

    props.globalQs[boneId] = newGlobalQ;

    props.bones[boneId].quaternion.set(newLocalQ.x, newLocalQ.y, newLocalQ.z, newLocalQ.w);

    let affectedByInheritance = [];
    
    if (props.childrenOf[boneId]) affectedByInheritance.push(...props.childrenOf[boneId])

    if (props.playTimerId.current === 0 && (props.dev && props.selectedFile === "")) { // (Don't bother doing this when viewing pre-recorded data, or if we aren't in dev mode and running tests.)
        while (affectedByInheritance.length > 0) {
            let currentBone = affectedByInheritance.shift();
            if (props.childrenOf[currentBone]) affectedByInheritance.push(...props.childrenOf[currentBone])
            if (props.useRipple) {
                // We don't have to "DO" anything to the model. This is default behavior.
                // Just update the sliders.
                let currLocalQ = props.bones[currentBone].quaternion;
                let currGlobalQ = props.getGlobalFromLocal(props, props.bones, currLocalQ, currentBone);
                let sliderQ = props.useGlobalQs.current ? currGlobalQ : currLocalQ;
                newSliderValues[currentBone] = [sliderQ.x, sliderQ.y, sliderQ.z, sliderQ.w];
                props.globalQs[currentBone] = currGlobalQ;
            } else {
                // This is NOT the default behavior.
                let oldGlobalQ = props.globalQs[currentBone];
                // Note: scope
                let newLocalQ = props.getLocalFromGlobal(props, oldGlobalQ, currentBone);
                let sliderQ = props.useGlobalQs.current ? oldGlobalQ : newLocalQ;
                props.bones[currentBone].quaternion.set(newLocalQ.x, newLocalQ.y, newLocalQ.z, newLocalQ.w);
                newSliderValues[currentBone] = [sliderQ.x, sliderQ.y, sliderQ.z, sliderQ.w];
            }
        }
    }

    props.sliderValuesShadowCopy = newSliderValues;
    props.setSliderValues(newSliderValues);
    props.setModelNeedsUpdating(true);
}