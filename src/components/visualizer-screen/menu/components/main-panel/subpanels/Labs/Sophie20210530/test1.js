import React from 'react';
import * as THREE from 'three'
import LinearProgress from '@material-ui/core/LinearProgress'
import { Vector3 } from 'three';

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
const FPS = 60;

let outgoingRequest = false;

export default function GeneratedData(props) {

    const [ progress, setProgress ] = React.useState(0);

    if (props.data.current.length === 0) {

        if(!outgoingRequest) {

            props.repeat.current = REPEAT;
            props.FPS.current = FPS;
            props.lastIndex.current = -1;

            props.outputTypes.current = [{
                startCol: 243,
                columnCount: 6
            },{
                startCol: boneList.BACK,
                columnCount: 4,
                rowsBefore: 0,
                rowsAfter: 5
            },{
                startCol: boneList.RUA,
                columnCount: 4,
                rowsBefore: 0,
                rowsAfter: 5
            },{
                startCol: boneList.RLA,
                columnCount: 4,
                rowsBefore: 0,
                rowsAfter: 5
            },{
                startCol: boneList.LUA,
                columnCount: 4,
                rowsBefore: 0,
                rowsAfter: 5
            },{
                startCol: boneList.LLA,
                columnCount: 4,
                rowsBefore: 0,
                rowsAfter: 5
            }]

            let x = new XMLHttpRequest();
            x.open("GET", "/files/demo/demo-anyname/quaternion_data.dat");

            x.onload = () => {
                let inputArray = x.responseText.split("\n");
                let linesArray = [];

                for (let i = 0; i < inputArray.length - 1; i+=3) { // Using every three lines to triple the speed
                    linesArray[i/3] = inputArray[i].split(" ");
                }

                props.data.current = linesArray;
                outgoingRequest = false;
            }

            x.onprogress = (event) => {
                setProgress(Math.round(event.loaded / event.total * 100));
            }

            x.onerror = (error) => {
                console.log(error);
            }

            x.send();
            outgoingRequest = true;
        }

    }

    React.useEffect(() => {
        
        if (props.timeSliderValue !== props.lastIndex.current && props.data.current.length > 0) { // We need to update the model, because the timeSlider has moved
            let boneNames = Object.getOwnPropertyNames(boneList);
            // let quaternion
            const dataObj = { }
            for (let i = 0; i < boneNames.length; i++) {
                let columnStart = boneList[boneNames[i]];

                let q1 //this quaternion rotates the limb to the identity quaternion in OPPORTUNITY world
                if(i<=1){ //if the bone is BACK or ROOT
                    q1=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),Math.PI/2)
                } else{ //if the bone is an arm
                    q1=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),Math.PI/-2)
                }
                q1.premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),Math.PI))

                let q2=new THREE.Quaternion(
                    props.data.current[props.timeSliderValue][columnStart + 1], // X
                    props.data.current[props.timeSliderValue][columnStart + 2], // Y
                    props.data.current[props.timeSliderValue][columnStart + 3], // Z
                    props.data.current[props.timeSliderValue][columnStart + 0], // W
                )
                q2.normalize() //normalized quaternion from OPPORTUNITY data

                let targetq=new THREE.Quaternion()
                targetq.multiplyQuaternions(q2,q1) //adds the OPP quaternion to the new "identity quaternion"

                let q4=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),-Math.PI/2) //rotates body to stand upright

                targetq.premultiply(q4)

                props.lastIndex.current = props.timeSliderValue;
                dataObj[boneNames[i]] = targetq
            }

            props.visualizer.acceptData(dataObj)
        }
        
    });

    return (
        <div>
            <div>{props.data.current.length > 0 ? "File downloaded successfully." : `File downloading: ${progress}% complete`}</div>
            { props.data.current.length === 0 && <LinearProgress variant="determinate" value={progress} /> }
            <a href="https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/components/main-panel/subpanels/Labs/Sophie20210530/test1.js" target="_blank" rel="noreferrer">View relevant code</a>
        </div>
    )
}