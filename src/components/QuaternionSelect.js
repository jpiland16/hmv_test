import React from 'react'
import { FormLabel, FormControl, RadioGroup, Radio, FormControlLabel, Slider } from "@material-ui/core"
import { Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { findAllByDisplayValue } from '@testing-library/react';

const axisMap = {
    "x" : { x: 1, y: 0, z: 0},
    "y" : { x: 0, y: 1, z: 0},
    "z" : { x: 0, y: 0, z: 1}
};

export default function QuaternionSelect({ onChange, onRemove, value }) {

    function axisFromQuat(quat) {
        if (quat.x === 0 && quat.z === 0) { return {x: 0, y: 1, z: 0 }};
        if (quat.x === 0 && quat.y === 0) { return {x: 0, y: 0, z: 1 }};
        return {x: 1, y: 0, z: 0 };
    }

    function axisStringFromQuat(quat) {
        // Does not handle non-element vector axes.
        if (quat.x === 0 && quat.z === 0) { return "y"};
        if (quat.x === 0 && quat.y === 0) { return "z"};
        return "x";
    }

    function angleFromQuat(quat) {
        let guess = 2 * Math.acos(quat.w);
        // let magnitude = (quat.x ** 2) + (quat.y ** 2) + (quat.z ** 2);
        // let sinGuess = 2 * Math.asin(magnitude);
        // if (guess > Math.PI / 2) {
        //     console.log("Guess is greater than PI")
        //     guess = guess - (2 * Math.PI);
        // }
        return guess;
    }

    const setAxis = (newAxisString) => {
        let angle = angleFromQuat(value);
        if (angle === 0) { angle = 0.01; }
        onChange(quatFromAxisAngle(axisMap[newAxisString], angle));
    }

    const setAngle = (newAngle) => {
        onChange(quatFromAxisAngle(axisMap[axisStringFromQuat(value)], newAngle));
    }

    function quatFromAxisAngle(axis, angle) {
        return {
          w: Math.cos(angle / 2),
          x: axis.x * Math.sin(angle / 2),
          y: axis.y * Math.sin(angle / 2),
          z: axis.z * Math.sin(angle / 2),
        };
    }

    function currentQuatString() {
        let currQuat = quatFromAxisAngle(axisFromQuat(value), angleFromQuat(value));
        return `(wxyz) = ${Math.ceil(currQuat.w * 1000) / 1000}, ${Math.ceil(currQuat.x * 1000) / 1000}, ${Math.ceil(currQuat.y * 1000) / 1000}, ${Math.ceil(currQuat.z * 1000) / 1000}`;
    }

    return (
        <div style={{display: "flex", flexDirection: "column", width: "100%", height: "35vh", backgroundColor: "orange", border: "1px solid green"}}>
            <div style={{margin: "10px"}}>
                <Button onClick={onRemove}>Remove</Button>
            </div>
            <div style={{margin: "10px"}}>
                <FormControl>
                    <FormLabel>Axis</FormLabel>
                    <RadioGroup value={axisStringFromQuat(value)} onChange={(event) => { setAxis(event.target.value); }}>
                        <FormControlLabel value={"x"} label="x" control={<Radio />}/>
                        <FormControlLabel value={"y"} label="y" control={<Radio />}/>
                        <FormControlLabel value={"z"} label="z" control={<Radio />}/>
                    </RadioGroup>
                </FormControl>
            </div>
            <div style={{margin: "10px"}}>
                <Typography id="slider-label">Angle</Typography>
                <Slider
                    value={angleFromQuat(value)}
                    onChange={(event, newValue) => { setAngle(newValue); }}
                    min={0.01}
                    max={2 * Math.PI}
                    step={0.01}
                    aria-labelledby="slider-label"
                />
            </div>
            <div style={{margin: "10px"}}>  
                <Typography>Quat: {currentQuatString()}</Typography>
            </div>
        </div>
    )
}