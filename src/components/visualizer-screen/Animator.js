import React from 'react'
import * as THREE from 'three'

// For JSdoc
import { BasicVisualizerObject } from '../shared_visualizer_object/Visualizer';

const USE_GLOBAL = true;
const REPEAT = false;
const FPS = 30;

export default function Animator(props) {

    if (props.data.current.length === 0 && props.selectedFile !== "") {
            
            props.repeat.current = REPEAT;
            props.FPS.current = FPS;
            props.lastIndex.current = -1;

    }

    /**
     * @param {Object[]} props.fileMetadata.current.targets A list of Objects,
     * each containing the data associated with the movement of one bone on the model.
     * @param {Object} props.fileMetadata.current.globalTransformQuaternion An Object
     * whose (w,x,y,z) properties map to the global transform quaternion's fields.
     * @param {Object} props.fileMetadata.current.floatsMultiplied Defined as true
     * if the file data is multiplied by a factor of 1000 (in order to avoid putting 
     * a decimal point).
     * @param {number} props.data.current The array of file data, where each
     * row represents data at a uniform timestamp.
     * @param {number} props.lastIndex.current The last recorded index of viewed quaternions.
     * The currently displayed data (before this operation) should be at this index in
     * the file data.
     * @param {boolean} props.visualizer.modelLoaded True if the visualizer is
     * accepting incoming quaternion transformations.
     * @param {String} props.fileMetadata.current.targets[].bone The name of the bone associated
     * with a target sensor of the current dataset.
     * @param {BasicVisualizerObject} props.visualizer
     */
    function applyDataQuaternions(props, timeValue) {
        let targets = props.fileMetadata.current.targets;
        let GTQ = props.fileMetadata.current.globalTransformQuaternion

        let newQs = { }

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

            if (props.verbose) console.log("Animator is ordering a batch update for time slider value " + props.timeSliderValue);

            newQs[boneName] = targetQ;
        }
        
        if (props.visualizer.modelLoaded) props.visualizer.acceptData(newQs);
    }

    React.useEffect(() => {
        if (props.selectedFile.fileName === "") { return; }

        props.outputTypes.current = [{
            startCol: 243,
            columnCount: 6
        }];

        if (props.timeSliderValue !== props.lastIndex.current // We need to update the model, because the timeSlider has moved
                && props.data.current.length > 0 && props.fileMetadata.current !== null // Make sure we have the data we need
                && props.fileStatus.status !== "Loading file") { // Make sure we aren't in the process of loading data
            
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