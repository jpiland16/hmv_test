import Typography from '@material-ui/core/Typography'
import QSlider2 from './QSlider2'
import { QuaternionTarget } from './Visualizer';
import * as THREE from 'three'
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

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

function quaternionToString(q) {
    return ("(" + Math.round(q.x * 1000) / 1000 + ", " + 
    Math.round(q.y * 1000) / 1000 + ", " + 
    Math.round(q.z * 1000) / 1000 + ", " + 
    Math.round(q.w * 1000) / 1000 + ")")
}

/**
 * @param {Object} props
 * @param {QuaternionTarget} props.quaternionTarget
 * @param {THREE.Quaternion} props.oldQ
 */
export default function QuaternionEditor(props) {

    const oldQ = props.quaternionTarget.current
    const oldQuaternion = [oldQ.x, oldQ.y, oldQ.z, oldQ.w]
    const selectRef = React.useRef(null)

    if (selectRef.current && selectRef.current.value != -1) {
        const selectedBasicQ = possibleQuaternions[selectRef.current.value].toArray()
        function round(t) {
            return Math.round(t * 1000) / 1000
        }
        for (let i = 0; i < 4; i++) {
            if (round(selectedBasicQ[i]) !== round(oldQuaternion[i])) {
                selectRef.current.value = -1;
                break;
            }
        }
    }

    const handleSliderUpdate = (quaternionId, newValue) => {

        selectRef.current.value = -1

        const fixedId = quaternionId; // The one the user is dragging

        let needsKickstart = true;
        for (let i = 0; i < 4; i++) {
            if (i !== fixedId) {
                if (oldQuaternion[i] !== 0) {
                    needsKickstart = false;
                    break;
                }
            }
        }

        if (needsKickstart) {
            oldQuaternion[(fixedId + 1) % 4] = 0.01;
        }

        let targetMag = Math.sqrt(1 - Math.pow(newValue, 2));

        let otherSumOfSq = 0;

        for (let i = 0; i < 4; i++) {
            if (i !== fixedId) otherSumOfSq += 
                Math.pow(oldQuaternion[i], 2); 
        }

        let wrongMag = Math.sqrt(otherSumOfSq);

        let newQarray = [];

        for (let i = 0; i < 4; i++) {
            if (i === fixedId) newQarray[i] = newValue;
            else newQarray[i] = oldQuaternion[i] * (targetMag / wrongMag);
        }

        props.onChange(newQarray)
    }

    function selectBasicQuaternion(index) {
        const basicQ = possibleQuaternions[index].toArray()
        props.onChange(basicQ)
    }

    return (
        <div>
            <Typography><b>{props.quaternionTarget.shortName}</b></Typography>
                Common quaternions: <select ref={selectRef} onChange={(event) => selectBasicQuaternion(event.target.value)}>
                    <option selected disabled value={-1}>(select)</option>
                    {possibleQuaternions.map((quaternion, index) => {
                        return <option key={index} value={index}>{quaternionToString(quaternion)}</option>
                    })}
                </select>
                <div style={{backgroundColor: "#eeeeee", padding: "6px"}}>
                    {[0, 1, 2, 3].map((myIndex) => 
                        <QSlider2 key={myIndex} index={myIndex} {...props} sliderValue={oldQuaternion[myIndex]}
                        onChange={(event, newValue) => handleSliderUpdate(myIndex, newValue)}/>)}
                </div>
        </div>
    );
}