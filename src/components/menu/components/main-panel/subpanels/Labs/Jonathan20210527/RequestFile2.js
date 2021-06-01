import React from 'react';
import * as THREE from 'three'
import LinearProgress from '@material-ui/core/LinearProgress'
import Slider from '@material-ui/core/Slider'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const boneList = {
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
const h = 0.5

const possibleQuaternions = [
    new THREE.Quaternion(0, 0, 0, 1),
    new THREE.Quaternion(1, 0, 0, 0),
    new THREE.Quaternion(0, 1, 0, 0),
    new THREE.Quaternion(0, 0, 1, 0),
    new THREE.Quaternion(s,  s, 0, 0),
    new THREE.Quaternion(s, -s, 0, 0),
    new THREE.Quaternion(s, 0,  s, 0),
    new THREE.Quaternion(s, 0, -s, 0),
    new THREE.Quaternion(s, 0, 0,  s),
    new THREE.Quaternion(s, 0, 0, -s),
    new THREE.Quaternion(0, s,  s, 0),
    new THREE.Quaternion(0, s, -s, 0),
    new THREE.Quaternion(0, s, 0,  s),
    new THREE.Quaternion(0, s, 0, -s),
    new THREE.Quaternion(0, 0, s,  s),
    new THREE.Quaternion(0, 0, s, -s),
    new THREE.Quaternion(h, h, h, h),
    new THREE.Quaternion(-h, h, h, h),
    new THREE.Quaternion(h, -h, h, h),
    new THREE.Quaternion(h, h, -h, h),
    new THREE.Quaternion(h, h, h, -h),
    new THREE.Quaternion(h, -h, h, -h),
    new THREE.Quaternion(h, -h, -h, h),
    new THREE.Quaternion(h, h, -h, -h)
]

let outgoingRequest = false;

export default function GeneratedData(props) {

    let initialIndices = {};
    let initialBonesActive = {}
    Object.getOwnPropertyNames(boneList).map((name) => {
        initialIndices[name] = 0;
        initialBonesActive[name] = name === "ROOT";
    });

    const [ progress, setProgress ] = React.useState(0);
    const [ index, setIndex ] = React.useState(initialIndices);
    const [ bonesActive, setBonesActive ] = React.useState(initialBonesActive);
    const [ applyExtra, setApplyExtra ] = React.useState(true);

    if (props.data.current.length === 0) {

        if(!outgoingRequest) {
            
            
            props.repeat.current = REPEAT;
            props.FPS.current = FPS;
            props.lastIndex.current = -1;

            props.outputTypes.current = [{
                startCol: 243,
                columnCount: 6
            }]
            // ,{
            //     startCol: boneList.BACK,
            //     columnCount: 4,
            //     rowsBefore: 0,
            //     rowsAfter: 5
            // },{
            //     startCol: boneList.RUA,
            //     columnCount: 4,
            //     rowsBefore: 0,
            //     rowsAfter: 5
            // },{
            //     startCol: boneList.RLA,
            //     columnCount: 4,
            //     rowsBefore: 0,
            //     rowsAfter: 5
            // },{
            //     startCol: boneList.LUA,
            //     columnCount: 4,
            //     rowsBefore: 0,
            //     rowsAfter: 5
            // },{
            //     startCol: boneList.LLA,
            //     columnCount: 4,
            //     rowsBefore: 0,
            //     rowsAfter: 5
            // }]

            let x = new XMLHttpRequest();
            x.open("GET", window.location.href === "http://localhost:3000/" ? 
                "https://raw.githubusercontent.com/jpiland16/hmv_test/master/files/demo/S4-ADL4.dat" : 
                "files/demo/S4-ADL4.dat");
                // "files/opportunity-dataset/dataset/S1-Drill.dat");

            x.onload = () => {
                let inputArray = x.responseText.split("\n");
                let linesArray = [];

                for (let i = 0; i < inputArray.length - 1; i++) { // Last line is blank
                    linesArray[i] = inputArray[i].split(" ");
                }

                props.data.current = linesArray;
                props.resetModel();
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
                if (bonesActive[boneNames[i]]) {
                    let columnStart = boneList[boneNames[i]];
                    let q = new THREE.Quaternion(
                        props.data.current[props.timeSliderValue][columnStart + 1] / 1000, // X
                        props.data.current[props.timeSliderValue][columnStart + 2] / 1000, // Y
                        props.data.current[props.timeSliderValue][columnStart + 3] / 1000, // Z
                        props.data.current[props.timeSliderValue][columnStart + 0] / 1000, // W
                    );
                    
                    /* Transform our coordinate system */
                    q.premultiply(new THREE.Quaternion(0.5, 0.5, 0.5, 0.5));
                    q.multiply(new THREE.Quaternion(0.5, 0.5, 0.5, -0.5));

                    /* Rotate the back to the correct initial position */
                    //q.premultiply(new THREE.Quaternion(-0.5, 0.5, -0.5, 0.5));
                    q.premultiply(possibleQuaternions[index[boneNames[i]]]);
                    
                    if (applyExtra && boneNames[i] === 'ROOT') {
                        q.multiply(new THREE.Quaternion(0, 0.707, 0, 0.707))
                    }

                    props.lastIndex.current = props.timeSliderValue;
                    props.batchUpdate(boneNames[i], [q.x, q.y, q.z, q.w]);
                }
            }
        }
    });

    const handleIndexChange = (boneName, newIndex) => {
        let newIndices = {...index};
        newIndices[boneName] = newIndex;
        setIndex(newIndices);
        props.lastIndex.current = -1;
    }

    const handleCheckChange = (boneName, checked) => {
        let newBonesActive = {...bonesActive};
        newBonesActive[boneName] = checked;
        setBonesActive(newBonesActive);
        props.resetModel();
        props.lastIndex.current = -1;
    }

    return (
        <div>
            <div>{props.data.current.length > 0 ? 
                <div>
                    File downloaded successfully.
                    <hr/>
                    <FormControlLabel
                        control={<Checkbox checked={applyExtra} onClick={(event) => {
                            setApplyExtra(event.target.checked)
                            props.resetModel();
                            props.lastIndex.current = -1;
                        }}/>}
                        label="Apply extra rotation to back"
                    />
                    {Object.getOwnPropertyNames(boneList).map((boneName) => {
                        return (
                            <div key={boneName} style={{
                                margin: "2px",
                                padding: "9px",
                                backgroundColor: "#efefef",
                                borderRadius: "6px"
                            }}>
                                <Slider min={0} max={possibleQuaternions.length - 1} value={index[boneName]} onChange={(event, newValue) => { handleIndexChange(boneName, newValue) }} />
                                <div>
                                    {boneName} q-index: {index[boneName]}
                                    <div style={{ float: "right", marginRight: "-9px"}}>
                                        <FormControlLabel 
                                            label="Active" 
                                            labelPlacement="start"
                                            control={<Checkbox 
                                                checked={bonesActive[boneName]} 
                                                onClick={(event) => handleCheckChange(boneName, event.target.checked)}
                                            />}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                        

                </div> : `File downloading: ${progress}% complete`}</div>
            { props.data.current.length === 0 && <LinearProgress variant="determinate" value={progress} /> }
            <a href="https://github.com/jpiland16/hmv_test/blob/master/src/components/menu/components/main-panel/subpanels/Labs/Jonathan20210527/RequestFile2.js" target="_blank" rel="noreferrer">View relevant code</a>
        </div>
    )
}