import Typography from '@material-ui/core/Typography'
import QSlider2 from './QSlider2'
import { QuaternionTarget } from './Visualizer';
import * as THREE from 'three'
import React from 'react';

/**
 * @param {Object} props
 * @param {QuaternionTarget} props.quaternionTarget
 * @param {THREE.Quaternion} props.oldQ
 */
export default function QuaternionEditor(props) {

    const oldQ = props.quaternionTarget.current
    const oldQuaternion = [oldQ.x, oldQ.y, oldQ.z, oldQ.w]

    const handleSliderUpdate = (quaternionId, newValue) => {

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

    return (
        <div>
            <Typography>{props.quaternionTarget.shortName}</Typography>
                <div style={{backgroundColor: "#eeeeee", padding: "6px"}}>
                    {[0, 1, 2, 3].map((myIndex) => 
                        <QSlider2 key={myIndex} index={myIndex} {...props} sliderValue={oldQuaternion[myIndex]}
                        onChange={(event, newValue) => handleSliderUpdate(myIndex, newValue)}/>)}
                </div>
        </div>
    );
}