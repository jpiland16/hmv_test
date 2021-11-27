import * as THREE from 'three';
import React from 'react';

const inputData = `0 0 0 0 0.7071067811865475 0.0 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
1 0 0 0 0.6916548014802255 0.14701576646519846 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
2 0 0 0 0.645974188021251 0.2876062384759507 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
3 0 0 0 0.5720614028176843 0.4156269377774534 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
4 0 0 0 0.4731467892558151 0.5254827454987588 0.7071067811865476 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
5 0 0 0 0.35355339059327384 0.6123724356957945 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
6 0 0 0 0.21850801222441055 0.6724985119639573 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
7 0 0 0 0.07391278520356685 0.7032331762534041 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
8 0 0 0 -0.07391278520356662 0.7032331762534042 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
9 0 0 0 -0.21850801222441046 0.6724985119639574 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
10 0 0 0 -0.35355339059327356 0.6123724356957945 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
11 0 0 0 -0.47314678925581477 0.525482745498759 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
12 0 0 0 -0.5720614028176843 0.41562693777745346 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
13 0 0 0 -0.6459741880212508 0.28760623847595085 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
14 0 0 0 -0.6916548014802255 0.14701576646519873 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
15 0 0 0 -0.7071067811865475 4.0061409736030434e-16 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
16 0 0 0 -0.6916548014802255 -0.14701576646519826 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
17 0 0 0 -0.6459741880212511 -0.28760623847595046 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
18 0 0 0 -0.5720614028176843 -0.41562693777745335 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
19 0 0 0 -0.47314678925581516 -0.5254827454987586 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
20 0 0 0 -0.35355339059327406 -0.6123724356957942 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
21 0 0 0 -0.21850801222441063 -0.6724985119639573 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
22 0 0 0 -0.07391278520356724 -0.7032331762534041 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
23 0 0 0 0.07391278520356637 -0.7032331762534042 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
24 0 0 0 0.21850801222441038 -0.6724985119639574 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
25 0 0 0 0.35355339059327323 -0.6123724356957948 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
26 0 0 0 0.4731467892558147 -0.5254827454987591 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
27 0 0 0 0.5720614028176838 -0.415626937777454 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
28 0 0 0 0.6459741880212507 -0.28760623847595124 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
29 0 0 0 0.6916548014802255 -0.14701576646519884 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
30 0 0 0 0.7071067811865475 -8.012281947206087e-16 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0`

const START_COL = 4;
const TARGET_BONE = 'RUA';
const USE_GLOBAL = true;
const REPEAT = true;
const USE_ADJUSTMENT_QUATERNION = true;
const FPS = 20;

const inputArray = inputData.split("\n");

let linesArray = [];

for (let i = 0; i < inputArray.length; i++) {
    linesArray[i] = inputArray[i].split(" ");
}

// NOTE: see https://stackoverflow.com/questions/1171849/finding-quaternion-representing-the-rotation-from-one-vector-to-another
function getQuaternionFromLine(lineNum) {

    let line = linesArray[lineNum];
    
    // Have to use jHat because that is the direction the arm is pointing 
    // with no rotation (i.e. when transformed by the identity quaternion (X = 0, Y = 0, Z = 0, W = 1))
    let jHat = new THREE.Vector3(0, 1, 0);
    let vTarget = new THREE.Vector3(line[START_COL], line[START_COL + 1], line[START_COL + 2]);

    let crossProduct = new THREE.Vector3().crossVectors(jHat, vTarget);

    let dotProduct = jHat.dot(vTarget);

    if (dotProduct >  0.9999) return new THREE.Quaternion(0, 0, 0,  1);
    if (dotProduct < -0.9999) return new THREE.Quaternion(0, 0, 0, -1);

    // Note: magnitude of both vectors is 1
    //      |
    //      V
    let w = 1 + dotProduct;

    let q = new THREE.Quaternion(crossProduct.x, crossProduct.y, crossProduct.z, w);

    q.normalize();
    
    // Rotates the motion 90deg CW about global y-axis
    // If disabled, cone shape is in front of the body (cone opens toward +Z axis)
    // If enabled, cone shape is on right of body (cone opens toward -X axis)
    if (USE_ADJUSTMENT_QUATERNION) q.premultiply(new THREE.Quaternion(0, 0.707, 0, -0.707))

    return q;

}

export default function GeneratedData(props) {

    if (props.data.current.length === 0) {
        props.repeat.current = REPEAT;
        props.FPS.current = FPS;
        props.data.current = linesArray;
        props.lastIndex.current = -1;
    }

    React.useEffect(() => {
        const dataObj = { }
        if (props.timeSliderValue !== props.lastIndex.current) { // We need to update the model, because the timeSlider has moved
            let q = getQuaternionFromLine(props.timeSliderValue);
            dataObj[TARGET_BONE] = new THREE.Quaternion(q.x, q.y, q.z, q.w);
            props.visualizer.acceptData(dataObj)
            props.lastIndex.current = props.timeSliderValue;
        }
    });

    return (
        <div>
            <a href="https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/components/main-panel/subpanels/Labs/Sam20210521/GeneratedData.js" target="_blank" rel="noreferrer">View relevant code</a>
        </div>
    )
}