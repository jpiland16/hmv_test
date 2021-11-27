import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress'
import * as THREE from 'three'

const USE_GLOBAL = true;
const REPEAT = false;
const FPS = 30;

const boneList = {
    'ROOT': 46,
    'BACK': 46,
    'RUA': 59,
    'RLA': 72,
    'LUA': 85,
    'LLA': 98
};

let s = 0.707

let outgoingRequest = false;

function scaleToMag1([a, b]) {
    let sq = a * a + b * b;
    if (sq == 0) return [0, 1]
    else {
        let d = Math.sqrt(sq)
        return [a/d, b/d]
    }
}

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
            }]

            let x = new XMLHttpRequest();
            x.open("GET", "/files/demo/demo-anyname/quaternion_data.dat");

            x.onload = () => {
                let inputArray = x.responseText.split("\n");
                let linesArray = [];

                for (let i = 0; i < inputArray.length - 1; i++) { // Last line is blank
                    linesArray[i] = inputArray[i].split(" ");
                }

                props.data.current = linesArray;
                props.visualizer.reset();
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

            props.lastIndex.current = props.timeSliderValue;
            
            const dataObj = { }
            for (let i = 0; i < boneNames.length; i++) {
                let columnStart = boneList[boneNames[i]];

                let q1; //this quaternion rotates the limb to the identity quaternion in OPPORTUNITY world
                if(i <= 1){ //if the bone is BACK
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

                dataObj[boneNames[i]] = targetQ

                if (i == 0) { // ROOT
                    
                    // Move legs

                    let upperRightLegQuaternion = new THREE.Quaternion(0, 0, 1, 0); 
                    let [y, w] = scaleToMag1([targetQ.y, targetQ.w])
                    // -y because axis is upside down
                    let compassQuaternion = new THREE.Quaternion(0, -y, 0, w);
                    upperRightLegQuaternion.multiply(compassQuaternion);

                    let lowerRightLegQuaternion = new THREE.Quaternion().copy(upperRightLegQuaternion)
                    
                    let upperRightLegAccelerometerValue = props.data.current[props.timeSliderValue][2]; // Y
                    upperRightLegAccelerometerValue = Math.max(-1000, Math.min(upperRightLegAccelerometerValue, 1000))                    

                    let upperRightLegElevationAngle = Math.acos(upperRightLegAccelerometerValue / 1000) // radians
                    let upperRightLegElevationQ = new THREE.Quaternion(Math.sin(upperRightLegElevationAngle/2), 0, 0, Math.cos(upperRightLegElevationAngle / 2))
                    upperRightLegQuaternion.multiply(upperRightLegElevationQ)

                    let lowerRightLegAccelerometerValue = props.data.current[props.timeSliderValue][20]; // Y
                    lowerRightLegAccelerometerValue = Math.max(-1000, Math.min(lowerRightLegAccelerometerValue, 1000))                    

                    let lowerRightLegElevationAngle = Math.acos(lowerRightLegAccelerometerValue / 1000) // radians
                    let lowerRightLegElevationQ = new THREE.Quaternion(Math.sin(lowerRightLegElevationAngle/2), 0, 0, Math.cos(lowerRightLegElevationAngle / 2))
                    lowerRightLegQuaternion.multiply(lowerRightLegElevationQ)

                    let multiply = 1;

                    if (props.data.current[props.timeSliderValue][243] == 2) // Walk
                        multiply = -1;

                    let upperLeftLegQuaternion = new THREE.Quaternion(0, 0, 1, 0); 
                    upperLeftLegQuaternion.multiply(compassQuaternion)
                    let upperLeftLegElevationQ = new THREE.Quaternion(multiply * Math.sin(upperRightLegElevationAngle/2), 0, 0, Math.cos(upperRightLegElevationAngle / 2))
                    upperLeftLegQuaternion.multiply(upperLeftLegElevationQ)

                    let lowerLeftLegQuaternion = new THREE.Quaternion(0, 0, 1, 0); 
                    lowerLeftLegQuaternion.multiply(compassQuaternion)
                    let lowerLeftLegElevationQ = new THREE.Quaternion(multiply * Math.sin(lowerRightLegElevationAngle/2), 0, 0, Math.cos(lowerRightLegElevationAngle / 2))
                    lowerLeftLegQuaternion.multiply(lowerLeftLegElevationQ)

                    dataObj["LUL"] = upperLeftLegQuaternion
                    dataObj["RUL"] = upperRightLegQuaternion
                    dataObj["LLL"] = lowerLeftLegQuaternion
                    dataObj["RLL"] = lowerRightLegQuaternion

                    // Adjust position

                    let yAxVector = new THREE.Vector3(0, 1, 0);
                    let newVector = new THREE.Vector3().copy(yAxVector)
                    newVector.applyQuaternion(targetQ)

                    let ROOT_MIDHEIGHT = 90

                    props.visualizer.bones.ROOT.position.x = ROOT_MIDHEIGHT *  ( - newVector.x);
                    props.visualizer.bones.ROOT.position.y = ROOT_MIDHEIGHT * (1 - newVector.y);
                    props.visualizer.bones.ROOT.position.z = ROOT_MIDHEIGHT *  ( - newVector.z);
                
                }

                props.visualizer.acceptData(dataObj)

            }

             // lshoe compass i 117 / rshoe i 133

            //  let lshoeCompassValue = props.data.current[props.timeSliderValue][117];
            //  let legQuaternion = new THREE.Quaternion(0, 0, 1, 0); 

            //  let compassQuaternion = new THREE.Quaternion(0, Math.cos(lshoeCompassValue / 2), 0, Math.sin(lshoeCompassValue / 2))

            //  legQuaternion.multiply(compassQuaternion);

            //  props.batchUpdate("LUL", [legQuaternion.x, legQuaternion.y, legQuaternion.z, legQuaternion.w]);
            //  props.batchUpdate("RUL", [legQuaternion.x, legQuaternion.y, legQuaternion.z, legQuaternion.w]);
        }
    });

    return (
        <div>
            <div>{props.data.current.length > 0 ? 
                <div>
                    File downloaded successfully.
                </div> : `File downloading: ${progress}% complete`}</div>
            { props.data.current.length === 0 && <LinearProgress variant="determinate" value={progress} /> }
            <a href="https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/components/main-panel/subpanels/Labs/Jonathan20210608/UseAccel.js" target="_blank" rel="noreferrer">View relevant code</a>
        </div>
    )
}