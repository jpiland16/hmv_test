import React from 'react'
import * as THREE from 'three'

const boneList = {
    'BACK': 46,
    'ROOT': 46,
    'RUA': 59,
    'RLA': 72,
    'LUA': 85,
    'LLA': 98
};

const USE_GLOBAL = true;
const REPEAT = false;
const FPS = 30;

const s = Math.sqrt(2) / 2;

export default function Animator(props) {

    if (props.data.current.length === 0) {
            
            props.repeat.current = REPEAT;
            props.FPS.current = FPS;
            props.lastIndex.current = -1;

    }

    React.useEffect(() => {
        props.useGlobalQs.current = USE_GLOBAL;

        props.outputTypes.current = [{
            startCol: 243,
            columnCount: 6
        }];

        if (props.timeSliderValue !== props.lastIndex.current && props.data.current.length > 0) { // We need to update the model, because the timeSlider has moved
            let boneNames = Object.getOwnPropertyNames(boneList);
           // let quaternion
            for (let i = 0; i < boneNames.length; i++) {
                let columnStart = boneList[boneNames[i]];

                let q1; //this quaternion rotates the limb to the identity quaternion in OPPORTUNITY world
                if(i <= 1){ //if the bone is BACK or ROOT
                    q1 = new THREE.Quaternion(s, -s, 0, 0);
                } else{ //if the bone is an arm
                    q1 = new THREE.Quaternion(s, s, 0, 0);
                }

                let q2=new THREE.Quaternion(
                    props.data.current[props.timeSliderValue][columnStart + 1] / 1000, // X
                    props.data.current[props.timeSliderValue][columnStart + 2] / 1000, // Y
                    props.data.current[props.timeSliderValue][columnStart + 3] / 1000, // Z
                    props.data.current[props.timeSliderValue][columnStart + 0] / 1000, // W
                )

                let targetQ = new THREE.Quaternion()
                targetQ.multiplyQuaternions(q2,q1) //adds the OPP quaternion to the new "identity quaternion"

                targetQ.premultiply(new THREE.Quaternion(s, 0, 0, -s)) //rotates body to stand upright
                
                props.lastIndex.current = props.timeSliderValue;
                props.batchUpdate(boneNames[i], [targetQ.x, targetQ.y, targetQ.z, targetQ.w]);
            }
        }
        
    });

    return (
        <div style={{display: "none"}}></div>
    )
}