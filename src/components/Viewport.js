import './Viewport.css'
import Menu from './menu/Menu'
import React from 'react'
import Visualizer from './visualizer/Visualizer';
import PlayBar from './PlayBar'
import * as THREE from 'three'

// Window resize code: see https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs

let childrenOf = {};
let parentOf = {};

let globalQs = {};

export default function Viewport() {

    const files = React.useRef([]);
    files.current.length === 0 && getFileList();

    async function doXHR(method, url) {
        return new Promise(function(myResolve, myReject) {
            let x = new XMLHttpRequest();
            x.open(method, url);
            x.onload = () => {
                myResolve(x);
            }
            x.onerror = () => { myReject(x); }
            x.send()
        });
    }
    
    async function getFileList() {
        doXHR("GET", "/api/get-file-list").then(
            (xhrr) => {
                try {
                    files.current = JSON.parse(xhrr.responseText);
                } catch (e) {
                    console.warn("Error in processing files...");
                    console.error(e);
                    files.current = [{
                        id: 'root2',
                        name: 'We apologize, but the files could not be loaded due to a JSON error. So, we capitalized upon this to create a very longer folder name for testing.',
                        children: [{
                          id: 'test1',
                          name: 'test1',
                          children: [{
                            id: 'test2',
                            name: 'test2'
                          }]
                        }],
                    }]
                }
            },
            (errXhrr) => {
                console.error("XHR Error");
                console.log(errXhrr.status);
                console.log(errXhrr.statusText);
                console.log(errXhrr.responseText);
            }
        )
    }

    const [ expandedItems, setExpandedItems ] = React.useState(["/"]);
    const [ selectedFile, setSelectedFile ] = React.useState("");
    const [ searchFileText, setSearchFileText ] = React.useState("");
    const [ modelLoaded, setModelLoaded ] = React.useState(false);
    const [ bones, setBones ] = React.useState(null);
    const [ sliderValues, setSliderValues ] = React.useState(null);
    const [ modelNeedsUpdating, setModelNeedsUpdating ] = React.useState(false);
    const [ menuIsOpen, setMenuIsOpen ] = React.useState(false); // Menu is closed by default
    const [ menuIsPinned, setMenuIsPinned ] = React.useState(true); // Menu is pinned by default
    const [ useGlobalQs, setUseGlobalQs ] = React.useState(true); // Use global quaternions by default
    const [ rippleEffect, setRippleEffect ] = React.useState(false); // Limbs move independently by default
    const [ playing, setPlaying ] = React.useState(false); // Paused by default
    const [ cardsPos, setCardsPos ] = React.useState('bottom');

    const [ openLab, setOpenLab ] = React.useState("");
    const [ timeSliderValue, setTimeSliderValue ] = React.useState(0);
    const [ outputTypes, setOutputTypes ] = React.useState([]);
    const [ data, setData ] = React.useState([]);
    const [ FPS, setFPS ] = React.useState(30);
    const [ repeat, setRepeat ] = React.useState(false);
    const [ lastIndex, setLastIndex ] = React.useState(-1);
    
    const playTimerId = React.useRef(0);
    const lineNumberRef = React.useRef(0); // Start from beginning of file by default

    function getWindowDimensions() {
            const { innerWidth: width, innerHeight: height } = window;
            return [
                width,
                height
            ];
      }
      
    function useWindowDimensions() {
        const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());
      
        React.useEffect(() => {
            function handleResize() {
              setWindowDimensions(getWindowDimensions());
            }
        
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);
      
        return windowDimensions;
    }

    const setParent = (bones, childName, parentName) => {
        //console.log(childName + " is a child of " + parentName);
        parentOf[childName] = parentName;

        if (!childrenOf[parentName]) {
            childrenOf[parentName] = [];
        }
        childrenOf[parentName].push(childName);

        bones[parentName].attach(bones[childName])
    }

    function onLoadBones(bones) {
        setBones(bones);

        setParent(bones, "RUA", "BACK");
        setParent(bones, "RLA", "RUA");
        setParent(bones, "LUA", "BACK");
        setParent(bones, "LLA", "LUA");
        setParent(bones, "BACK", "ROOT");

        let boneList = Object.getOwnPropertyNames(bones);
        for (let i = 0; i < boneList.length; i++) {
            let boneQ = bones[boneList[i]].quaternion; // This is the "local" quaternion
            let globalQ = getGlobalFromLocal(bones, boneQ, boneList[i]);
            globalQs[boneList[i]] = globalQ;
        }

        setSliderPositions(bones, useGlobalQs);
    }

    function setSliderPositions(bones, useGlobalQs) {

        let boneList = Object.getOwnPropertyNames(bones);
        let newSliderPositions = { };

        for (let i = 0; i < boneList.length; i++) {
            let boneName = boneList[i];
            let sliderQ = useGlobalQs ? 
                globalQs[boneName] :
                getLocalFromGlobal(globalQs[boneName], boneName);
            newSliderPositions[boneName] = [sliderQ.x, sliderQ.y, sliderQ.z, sliderQ.w];           
        }
        
        setSliderValues(newSliderPositions);

    }

    function getGlobalFromLocal(bones, localQ, currentBoneName) {
        let globalQ = new THREE.Quaternion();
        globalQ.copy(localQ); 

        while (parentOf[currentBoneName]) {
            globalQ.premultiply(bones[parentOf[currentBoneName]].quaternion)
            currentBoneName = parentOf[currentBoneName];
        }

        return globalQ;
    }

    function getLocalFromGlobal(globalQ, currentBoneName) {
        let localQ = new THREE.Quaternion();

        while (parentOf[currentBoneName]) {
            let parentQ = new THREE.Quaternion();
            parentQ.copy(bones[parentOf[currentBoneName]].quaternion);
            localQ.multiply(parentQ.invert())
            currentBoneName = parentOf[currentBoneName];
        }

        localQ.multiply(globalQ);
        return localQ;
    }

    function updateSingleQValue(boneId, qIndex, newValue) {
        let newSliderValues = { ...sliderValues }; // Create shallow clone of old model state
        newSliderValues[boneId][qIndex] = newValue;
        setSliderValues(newSliderValues);
    }

    function batchUpdateObject(boneId, slideArray) {
        let newSliderValues = { ...sliderValues }; // Create shallow clone of old model state
        newSliderValues[boneId] = slideArray;
        let newQ = new THREE.Quaternion(slideArray[0], slideArray[1], slideArray[2], slideArray[3]);
        
        let newGlobalQ = useGlobalQs ? 
            newQ :
            getGlobalFromLocal(bones, newQ, boneId);

        let newLocalQ = useGlobalQs ?
            getLocalFromGlobal(newQ, boneId) :
            newQ;

        globalQs[boneId] = newGlobalQ;

        bones[boneId].quaternion.set(newLocalQ.x, newLocalQ.y, newLocalQ.z, newLocalQ.w);
    
        let affectedByInheritance = [];
        
        if (childrenOf[boneId]) affectedByInheritance.push(...childrenOf[boneId])

        if (playTimerId.current !== 0) { // (Don't bother doing this when viewing pre-recorded data.)
            while (affectedByInheritance.length > 0) {
                let currentBone = affectedByInheritance.shift();
                if (childrenOf[currentBone]) affectedByInheritance.push(...childrenOf[currentBone])
                if (rippleEffect) {
                    // We don't have to "DO" anything to the model. This is default behavior.
                    // Just update the sliders.
                    let currLocalQ = bones[currentBone].quaternion;
                    let currGlobalQ = getGlobalFromLocal(bones, currLocalQ, currentBone);
                    let sliderQ = useGlobalQs ? currGlobalQ : currLocalQ;
                    newSliderValues[currentBone] = [sliderQ.x, sliderQ.y, sliderQ.z, sliderQ.w];
                    globalQs[currentBone] = currGlobalQ;
                } else {
                    // This is NOT the default behavior.
                    let oldGlobalQ = globalQs[currentBone];
                    // Note: scope
                    let newLocalQ = getLocalFromGlobal(oldGlobalQ, currentBone);
                    let sliderQ = useGlobalQs ? oldGlobalQ : newLocalQ;
                    bones[currentBone].quaternion.set(newLocalQ.x, newLocalQ.y, newLocalQ.z, newLocalQ.w);
                    newSliderValues[currentBone] = [sliderQ.x, sliderQ.y, sliderQ.z, sliderQ.w];
                }
            }
        }

        setSliderValues(newSliderValues);
        setModelNeedsUpdating(true);
    }

    function resetModel() {
        const resetValues = {
            ROOT: {
                x: 0,
                y: 0,
                z: 0,
                w: 1
            },
            BACK: {
                x: -0.06,
                y: 0,
                z: 0,
                w: 0.998
            },
            LUA: {
                x: -0.472,
                y: -0.468,
                z: 0.561,
                w: -0.494
            },
            LLA: {
                x: -0.471,
                y: -0.466,
                z: 0.51,
                w: -0.549
            },
            RUA: {
                x: 0.471,
                y: -0.471,
                z: 0.561,
                w: 0.492
            },
            RLA: {
                x: 0.471,
                y: -0.468,
                z: 0.509,
                w: 0.547
            },
            LSHOE: {
                x: 0.495,
                y: -0.015,
                z: 0.008,
                w: 0.869
            },
            RSHOE: {
                x: 0.497,
                y: 0.014,
                z: -0.008,
                w: 0.867
            }
        }

        let boneNames = Object.getOwnPropertyNames(resetValues);

        for (let i = 0; i < boneNames.length; i++) {
            let q = resetValues[boneNames[i]];
            globalQs[boneNames[i]] = new THREE.Quaternion(q.x, q.y, q.z, q.w);
            let lq = getLocalFromGlobal(globalQs[boneNames[i]], boneNames[i]);
            bones[boneNames[i]].quaternion.set(lq.x, lq.y, lq.z, lq.w);
        }
        
        setSliderPositions(bones, useGlobalQs)
        setModelNeedsUpdating(true);
    }

    return (
        <div className="myView">
            <Menu 
                isOpen={menuIsOpen}
                setIsOpen={setMenuIsOpen}
                isPinned={menuIsPinned}
                setIsPinned={setMenuIsPinned}
                
                expandedItems={expandedItems} 
                setExpandedItems={setExpandedItems} 
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                getWindowDimensions={useWindowDimensions}
                searchFileText={searchFileText}
                setSearchFileText={setSearchFileText}
                cardsPos={cardsPos}
                setCardsPos={setCardsPos}

                modelLoaded={modelLoaded}
                sliderValues={sliderValues}
                updateModel={updateSingleQValue}
                batchUpdate={batchUpdateObject}
                bones={bones}
                resetModel={resetModel}

                useGlobalQs={useGlobalQs}
                setUseGlobalQs={setUseGlobalQs}
                useRipple={rippleEffect}
                setUseRipple={setRippleEffect}
                refreshGlobalLocal={setSliderPositions}

                fileList={files}

                playTimerId={playTimerId}
                lineNumberRef={lineNumberRef}
                timeSliderValue={timeSliderValue}
                setTimeSliderValue={setTimeSliderValue}
                setPlaying={setPlaying}

                openLab={openLab}
                setOpenLab={setOpenLab}
                setOutputTypes={setOutputTypes}
                setData={setData}
                data={data}
                setFPS={setFPS}
                setRepeat={setRepeat}
                lastIndex={lastIndex}
                setLastIndex={setLastIndex}
            />

            <Visualizer 
                modelLoaded={modelLoaded}
                setModelLoaded={setModelLoaded}
                setBones={onLoadBones}
                modelNeedsUpdating={modelNeedsUpdating}
                setModelNeedsUpdating={setModelNeedsUpdating}
                onClick = {
                    (event) => !menuIsPinned && setMenuIsOpen(false)
                }
            />

            <PlayBar 
                lineNumberRef={lineNumberRef}
                playTimerId={playTimerId}
                playing={playing}
                setPlaying={setPlaying}
                timeSliderValue={timeSliderValue}
                setTimeSliderValue={setTimeSliderValue}
                FPS={FPS}
                repeat={repeat}
                data={data}
                getWindowDimensions={useWindowDimensions}
                menuIsOpen={menuIsOpen}
                disabled={data.length === 0}
            />
        </div>
    )
}