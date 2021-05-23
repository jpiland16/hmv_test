import * as THREE from 'three';
import React from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import Slider from '@material-ui/core/Slider'
import { IconButton } from '@material-ui/core';

const inputData = `0 0 0 0 0.7071067811865475 0.0 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0.6916548014802255 0.14701576646519846 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0.645974188021251 0.2876062384759507 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0.5720614028176843 0.4156269377774534 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0.4731467892558151 0.5254827454987588 0.7071067811865476 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0.35355339059327384 0.6123724356957945 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0.21850801222441055 0.6724985119639573 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0.07391278520356685 0.7032331762534041 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 -0.07391278520356662 0.7032331762534042 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 -0.21850801222441046 0.6724985119639574 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 -0.35355339059327356 0.6123724356957945 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 -0.47314678925581477 0.525482745498759 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 -0.5720614028176843 0.41562693777745346 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 -0.6459741880212508 0.28760623847595085 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 -0.6916548014802255 0.14701576646519873 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 -0.7071067811865475 4.0061409736030434e-16 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 -0.6916548014802255 -0.14701576646519826 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 -0.6459741880212511 -0.28760623847595046 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 -0.5720614028176843 -0.41562693777745335 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 -0.47314678925581516 -0.5254827454987586 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 -0.35355339059327406 -0.6123724356957942 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 -0.21850801222441063 -0.6724985119639573 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 -0.07391278520356724 -0.7032331762534041 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0.07391278520356637 -0.7032331762534042 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0.21850801222441038 -0.6724985119639574 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0.35355339059327323 -0.6123724356957948 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0.4731467892558147 -0.5254827454987591 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0.5720614028176838 -0.415626937777454 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0.6459741880212507 -0.28760623847595124 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0.6916548014802255 -0.14701576646519884 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0.7071067811865475 -8.012281947206087e-16 0.7071067811865475 0.0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0`

const START_COL = 4;
const TARGET_BONE = 'RUA';
const USE_GLOBAL = true;
const AUTO_RIPPLE = true;
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

    props.setUseGlobalQs(USE_GLOBAL);
    props.setUseRipple(AUTO_RIPPLE);

    const playAdvance = () => {

        let lineNumber = props.lineNumberRef.current;

        if (lineNumber < linesArray.length - 1) {
            setLineNum(++lineNumber);
        } else {
            if (!REPEAT) {
                window.clearInterval(props.playTimerId);
                props.setPlayTimerId(0);
            } else {
                setLineNum(0);
            }
        }
        
    }

    const setLineNum = (n) => {
        props.setTimeSliderValue(n);
        props.lineNumberRef.current = n;
        let q = getQuaternionFromLine(n);
        //console.log(`Line ${n}: (X: ${q.x}, Y: ${q.y}, Z: ${q.z}, W: ${q.w})`);
        props.batchUpdate(TARGET_BONE, [q.x, q.y, q.z, q.w]);
    }

    return (
        <div>
            <h3>Sam's test, 5/21/2021</h3>
            <a href="https://github.com/jpiland16/hmv_test/blob/master/src/components/menu/components/main-panel/subpanels/Labs/Sam20210521/GeneratedData.js" target="_blank" rel="noreferrer">View relevant code</a>
            <br />
            <div style={{ display: "flex", alignItems: "center"}}>
                <IconButton style={{ marginRight: "12px", marginTop: "2px" }} onClick={ () => {
                    if(props.playTimerId !== 0) {
                        window.clearInterval(props.playTimerId);
                        props.setPlayTimerId(0);
                    } else {
                        setLineNum(props.lineNumberRef.current);
                        props.setPlayTimerId(
                            window.setInterval(playAdvance, 1000 / FPS));
                    }
                } }>
                    { props.playTimerId !== 0 ? <PauseIcon /> : <PlayArrowIcon /> }
                </IconButton>
                <Slider min={0} max={linesArray.length - 1} value={props.timeSliderValue} 
                    onChange={(event, newValue) => setLineNum(newValue)} 
                    style={{width: "calc(100% - 84px)"}}/>
            </div>
        </div>
    )
}