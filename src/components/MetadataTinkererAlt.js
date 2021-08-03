import React from 'react';
import { MannequinVisualizer } from './shared_visualizer_object/Models';
import QuaternionSelectionDialog from './calibration_form/QuaternionSelectionDialogAlt'
import QuaternionSelect from './QuaternionSelect';
import * as THREE from 'three'
import { Button, TextField, Typography } from '@material-ui/core';
import { Select } from '@material-ui/core'

console.log("Declaring visualizer...");
const scriptVis = new MannequinVisualizer();

export default function MetadataTinkerer() {
    const [targetBone, setTargetBone] = React.useState("RUA");
    const [visualizer, setVisualizer] = React.useState(scriptVis);
    const [slider, setSlider] = React.useState(null);
    const [quaternions, setQuaternions] = React.useState({ });
    const elementRef = React.useRef(null);
    const [dataQuaternion, setDataQuaternion] = React.useState({ w: 1, x: 0, y: 0, z: 0 });
    const [stackedQuaternions, setStackedQuaternions] = React.useState([
        { w: 1, x: 0, y: 0, z: 0 },
        { w: 1, x: 0, y: 0, z: 0 }
    ]);

    React.useEffect(() => {
        // const newVis = new MannequinVisualizer();
        console.log("initializing visualizer...");
        setVisualizer(scriptVis);
        scriptVis.initialize().then(() => {
            setSlider("null");
            console.log("Visualize has finished initializing!");
            updateModel();
        });
        scriptVis.showSliders = true;

    }, []);

    React.useEffect(() => {
        updateModel();
    }, [dataQuaternion, stackedQuaternions]);

    function updateModel() {
        let finalQuat = new THREE.Quaternion(dataQuaternion.x,dataQuaternion.y,dataQuaternion.z,dataQuaternion.w);
        for (let i = 0; i < stackedQuaternions.length; i ++) {
            let currQ = stackedQuaternions[i];
            let threeQuat = new THREE.Quaternion(currQ.x, currQ.y, currQ.z, currQ.w);
            finalQuat.multiply(threeQuat);
        }
        visualizer.acceptData({ [targetBone]: finalQuat });
    }

    const handleChangeQuat = (index) => (newQ) => {
        stackedQuaternions[index] = newQ;
        setStackedQuaternions([...stackedQuaternions]);
    }

    const handleRemoveQuat = (index) => () => {
        console.log("index: " + index);
        stackedQuaternions.splice(index, 1);
        setStackedQuaternions([...stackedQuaternions]);
    }

    const handleAddQuat = () => {
        console.log("Adding quaternion!");
        stackedQuaternions.push({ w: 1, x: 0, y: 0, z: 0 });
        setStackedQuaternions([...stackedQuaternions]);
    }

    return (
        <div style={{display: "flex", flexDirection: "row", width: "80vw"}}>
            <div style={{width: "60%"}}>
                <QuaternionSelectionDialog 
                    localTransformQuaternion={{ w: 1, x: 0, y: 0, z: 0 }}
                    visualizer={visualizer}
                    quaternions={quaternions}
                    setQuaternions={setQuaternions}
                    onAccept={() => { }}
                    boneName={targetBone}
                />
            </div>
            <div style={{display: "flex", flexDirection: "column", width: "40%", height: "60vh", overflow: "scroll"}}>
                <Select
                    value={targetBone}
                    onChange={(event) => setTargetBone(event.target.value)}
                >
                    <option value="RUA">RUA</option>
                    <option value="RLA">RLA</option>
                    <option value="BACK">BACK</option>
                </Select>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <Typography>Data quaternion (wxyz)</Typography>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <TextField
                            type="number"
                            label="w"
                            defaultValue={1.0}
                            inputProps={{
                                min: 0.0,
                                max: 1.0,
                                step: 0.05
                            }}
                            onChange={(event) => setDataQuaternion({...dataQuaternion, w: event.target.value })}
                        />
                        <TextField
                            type="number"
                            label="x"
                            defaultValue={0.0}
                            inputProps={{
                                min: 0.0,
                                max: 1.0,
                                step: 0.05
                            }}
                        />
                        <TextField
                            type="number"
                            label="y"
                            defaultValue={0.0}
                            inputProps={{
                                min: 0.0,
                                max: 1.0,
                                step: 0.05
                            }}
                        />
                        <TextField
                            type="number"
                            label="z"
                            defaultValue={0.0}
                            inputProps={{
                                min: 0.0,
                                max: 1.0,
                                step: 0.05
                            }}
                        />
                    </div>
                </div>
                {stackedQuaternions.map((quat, index) => (
                    <QuaternionSelect
                        value={quat}
                        onChange={handleChangeQuat(index)}
                        onRemove={handleRemoveQuat(index)}
                    />
                ))}
                <Button onClick={handleAddQuat}>Add quaternion</Button>
            </div>
        </div>
    );
}