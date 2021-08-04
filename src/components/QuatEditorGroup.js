import React from 'react';
import * as THREE from 'three';
import { Typography, Button, TextField } from "@material-ui/core";
import QuaternionSelect from "./QuaternionSelect";

export default function QuatEditorGroup({ value, onChange }) {

    const handleChangeQuat = (index) => (newQ) => {
        let newValue = [...value];
        newValue[index] = newQ;
        onChange(newValue);
    }

    const handleRemoveQuat = (index) => () => {
        console.log("index: " + index);
        let newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    }

    const handleAddQuat = () => {
        console.log("Adding quaternion!");
        let newValue = [...value];
        newValue.push({ w: 1, x: 0, y: 0, z: 0 });
        onChange(newValue);
    }

    function quatToString(quat) {
        return `(wxyz) = ${Math.ceil(quat.w * 1000) / 1000}, ${Math.ceil(quat.x * 1000) / 1000}, ${Math.ceil(quat.y * 1000) / 1000}, ${Math.ceil(quat.z * 1000) / 1000}`;
    }

    function getOutputQuat() {
        let transformQuat = new THREE.Quaternion(0, 0, 0, 1);
        for (let i = 0; i < value.length; i ++) {
            let currQ = value[i];
            let threeQuat = new THREE.Quaternion(currQ.x, currQ.y, currQ.z, currQ.w);
            transformQuat.multiply(threeQuat);
        }
        return { w: transformQuat.w, x: transformQuat.x, y: transformQuat.y, z: transformQuat.z };
    }

    return (
        <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
            <div style={{display: "flex", flexDirection: "column"}}>
                {value.map((quat, index) => (
                    <QuaternionSelect
                        key={index}
                        value={quat}
                        onChange={handleChangeQuat(index)}
                        onRemove={handleRemoveQuat(index)}
                    />
                ))}
                <Button onClick={handleAddQuat}>Add quaternion</Button>
                <Typography>Final transform quaternion: {quatToString(getOutputQuat())}</Typography>
            </div>
        </div>
    );
}