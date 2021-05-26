import React from 'react';
import * as THREE from 'three'
import LinearProgress from '@material-ui/core/LinearProgress'

const boneList = {
    'BACK': 46,
    'RUA': 59,
    'RLA': 72,
    'LUA': 85,
    'LLA': 98
};

const USE_GLOBAL = true;
const AUTO_RIPPLE = true;
const REPEAT = false;
const FPS = 30;

let outgoingRequest = false;

export default function GeneratedData(props) {

    const [ progress, setProgress ] = React.useState(0)

    if (props.data.length === 0) {

        if(!outgoingRequest) {
            props.setUseGlobalQs(USE_GLOBAL);
            props.setUseRipple(AUTO_RIPPLE);
            props.setRepeat(REPEAT);
            props.setFPS(FPS);
            props.setLastIndex(-1);

            let x = new XMLHttpRequest();
            x.open("GET", "/files/demo/S4-ADL4.dat");

            x.onload = () => {
                let inputArray = x.responseText.split("\n");
                let linesArray = [];

                for (let i = 0; i < inputArray.length - 1; i++) { // Last line is blank
                    linesArray[i] = inputArray[i].split(" ");
                }

                props.setData(linesArray);
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

    let boneNames = Object.getOwnPropertyNames(boneList);
    
    if (props.timeSliderValue !== props.lastIndex && props.data.length > 0) { // We need to update the model, because the timeSlider has moved
        for (let i = 0; i < boneNames.length; i++) {
            let columnStart = boneList[boneNames[i]];
            let q = new THREE.Quaternion(
                props.data[props.timeSliderValue][columnStart + 1] / 1000, // X
                props.data[props.timeSliderValue][columnStart + 2] / 1000, // Y
                props.data[props.timeSliderValue][columnStart + 3] / 1000, // Z
                props.data[props.timeSliderValue][columnStart + 0] / 1000, // W
            );
            props.setLastIndex(props.timeSliderValue);
            props.batchUpdate(boneNames[i], [q.x, q.y, q.z, q.w]);
        }
    }

    return (
        <div>
            <div>{props.data.length > 0 ? "File downloaded successfully." : `File downloading: ${progress}% complete`}</div>
            { props.data.length === 0 && <LinearProgress variant="determinate" value={progress} /> }
            <a href="https://github.com/jpiland16/hmv_test/blob/master/src/components/menu/components/main-panel/subpanels/Labs/Jonathan20210526/RequestFile.js" target="_blank" rel="noreferrer">View relevant code</a>
        </div>
    )
}