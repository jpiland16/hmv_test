import React from 'react'
import * as THREE from 'three'

const USE_GLOBAL = true;
const REPEAT = false;
const FPS = 30;

export default function Animator(props) {

    if (props.data.current.length === 0 && props.selectedFile !== "") {
            
            props.repeat.current = REPEAT;
            props.FPS.current = FPS;
            props.lastIndex.current = -1;

    }

    React.useEffect(() => {

        if (props.selectedFile !== "") {

            props.useGlobalQs.current = USE_GLOBAL;

            props.outputTypes.current = [{
                startCol: 243,
                columnCount: 6
            }];

            if (props.timeSliderValue !== props.lastIndex.current // We need to update the model, because the timeSlider has moved
                    && props.data.current.length > 0 && props.fileMetadata.current !== null) { // Make sure we have the data we need
                
                let targets = props.fileMetadata.current.targets;
                let GTQ = props.fileMetadata.current.globalTransformQuaternion
                
                props.lastIndex.current = props.timeSliderValue;

                for (let i = 0; i < targets.length; i++) {
                    let boneName = targets[i].bone
                    let columnStart = targets[i].column;
                    let LTQ = targets[i].localTransformQuaternion;

                    let q1 = new THREE.Quaternion(LTQ.x, LTQ.y, LTQ.z, LTQ.w); // this quaternion rotates the limb to the identity quaternion in OPPORTUNITY world
                    
                    let q2=new THREE.Quaternion(
                        props.data.current[props.timeSliderValue][columnStart + 1] / 1000, // X
                        props.data.current[props.timeSliderValue][columnStart + 2] / 1000, // Y
                        props.data.current[props.timeSliderValue][columnStart + 3] / 1000, // Z
                        props.data.current[props.timeSliderValue][columnStart + 0] / 1000, // W
                    )

                    let targetQ = new THREE.Quaternion()
                    targetQ.multiplyQuaternions(q2,q1) // adds the OPP quaternion to the new "identity quaternion"

                    targetQ.premultiply(new THREE.Quaternion(GTQ.x, GTQ.y, GTQ.z, GTQ.w)) // rotates body to stand upright

                    props.batchUpdate(boneName, [targetQ.x, targetQ.y, targetQ.z, targetQ.w]);
                }
            }

        }
        
    });
    

    return (
        <div style={{display: "none"}}></div>
    )
}