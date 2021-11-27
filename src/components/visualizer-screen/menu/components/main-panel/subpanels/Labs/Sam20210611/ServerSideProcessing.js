import * as THREE from 'three';
import React from 'react';

const TARGET_BONE = 'LUA';
const USE_GLOBAL = true;
const AUTO_RIPPLE = true;
const REPEAT = true;
const FPS = 20;

const LIMBS = [{ boneName: "LUA", startCol: 79 }, { boneName: "LLA", startCol: 92 }];

var quatStorage = [];
let indexList = [];

let outgoingRequest = false;

let quat_o_t = new THREE.Quaternion(-0.5,-0.5,-0.5,0.5); //Quaternion from OPP space to THREE space

function postRequest(props) {
    console.log("About to send post request.");
    const formData = new FormData();
    formData.append('file', document.getElementById('myFile').files[0]);
    formData.append('start_column', '76');
    formData.append('time_column', '0');
    formData.append('params', "Some parameters");
  
    let x = new XMLHttpRequest();
    x.onload = (event => {
        console.log("POST request complete!");
        // console.log(x.response);
        quatStorage = handleServerResponse(x.response);
        let indexList = [];
        for (let i = 0; i < quatStorage.length; i ++) {
            indexList[i] = i;
        }
        console.log("Modifying props...");
        props.data.current = indexList;
        console.log(props);
    });
    x.open("POST", "/api/post");
    // TODO: Right now the response is in the default 'text' format, but it might
    // be more appropriate to use another format.
    x.send(formData);
    console.log("Post request has been sent.");
}

function handleServerResponse(response) {
    let quatArray = []
    // set quatStorage to be the received quaternions
    console.log("Handling response lines...")
    let responseLines = response.split('\\r\\n');
    for (let i = 4; i < responseLines.length; i ++) {  // For now, skip the 'number of quaternions' parameter
        if (responseLines[i].charAt(0) === '#' || responseLines[i].charAt(0) === '{' || responseLines[i].charAt(0) === '"' || responseLines[i].charAt(0) === '\r') {
            continue;
        }
        console.log(responseLines[i]);
        let responseNums = responseLines[i].split(' ');
        if (responseNums.length < 4) {
            continue;
        }
        console.log(responseNums);
        let qData = new THREE.Quaternion(parseFloat(responseNums[1]), parseFloat(responseNums[1]), parseFloat(responseNums[2]), parseFloat(responseNums[0]));
        qData.normalize();
        quatArray.push(qData);
    }
    return quatArray;
}

export default function ServerSideProcessing(props) {

    if (props.data.current.length === 0) {
        for (let i = 0; i < 900; i ++) {
            indexList[i] = ""+i;
        }
        props.data.current = indexList;
        props.repeat.current = REPEAT;
        props.FPS.current = FPS;
        props.lastIndex.current = -1;
        console.log("props has been set");
        console.log(props);
        props.setTimeSliderValue(1);  //For some reason, I must set the time slider value to be nonzero to enable the slider.
    }

    React.useEffect(() => {
        
        if (props.timeSliderValue !== props.lastIndex.current && quatStorage.length > 0) { // We need to update the model, because the timeSlider has moved
            const dataObj = { }
            let q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/2);
            let q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);

            let q_post1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/2);

            let lineQuat = (quatStorage[props.timeSliderValue]);

            let final_q = new THREE.Quaternion().copy(q1);
            final_q.multiply(q2);
            final_q.multiply(lineQuat);
            final_q.multiply(q_post1);
            let q = final_q;
            dataObj.LUA = q
            props.lastIndex.current = props.timeSliderValue;
            props.visualizer.acceptData(dataObj)
        }
    });

    return (
        <div>
            <button onClick={(e) => postRequest(props)}>POST request</button>
            <a href="https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/components/main-panel/subpanels/Labs/Sam20210611/ServerSideProcessing.js" target="_blank" rel="noreferrer">View relevant code</a>
            <input type="file" id="myFile"/>
        </div>
    )
}