import React from 'react';
import { MannequinVisualizer } from './shared_visualizer_object/Models';
import QuaternionSelectionDialog from './upload-screen/QuaternionSelectionDialogAlt'
import QuaternionSelect from './QuaternionSelect';
import * as THREE from 'three'
import { Button, Slider, TextField, Typography } from '@material-ui/core';
import { Select, MenuItem } from '@material-ui/core'
import { Input } from '@material-ui/core'
import QuatEditorGroup from './QuatEditorGroup';

const boneNames = [
    "HIPS",
    "BACK",
    "RUA",
    "RLA",
    "LUA",
    "LLA",
    "RUL",
    "RLL",
    "LUL",
    "LLL"
];

console.log("Declaring visualizer...");
const scriptVis = new MannequinVisualizer();

export default function MetadataTinkerer() {
    const [targetBone, setTargetBone] = React.useState("BACK");
    const [visualizer, setVisualizer] = React.useState(scriptVis);
    const [quaternions, setQuaternions] = React.useState({ });
    const [dataQuaternion, setDataQuaternion] = React.useState({ w: 1, x: 0, y: 0, z: 0 });
    const [dataRow, setDataRow] = React.useState(0);
    const [quaternionStacks, setQuaternionStacks] = React.useState({
        BACK: [{ w: 1, x: 0, y: 0, z: 0}],
        RUA: [],
        RLA: [],
        LUA: [],
        LLA: [],
        RUL: [],
        RLL: [],
        LUL: [],
        LLL: [],
        HIPS: [],
    }); // map from limb name to an ordered list of transform quats
    const [columnNumbers, setColumnNumbers] = React.useState({
        BACK: 0,
        RUA: 0,
        RLA: 0,
        LUA: 0,
        LLA: 0,
        RUL: 0,
        RLL: 0,
        LUL: 0,
        LLL: 0,
        HIPS: 0,
    }); // TODO: Do I want to merge this with the other map from bone name?
    const [fileData, setFileData] = React.useState([[1, 0, 0, 0]]); // Probably a bad idea because it involves storing a whole file in memory

    React.useEffect(() => {
        // const newVis = new MannequinVisualizer();
        console.log("initializing visualizer...");
        setVisualizer(scriptVis);
        scriptVis.initialize().then(() => {
            console.log("Visualizer has finished initializing!");
            for (let boneName of boneNames) {
                visualizer.acceptData({ [boneName]: defaultOrientation });
            }
        });
        scriptVis.showSliders = true;
        let defaultOrientation = new THREE.Quaternion(0, 0, 0, 1);
    }, []);

    const handleDataQuatChange = (newIndex) => {
        setDataRow(newIndex);
        let newDataQuat = {
            w: fileData[newIndex][columnNumbers[targetBone] + 0],
            x: fileData[newIndex][columnNumbers[targetBone] + 1],
            y: fileData[newIndex][columnNumbers[targetBone] + 2],
            z: fileData[newIndex][columnNumbers[targetBone] + 3],
        }
        setDataQuaternion(newDataQuat);
        for (let boneName of boneNames) {
            if (quaternionStacks[boneName].length === 0) { continue; }
            updateModel(boneName, quaternionStacks[boneName], newIndex, columnNumbers[boneName]);
        }
    }

    function quatToString(quat) {
        return `(wxyz) = ${Math.ceil(quat.w * 1000) / 1000}, ${Math.ceil(quat.x * 1000) / 1000}, ${Math.ceil(quat.y * 1000) / 1000}, ${Math.ceil(quat.z * 1000) / 1000}`;
    }

    const handleQuatStackChange = (stackedQuaternions) => {
        let newQuatStacks = {...quaternionStacks};
        newQuatStacks[targetBone] = stackedQuaternions;
        setQuaternionStacks(newQuatStacks);
        updateModel(targetBone, stackedQuaternions, dataRow, columnNumbers[targetBone]);
    }

    const handleColumnNumChange = (newColIndex) => {
        setColumnNumbers({...columnNumbers, [targetBone]: newColIndex});
        updateModel(targetBone, quaternionStacks[targetBone], dataRow, newColIndex);
    }

    function getTransformQuat(stackedQuats) {
        let transformQuat = new THREE.Quaternion(0, 0, 0, 1);
        for (let i = 0; i < stackedQuats.length; i ++) {
            let currQ = stackedQuats[i];
            let threeQuat = new THREE.Quaternion(currQ.x, currQ.y, currQ.z, currQ.w);
            transformQuat.multiply(threeQuat);
        }
        return transformQuat;
    }

    function updateModel(boneName, stackedQuats, rowIndex, columnIndex, currFileData=null) {
        if (currFileData === null) {
            currFileData = fileData;
        }
        let dataQuat = {
            w: currFileData[rowIndex][columnIndex + 0],
            x: currFileData[rowIndex][columnIndex + 1],
            y: currFileData[rowIndex][columnIndex + 2],
            z: currFileData[rowIndex][columnIndex + 3],
        }
        let transformQuat = getTransformQuat(stackedQuats);
        let threeDataQuat = new THREE.Quaternion(dataQuat.x,dataQuat.y,dataQuat.z,dataQuat.w);
        threeDataQuat.multiply(transformQuat);
        visualizer.acceptData({ [boneName]: threeDataQuat });
    }

    const handleFileUpload = (event) => {
        let file = event.target.files[0];
        if (file === null) { return; }
        let reader = new FileReader();
        reader.onload = () => {
            let newFileData = [];
            let lines = reader.result.split("\n");
            for (let i = 0; i < lines.length; i ++) {
                if (i > 2000) { 
                    console.warn("The submitted data file has over 2000 lines of data. For ease of access, only the first 2000 lines will be used.");
                    break;
                }
                let line = lines[i];
                let lineData = line.split(" ");
                if (lineData.length < 4 || lineData[0] === "#") { continue; }
                let lineNums = [];
                for (let num of lineData) {
                    lineNums.push(parseFloat(num));
                }
                newFileData.push(lineNums);
                i ++;
            }
            setFileData(newFileData);
            console.log(reader.result.split("\n")[0]);
            for (let boneName of boneNames) {
                updateModel(boneName, quaternionStacks[boneName], dataRow, columnNumbers[boneName], newFileData);
            }
        };
        reader.readAsText(file);
        event.target.value = null;
    }

    const downloadMetadata = () => {
        const dataPrefix = "data:text/json;charset=utf-8,";
        const metadata = {
            name: "Opportunity dataset",
            displayName: "Tinker dataset " + new Date().toISOString(),
            globalTransformQuaternion: { w: 0, x: 0, y: 0, z: 0 },
            targets: []
        };
        for (let boneName of boneNames) {
            if (quaternionStacks[boneName].length === 0) { continue; }
            const transformQuat = getTransformQuat(quaternionStacks[boneName]);
            metadata.targets.push({
                bone: boneName,
                type: "Quaternion",
                column: columnNumbers[boneName],
                localTransformQuaternion: {
                    w: transformQuat.w,
                    x: transformQuat.x,
                    y: transformQuat.y,
                    z: transformQuat.z,
                }
            });
        }
        const dataString = dataPrefix + encodeURIComponent(JSON.stringify(metadata, null, "\t"));
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = dataString;
        a.download = "metadata.json";
        a.click();
        document.body.removeChild(a);
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
                    defaultValue="BACK"
                    onChange={(event) => { setTargetBone(event.target.value); }}
                >
                    <MenuItem value="HIPS">Hips</MenuItem>
                    <MenuItem value="BACK">Back</MenuItem>
                    <MenuItem value="RUA">Right upper arm</MenuItem>
                    <MenuItem value="RLA">Right forearm</MenuItem>
                    <MenuItem value="RUL">Right upper leg</MenuItem>
                    <MenuItem value="RLL">Right lower leg</MenuItem>
                    <MenuItem value="LUL">Left upper leg</MenuItem>
                    <MenuItem value="LLL">Left lower leg</MenuItem>
                </Select>
                <Input 
                    type="file"
                    onChange={handleFileUpload}
                />
                <Input
                    type="number"
                    label="Column number"
                    placeholder="Column number"
                    inputProps={{
                        min: 0
                    }}
                    value={columnNumbers[targetBone]}
                    onChange={(event) => { handleColumnNumChange(parseInt(event.target.value)); }}
                />
                <Button onClick={downloadMetadata}>Download as JSON</Button>
                <div style={{width: "80%", margin: "15px"}}>
                    <Typography id="slider-label">Data Quat Index</Typography>
                    <Slider
                        value={dataRow}
                        onChange={(event, newValue) => { handleDataQuatChange(newValue); }}
                        min={0}
                        max={fileData.length - 1}
                        step={1}
                        aria-labelledby="slider-label"
                    />
                </div>
                <Typography>Data quaternion: {quatToString(dataQuaternion)}</Typography>
                <QuatEditorGroup
                    dataQuaternion={dataQuaternion}
                    value={quaternionStacks[targetBone]}
                    onChange={handleQuatStackChange}
                />
            </div>
        </div>
    );
}