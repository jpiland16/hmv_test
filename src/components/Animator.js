import React from 'react'
import * as THREE from 'three'

const USE_GLOBAL = true;
const REPEAT = false;
const FPS = 30;

// Topological sorted order of bones:
// Bone A comes before bone B iff bone A's orientation affects the
// position of bone B.
const bonesToplogical = [
    "ROOT",
    "RUL",
    "RLL",
    "RSHOE",
    "LUL",
    "LLL",
    "LSHOE",
    "RUA",
    "RLA",
    "LUA",
    "LLA"
]

/**
 * Compares two items based on their position in a reference array.
 * Allows sorting a subset of the reference array based on the order of the 
 * full array. Can be passed into `Array.sort()`.
 * @param {Array} targetArray The target order for all possible items.
 * @param firstItem The item that comes first in the array being sorted.
 * @param secondItem An item that comes after `secondItem` in the array being
 * sorted.
 * @returns A number <= 0 if the items are in the correct order, and a
 * value > 0 otherwise.
 */
function compareByArrayFit(targetArray, firstItem, secondItem) {
    let firstItemIndex = targetArray.indexOf(firstItem);
    let secondItemIndex = targetArray.indexOf(secondItem);
    return firstItemIndex - secondItemIndex;
}

export default function Animator(props) {

    if (props.data.current.length === 0 && props.selectedFile !== "") {
            
            props.repeat.current = REPEAT;
            props.FPS.current = FPS;
            props.lastIndex.current = -1;

    }

    function applyDataQuaternions(props, timeValue) {
        let targets = props.fileMetadata.current.targets;
        targets.sort((firstBone, secondBone) => compareByArrayFit(bonesToplogical, firstBone.bone, secondBone.bone));
        let GTQ = props.fileMetadata.current.globalTransformQuaternion

        for (let i = 0; i < targets.length; i++) {
            let boneName = targets[i].bone
            let columnStart = targets[i].column;
            let LTQ = targets[i].localTransformQuaternion;

            let q1 = new THREE.Quaternion(LTQ.x, LTQ.y, LTQ.z, LTQ.w); // this quaternion rotates the limb to the identity quaternion in OPPORTUNITY world

            let divisionFactor = props.fileMetadata.current.floatsMultiplied? 1000 : 1;
            
            let q2=new THREE.Quaternion(
                // props.data.current[props.timeSliderValue][columnStart + 1] / 1000, // X
                // props.data.current[props.timeSliderValue][columnStart + 2] / 1000, // Y
                // props.data.current[props.timeSliderValue][columnStart + 3] / 1000, // Z
                // props.data.current[props.timeSliderValue][columnStart + 0] / 1000, // W
                props.data.current[props.timeSliderValue][columnStart + 1] / divisionFactor, // X
                props.data.current[props.timeSliderValue][columnStart + 2] / divisionFactor, // Y
                props.data.current[props.timeSliderValue][columnStart + 3] / divisionFactor, // Z
                props.data.current[props.timeSliderValue][columnStart + 0] / divisionFactor, // W
            )

            let targetQ = new THREE.Quaternion()
            targetQ.multiplyQuaternions(q2,q1) // adds the OPP quaternion to the new "identity quaternion"

            targetQ.premultiply(new THREE.Quaternion(GTQ.x, GTQ.y, GTQ.z, GTQ.w)) // rotates body to stand upright
            
            props.lastIndex.current = props.timeSliderValue;

            console.log("Animator is ordering a batch update for time slider value " + props.timeSliderValue);
            props.batchUpdate(boneName, [targetQ.x, targetQ.y, targetQ.z, targetQ.w]);
        }
    }

    React.useEffect(() => {
        if (props.selectedFile.fileName === "") { return; }

        props.useGlobalQs.current = USE_GLOBAL;

        props.outputTypes.current = [{
            startCol: 243,
            columnCount: 6
        }];

        if (props.timeSliderValue !== props.lastIndex.current // We need to update the model, because the timeSlider has moved
                && props.data.current.length > 0 && props.fileMetadata.current !== null) { // Make sure we have the data we need
            
            props.lastIndex.current = props.timeSliderValue;
            applyDataQuaternions(props, props.timeSliderValue);
        }        
    });

    React.useEffect(() => {
        if (props.fileStatus && props.fileStatus.status === 'Complete') {
            props.lastIndex.current = props.timeSliderValue;
            applyDataQuaternions(props, props.timeSliderValue);
        }
    }, [props.bones, props.fileStatus])
    

    return (
        <div style={{display: "none"}}></div>
    )
}