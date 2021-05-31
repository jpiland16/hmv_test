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

const REPEAT = false;
const FPS = 30;

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
            x.open("GET", window.location.href === "http://localhost:3000/" ? 
                "https://raw.githubusercontent.com/jpiland16/hmv_test/master/files/demo/S4-ADL4.dat" : 
                "files/demo/S4-ADL4.dat");

            x.onload = () => {
                let inputArray = x.responseText.split("\n");
                let linesArray = [];

                for (let i = 0; i < inputArray.length - 1; i++) { // Last line is blank
                    linesArray[i] = inputArray[i].split(" ");
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
        props.useGlobalQs.current = USE_GLOBAL;
        if (props.timeSliderValue !== props.lastIndex.current && props.data.current.length > 0) { // We need to update the model, because the timeSlider has moved
            let boneNames = Object.getOwnPropertyNames(boneList);
            for (let i = 0; i < boneNames.length; i++) {
                let columnStart = boneList[boneNames[i]];
                let q1=new THREE.Quaternion()
                if(i==0){
                    q1.x=0
                    q1.y=0
                    q1.z=Math.sqrt(2)/2
                    q1.w=Math.sqrt(2)/2
                    q1.premultiply(new THREE.Quaternion(1,0,0,0))
                } else{
                    q1.x=0
                    q1.y=0
                    q1.z=Math.sqrt(2)/-2
                    q1.w=Math.sqrt(2)/2
                }
                let q2=new THREE.Quaternion(props.data.current[props.timeSliderValue][columnStart + 1], // X
                    props.data.current[props.timeSliderValue][columnStart + 2], // Y
                    props.data.current[props.timeSliderValue][columnStart + 3], // Z
                    props.data.current[props.timeSliderValue][columnStart + 0], // W
                )
                q2.normalize()
                let q3=new THREE.Quaternion()
                q3.multiplyQuaternions(q2,q1)
                props.lastIndex.current = props.timeSliderValue;
                props.batchUpdate(boneNames[i], [q3.x, q3.y, q3.z, q3.w]);
            }
        }
    });

    return (
        <div>
            <div>{props.data.current.length > 0 ? "File downloaded successfully." : `File downloading: ${progress}% complete`}</div>
            { props.data.current.length === 0 && <LinearProgress variant="determinate" value={progress} /> }
            <a href="https://github.com/jpiland16/hmv_test/blob/master/src/components/menu/components/main-panel/subpanels/Labs/Sophie20210530/test1.js" target="_blank" rel="noreferrer">View relevant code</a>
        </div>
    )
}