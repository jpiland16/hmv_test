import * as THREE from 'three';
import React from 'react';

const inputData = 
`0.6532814824381883 0.6532814824381883 0.2705980500730985 0.2705980500730985
0.6779879364607869 0.6214175397860577 0.2008291762011785 0.3374021950821352
0.6952662127734243 0.582745216528051 0.12885997584859143 0.40050969103590356
0.7049270069651074 0.5376882147304864 0.05547895863492365 0.4592291190026416
0.7068644733530208 0.486740188333842 -0.018509897659266812 0.5129171366417152
0.7010573846499779 0.43045933457687946 -0.09229595564125723 0.5609855267969309
0.6875693645350206 0.3694622782708856 -0.16507079981907163 0.6029076421267909
0.6665481905790779 0.3044173159292038 -0.23603709377078266 0.6382241751629747
0.6382241751629747 0.2360370937707828 -0.3044173159292037 0.6665481905790779
0.602907642126791 0.16507079981907175 -0.36946227827088557 0.6875693645350205
0.5609855267969311 0.09229595564125734 -0.4304593345768793 0.7010573846499778
0.5129171366417153 0.018509897659266996 -0.48674018833384197 0.7068644733530207
0.4592291190026415 -0.05547895863492357 -0.5376882147304864 0.7049270069651074
0.4005096910359036 -0.12885997584859135 -0.582745216528051 0.6952662127734244
0.3374021950821353 -0.20082917620117835 -0.6214175397860578 0.677987936460787
0.2705980500730987 -0.2705980500730983 -0.6532814824381883 0.6532814824381884
0.20082917620117854 -0.3374021950821351 -0.6779879364607869 0.621417539786058
0.12885997584859152 -0.40050969103590356 -0.6952662127734245 0.5827452165280514
0.05547895863492354 -0.45922911900264324 -0.7049270069651089 0.5376882147304876
0.01850989765926635 0.5129171366417258 0.7068644733530347 -0.4867401883338511
0.09229595564125707 0.560985526796931 0.7010573846499779 -0.4304593345768794
0.16507079981907166 0.6029076421267909 0.6875693645350205 -0.36946227827088546
0.2360370937707825 0.6382241751629746 0.666548190579078 -0.30441731592920396
0.30441731592920357 0.6665481905790778 0.6382241751629748 -0.23603709377078297
0.3694622782708855 0.6875693645350206 0.6029076421267912 -0.16507079981907172
0.4304593345768792 0.7010573846499778 0.5609855267969313 -0.0922959556412575
0.4867401883338419 0.7068644733530209 0.5129171366417155 -0.01850989765926704
0.5376882147304862 0.7049270069651074 0.45922911900264185 0.05547895863492327
0.5827452165280509 0.6952662127734243 0.4005096910359038 0.12885997584859116
0.6214175397860577 0.677987936460787 0.33740219508213537 0.20082917620117827
0.6532814824381882 0.6532814824381884 0.27059805007309884 0.2705980500730981`

const START_COL = 0;
const TARGET_BONE = 'LUA';
const USE_GLOBAL = true;
const AUTO_RIPPLE = true;
const REPEAT = true;
const FPS = 20;


const inputArray = inputData.split("\n");

let linesArray = [];
let indicesArray = [];

let quat_o_t = new THREE.Quaternion(-0.5,-0.5,-0.5,0.5); //Quaternion from OPP space to THREE space

function getQuaternionFromLine(lineNum) {
    let line = linesArray[lineNum]
    //          OPPORTUNITY     THREE
    // up       z               y
    // north    x               x
    // east     y               z
    // Based on the above translation, I can just read (w, x, y, z) as (w, x, z, y).
    // BUT when I do that, I end up with a figure 8 similar to with the first generated dataset.
    let q = new THREE.Quaternion(line[START_COL+1], line[START_COL+2], line[START_COL+3], line[START_COL]);
    q.normalize();
    return q;
}

export default function GeneratedData(props) {

    if (props.data.current.length === 0) {
        for (let i = 0; i < inputArray.length; i++) {
            linesArray[i] = inputArray[i].split(" ");
            indicesArray[i] = ""+i;
        }
        props.repeat.current = REPEAT;
        props.FPS.current = FPS;
        props.data.current = indicesArray;
        props.lastIndex.current = -1;
    }

    React.useEffect(() => {
        props.useGlobalQs.current = USE_GLOBAL;
        if (props.timeSliderValue !== props.lastIndex.current) { // We need to update the model, because the timeSlider has moved

            let clockwise_down_quat = new THREE.Quaternion();
            clockwise_down_quat.setFromAxisAngle(new THREE.Vector3(0, 0, -1), Math.PI/2);
            let set_y_up_quat = new THREE.Quaternion();
            set_y_up_quat.setFromAxisAngle(new THREE.Quaternion(1, 0, 0), Math.PI/2);
            
            let align_arm_quat = new THREE.Quaternion();
            align_arm_quat.multiplyQuaternions(set_y_up_quat, clockwise_down_quat);

            let lineQuat = getQuaternionFromLine(props.timeSliderValue);
            
            let transformed_q = new THREE.Quaternion();
            transformed_q.multiplyQuaternions(quat_o_t, lineQuat);

            let final_q = new THREE.Quaternion().multiplyQuaternions(transformed_q, align_arm_quat); //FIRST align the arm, THEN apply the movement

            let q = final_q;
            props.batchUpdate(TARGET_BONE, [q.x, q.y, q.z, q.w]);
            props.lastIndex.current = props.timeSliderValue;
        }
    });

    return (
        <div>
            <a href="https://github.com/jpiland16/hmv_test/blob/master/src/components/menu/components/main-panel/subpanels/Labs/Sam20210521/GeneratedData.js" target="_blank" rel="noreferrer">View relevant code</a>
        </div>
    )
}