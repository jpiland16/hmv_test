import './Viewport.css'
import Menu from './menu/Menu'
import React from 'react'
import Visualizer from './visualizer/Visualizer';
import PlayBar from './PlayBar'
import TopActionBar from './TopActionBar'
import CardSet from './cards/CardSet'
import * as THREE from 'three'
import Animator from './Animator';

// Window resize code: see https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs

let childrenOf = {};
let parentOf = {};
let globalQs = {};
let sliderValuesShadowCopy = {};
let outgoingRequest = false;
let lastFiles = [];

export default function Viewport(props) {
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let initialSelectedFile = ""
    let initialExpandedItems = ["/"];

    if (urlParams.has('file')) {
        const fpath = urlParams.get('file');
        initialSelectedFile = fpath;
        let charPos = 1;
        while (charPos < fpath.length) {
            if (fpath.charAt(charPos) === '/')
            initialExpandedItems.push(fpath.substring(0, charPos)) // don't include the slash
            charPos++;
        }
    }
    
    const [ selectedPanel, setSelectedPanel ] = React.useState(0);
    const [ expandedItems, setExpandedItems ] = React.useState(initialExpandedItems);
    const [ selectedFile, setSelectedFile ] = React.useState(initialSelectedFile);
    const [ searchFileText, setSearchFileText ] = React.useState("");
    const [ modelLoaded, setModelLoaded ] = React.useState(false);
    const [ bones, setBones ] = React.useState(null);
    const [ sliderValues, setSliderValues ] = React.useState(null);
    const [ modelNeedsUpdating, setModelNeedsUpdating ] = React.useState(false);
    const [ menuIsOpen, setMenuIsOpen ] = React.useState(false); // Menu is closed by default
    const [ menuIsPinned, setMenuIsPinned ] = React.useState(true); // Menu is pinned by default
    const useGlobalQs = React.useRef(true); // Use global quaternions by default
    const [ useRipple, setUseRipple ] = React.useState(false); // Limbs move independently by default
    const [ playing, setPlaying ] = React.useState(false); // Paused by default
    const [ cardsPos, setCardsPos ] = React.useState(window.localStorage.getItem("cardsPos") || 'right');
    const [ timeDisplay, setTimeDisplay ] = React.useState(window.localStorage.getItem("timeDisplay") || 'msm');
    const [ downloadPercent, setDownloadPercent ] = React.useState(0);
    const [ downloading, setDownloading ] = React.useState(false);

    const camera = React.useRef(undefined);
    const orbitControls = React.useRef(undefined);

    const [ openLab, setOpenLab ] = React.useState("");
    const [ timeSliderValue, setTimeSliderValue ] = React.useState(0);
    const outputTypes = React.useRef([]);
    const data = React.useRef([]);
    const FPS = React.useRef(30);
    const repeat = React.useRef(false);
    const lastIndex = React.useRef(-1);
    
    const playTimerId = React.useRef(0);
    const lineNumberRef = React.useRef(0); // Start from beginning of file by default

    const files = React.useRef([]);


    React.useEffect(() => {
        if(bones) {
            if(props.firstLoad) {
                if (files.current.length === 0) {
                    getFileList();
                }
                if (selectedFile !== "") {
                    onSelectFileChange(selectedFile);
                }
                props.setFirstLoad(false);
            } else {
                files.current = lastFiles;
            }
        }
    });

    function isFileNameValid(fname) {
        return fname.substr(-4) === ".dat";
    }

    function clickFile(id, name) {
        if(isFileNameValid(name)) {
            onSelectFileChange(id);
            window.history.replaceState(null, null, "?file=" + id);
        }
    }

    function downloadFile(fname) {
        outgoingRequest = true;
        setDownloading(true);
        setDownloadPercent(0);
        let x = new XMLHttpRequest();
        x.open("GET", (window.location.href.substring(0, 22) === "http://localhost:3000/" ? 
            "https://raw.githubusercontent.com/jpiland16/hmv_test/master/files" : "/files")
            + fname);

        x.onload = () => {
            let inputArray = x.responseText.split("\n");
            let linesArray = [];

            for (let i = 0; i < inputArray.length - 1; i++) {
                linesArray[i] = inputArray[i].split(" ");
            }

            data.current = linesArray;
            setDownloading(false);
            outgoingRequest = false;
        }

        x.onprogress = (event) => {
            setDownloadPercent(Math.min(100, Math.round(event.loaded / event.total * 100)));
        }

        x.onerror = (error) => {
            console.log(error);
        }

        x.send();
    }

    function onSelectFileChange(mySelectedFile) {
        if (!outgoingRequest) {
            setSelectedFile(mySelectedFile);                    
            data.current = [];           // Allow either refresh or disable
            outputTypes.current = []     // Clear all graphs
            setTimeSliderValue(0);       // Move to start
            lineNumberRef.current = 0;   // (same as above)
            setUseRipple(true)           // For the initialization of the model
            if (modelLoaded) {
                resetModel()                                          // Same as above
                setUseRipple(false)           
                if (playTimerId.current !== 0) {                      // Stop playback if it is occuring
                        window.clearInterval(playTimerId.current);   
                        playTimerId.current = 0;
                        setPlaying(false);
                } 
                if (getCamera()) {
                    getCamera().position.x = 0;
                    getCamera().position.y = 0;
                    getCamera().position.z = 3;
                    getCamera().up.set(0, 1, 0);
                    getControls().update();
                }  
            }
            if (mySelectedFile !== "") downloadFile(mySelectedFile)
        }
    }

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
                let res;
                try {
                    res = JSON.parse(xhrr.responseText);
                } catch (e) {
                    console.warn("Error in processing files...");
                    console.error(e);
                    res = [{
                        id: '/demo',
                        name: 'demo',
                        children: [{
                          id: '/demo/S4-ADL4.dat',
                          name: 'S4-ADL4.dat'
                        }],
                    }]
                }
                files.current = res;
                lastFiles = res;
            },
            (errXhrr) => {
                console.error("XHR Error");
                console.log(errXhrr.status);
                console.log(errXhrr.statusText);
                console.log(errXhrr.responseText);
            }
        )
    }

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
        
        setParent(bones, "RSHOE","RLL")
        setParent(bones, "RLL", "RUL");
        setParent(bones, "RUL", "ROOT");

        setParent(bones, "LSHOE", "LLL")
        setParent(bones, 'LLL','LUL')
        setParent(bones, "LUL","ROOT");

        let boneList = Object.getOwnPropertyNames(bones);
        for (let i = 0; i < boneList.length; i++) {
            let boneQ = bones[boneList[i]].quaternion; // This is the "local" quaternion
            let globalQ = getGlobalFromLocal(bones, boneQ, boneList[i]);
            globalQs[boneList[i]] = globalQ;
        }

        setSliderPositions(bones, useGlobalQs.current);
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
        let newSliderValues = Object.getOwnPropertyNames(sliderValuesShadowCopy).length > 0 ? {...sliderValuesShadowCopy} : { ...sliderValues }; // Create shallow clone of old model state
        newSliderValues[boneId] = slideArray;
        let newQ = new THREE.Quaternion(slideArray[0], slideArray[1], slideArray[2], slideArray[3]);
        
        let newGlobalQ = useGlobalQs.current ? 
            newQ :
            getGlobalFromLocal(bones, newQ, boneId);

        let newLocalQ = useGlobalQs.current ?
            getLocalFromGlobal(newQ, boneId) :
            newQ;

        globalQs[boneId] = newGlobalQ;

        bones[boneId].quaternion.set(newLocalQ.x, newLocalQ.y, newLocalQ.z, newLocalQ.w);
    
        let affectedByInheritance = [];
        
        if (childrenOf[boneId]) affectedByInheritance.push(...childrenOf[boneId])

        if (playTimerId.current === 0) { // (Don't bother doing this when viewing pre-recorded data.)
            while (affectedByInheritance.length > 0) {
                let currentBone = affectedByInheritance.shift();
                if (childrenOf[currentBone]) affectedByInheritance.push(...childrenOf[currentBone])
                if (useRipple) {
                    // We don't have to "DO" anything to the model. This is default behavior.
                    // Just update the sliders.
                    let currLocalQ = bones[currentBone].quaternion;
                    let currGlobalQ = getGlobalFromLocal(bones, currLocalQ, currentBone);
                    let sliderQ = useGlobalQs.current ? currGlobalQ : currLocalQ;
                    newSliderValues[currentBone] = [sliderQ.x, sliderQ.y, sliderQ.z, sliderQ.w];
                    globalQs[currentBone] = currGlobalQ;
                } else {
                    // This is NOT the default behavior.
                    let oldGlobalQ = globalQs[currentBone];
                    // Note: scope
                    let newLocalQ = getLocalFromGlobal(oldGlobalQ, currentBone);
                    let sliderQ = useGlobalQs.current ? oldGlobalQ : newLocalQ;
                    bones[currentBone].quaternion.set(newLocalQ.x, newLocalQ.y, newLocalQ.z, newLocalQ.w);
                    newSliderValues[currentBone] = [sliderQ.x, sliderQ.y, sliderQ.z, sliderQ.w];
                }
            }
        }

        sliderValuesShadowCopy = newSliderValues;
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
            RUL: {
                x: 0.001,
                y:-0.029,
                z: 0.999,
                w: 0.044,
            },
            RLL: {
                x:0.001,
                y:-0.035,
                z:0.999,
                w: 0.04,
            },
            RSHOE: {
                x: 0.006,
                y: 0.467,
                z: 0.883,
                w: 0.043
            },
            LUL: {
                x:-0.001,
                y:-0.032,
                z: 0.999,
                w: -0.044,
            },
            LLL: {
                x:-0.001,
                y:-0.034,
                z:0.999,
                w:-0.04,
            },
            LSHOE: {
                x: -0.006,
                y: 0.465,
                z: 0.884,
                w: -0.043
            },
        }

        let boneNames = Object.getOwnPropertyNames(resetValues);

        for (let i = 0; i < boneNames.length; i++) {
            let q = resetValues[boneNames[i]];
            globalQs[boneNames[i]] = new THREE.Quaternion(q.x, q.y, q.z, q.w);
            let lq = getLocalFromGlobal(globalQs[boneNames[i]], boneNames[i]);
            bones[boneNames[i]].quaternion.set(lq.x, lq.y, lq.z, lq.w);
        }
        
        setSliderPositions(bones, useGlobalQs.current)
        setModelNeedsUpdating(true);
    }

    function getCamera() {
        return camera.current;
    }

    function getControls() {
        return orbitControls.current;
    }

    return (
        <div className="myView">
            <Menu 
                isOpen={menuIsOpen}
                setIsOpen={setMenuIsOpen}
                isPinned={menuIsPinned}
                setIsPinned={setMenuIsPinned}
                selectedPanel={selectedPanel}
                setSelectedPanel={setSelectedPanel}

                expandedItems={expandedItems} 
                setExpandedItems={setExpandedItems} 
                selectedFile={selectedFile}
                setSelectedFile={clickFile}
                getWindowDimensions={useWindowDimensions}
                searchFileText={searchFileText}
                setSearchFileText={setSearchFileText}
                checkFileName={isFileNameValid}
                cardsPos={cardsPos}
                setCardsPos={setCardsPos}
                timeDisplay={timeDisplay}
                setTimeDisplay={setTimeDisplay}

                modelLoaded={modelLoaded}
                sliderValues={sliderValues}
                updateModel={updateSingleQValue}
                batchUpdate={batchUpdateObject}
                bones={bones}
                resetModel={resetModel}

                useGlobalQs={useGlobalQs}
                useRipple={useRipple}
                setUseRipple={setUseRipple}
                refreshGlobalLocal={setSliderPositions}

                fileList={files}

                playTimerId={playTimerId}
                lineNumberRef={lineNumberRef}
                timeSliderValue={timeSliderValue}
                setTimeSliderValue={setTimeSliderValue}
                setPlaying={setPlaying}

                outputTypes={outputTypes}
                openLab={openLab}
                setOpenLab={setOpenLab}
                data={data}
                lastIndex={lastIndex}
                FPS={FPS}
                repeat={repeat}

                getCamera={getCamera}
                getControls={getControls}
                
                dev={props.dev}
            />

            <Visualizer 
                downloadPercent={downloadPercent}
                downloading={downloading}
                camera={camera}
                orbitControls={orbitControls}
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
                timeDisplay={timeDisplay}
                setTimeDisplay={setTimeDisplay}
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
                disabled={data.current.length === 0}
            />

            <CardSet 
                timeSliderValue={timeSliderValue}
                data={data}
                cardsPos={cardsPos}
                menuIsOpen={menuIsOpen}
                getWindowDimensions={useWindowDimensions}
                outputTypes={outputTypes}
            />

            <TopActionBar
                selectedFile={selectedFile}
                setSelectedFile={onSelectFileChange}
                modelLoaded={modelLoaded}
                cardsPos={cardsPos}
                getWindowDimensions={useWindowDimensions}
                menuIsOpen={menuIsOpen}
                setMenuIsOpen={setMenuIsOpen}
                setSelectedPanel={setSelectedPanel}
            />

            <Animator
                batchUpdate={batchUpdateObject}
                selectedFile={selectedFile}

                useGlobalQs={useGlobalQs}
                useRipple={useRipple}
                setUseRipple={setUseRipple}
                refreshGlobalLocal={setSliderPositions}

                playTimerId={playTimerId}
                lineNumberRef={lineNumberRef}
                timeSliderValue={timeSliderValue}
                setTimeSliderValue={setTimeSliderValue}
                setPlaying={setPlaying}

                outputTypes={outputTypes}
                openLab={openLab}
                setOpenLab={setOpenLab}
                data={data}
                lastIndex={lastIndex}
                FPS={FPS}
                repeat={repeat}

                getCamera={getCamera}
                getControls={getControls}
            />

        </div>
    )
}