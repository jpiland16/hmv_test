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
let fileMap = null;

export default function Viewport(props) {

     /* CONTENTS OF THIS FILE (Viewport.js) +3
      *
      *  - Initial URL parameter checks (lines 36 - 51)
      *  - Application state initialization (lines 57 - 74)
      *  - Application refs initialization (lines 80 - 91)
      *  - Post-render effects (lines 97 - 112)
      *  - File operations (lines 118 - 155)
      *  - Network file retrieval (lines 163 - 258) +4
      *  - Window size retrieval (lines 261 - 282)
      *  - Manipulation of the 3D model (lines 289 - 343)
      *  - Quaternion math (lines 349 - 373) 
      *  - Programmatic updates to the 3D model (lines 379 - 522)
      *  - Three.JS getter methods (lines 528 - 534)
      *  - Render return (lines 540 - 678)
      */
    
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

    /*   ------------------------
     *   STATE (React.useState())
     *   ------------------------ */  

    const [ selectedPanel, setSelectedPanel ] = React.useState(0);
    const [ expandedItems, setExpandedItems ] = React.useState(initialExpandedItems);
    const [ selectedFile, setSelectedFile ] = React.useState(initialSelectedFile);
    const [ searchFileText, setSearchFileText ] = React.useState("");
    const [ modelLoaded, setModelLoaded ] = React.useState(false);
    const [ bones, setBones ] = React.useState(null);
    const [ sliderValues, setSliderValues ] = React.useState(null);
    const [ modelNeedsUpdating, setModelNeedsUpdating ] = React.useState(false);
    const [ menuIsOpen, setMenuIsOpen ] = React.useState(false);                 // Menu is closed by default
    const [ menuIsPinned, setMenuIsPinned ] = React.useState(true);              // Menu is pinned by default
    const [ useRipple, setUseRipple ] = React.useState(false);                   // Limbs move independently by default
    const [ timeSliderValue, setTimeSliderValue ] = React.useState(0);           // Initial position is 0
    const [ playing, setPlaying ] = React.useState(false);                       // Paused by default
    const [ cardsPos, setCardsPos ] = React.useState(window.localStorage.getItem("cardsPos") || 'right');
    const [ timeDisplay, setTimeDisplay ] = React.useState(window.localStorage.getItem("timeDisplay") || 'msm')
    const [ downloadPercent, setDownloadPercent ] = React.useState(0);
    const [ downloading, setDownloading ] = React.useState(false);
    const [ openLab, setOpenLab ] = React.useState("");
    
    /*   ---------------------
     *   REFS (React.useRef())
     *   --------------------- */  

    const useGlobalQs = React.useRef(true); // Use global quaternions by default
    const camera = React.useRef(undefined);
    const orbitControls = React.useRef(undefined);
    const outputTypes = React.useRef([]);
    const data = React.useRef([]);
    const FPS = React.useRef(30);
    const repeat = React.useRef(false);
    const lastIndex = React.useRef(-1);
    const playTimerId = React.useRef(0);
    const lineNumberRef = React.useRef(0); // Start from beginning of file by default
    const fileMetadata = React.useRef(null)
    const files = React.useRef([]);

    const propertySet = {

        // -- MENU OPTIONS --

            // META-MENU PROPERTIES
            menuIsOpen: menuIsOpen,
            setMenuIsOpen: setMenuIsOpen,
            menuIsPinned: menuIsPinned,
            setMenuIsPinned: setMenuIsPinned,
            selectedPanel: selectedPanel,
            setSelectedPanel: setSelectedPanel,

            // FILE SELECTION PROPERTIES
            expandedItems: expandedItems,
            setExpandedItems: setExpandedItems,
            selectedFile: selectedFile,
            setSelectedFile: clickFile, // NOTE! Need to check validity of file first.
            checkFileName: isFileNameValid,
            fileList: files,

            // FILE SEARCH PROPERTIES
            searchFileText: searchFileText,
            setSearchFileText: setSearchFileText,

            // CARD SETTINGS
            cardsPos: cardsPos,
            setCardsPos: setCardsPos,

            // TIME-DISPLAY OPTIONS (for the time in bottom right of the screen)
            timeDisplay: timeDisplay,
            setTimeDisplay: setTimeDisplay,

        // -- MOVING THE 3-D MODEL -- 

            // MODEL PROPERTIES
            modelLoaded: modelLoaded,
            setModelLoaded: setModelLoaded,
            bones: bones,
            setBones: onLoadBones,
            resetModel: resetModel,

            // MODEL MANIPULATION
            sliderValues: sliderValues,
            updateModel: updateSingleQValue,
            batchUpdate: batchUpdateObject,
            modelNeedsUpdating: modelNeedsUpdating,
            setModelNeedsUpdating: setModelNeedsUpdating,

            // THREE.JS OBJECTS
            camera: camera,
            getCamera: getCamera,
            orbitControls: orbitControls,
            getControls: getControls,

            // QUATERNION PROPERTIES
            useGlobalQs: useGlobalQs,
            useRipple: useRipple,
            setUseRipple: setUseRipple,
            refreshGlobalLocal: setSliderPositions,

        // -- FILE VIEWING & PLAYBACK --

            // FILE DOWNLOADS
            downloading: downloading,
            downloadPercent: downloadPercent,

            // DATA
            data: data,
            fileMetadata: fileMetadata,

            // PLAYBACK FEATURES
            outputTypes: outputTypes,

            // PLAYBACK OPTIONS
            playing: playing,
            setPlaying: setPlaying,
            playTimerId: playTimerId, // The ID of the window.setInterval()
            lineNumberRef: lineNumberRef, // Current line number of `data` to view
            timeSliderValue: timeSliderValue,
            setTimeSliderValue: setTimeSliderValue,
            FPS: FPS,
            repeat: repeat,
            lastIndex: lastIndex,        

        // -- WINDOW PROPERTIES --
            getWindowDimensions: useWindowDimensions,

        // -- DEVELOPMENT OPTIONS --
        
            // LAB OPTIONS
            openLab: openLab,
            setOpenLab: setOpenLab,

            // DEV MODE
            dev: props.dev

    }

    /*   -------------------
     *   POST-RENDER EFFECTS
     *   ------------------- */  

    React.useEffect(() => {
        if(bones) {
            if(props.firstLoad) {
                if (files.current.length === 0) {
                    getFileList();
                }
                getMap().then(() => {
                    if (selectedFile !== "") {
                        if (isFileNameValid(selectedFile)) {
                            onSelectFileChange(selectedFile);
                        }
                    }
                }, () => { });
                props.setFirstLoad(false);
            } else {
                files.current = lastFiles;
            }
        }
    });

    /*  --------------------------------
     *  FILE OPERATIONS (User-initiated)
     *  -------------------------------- */

    function isFileNameValid(fname) {
        return fileMap && Object.getOwnPropertyNames(fileMap).indexOf(fname) >= 0
    }

    function clickFile(id) {
        if(isFileNameValid(id)) {
            onSelectFileChange(id);
            window.history.replaceState(null, null, "?file=" + id);
        }
    }

    function onSelectFileChange(mySelectedFile) {
        // IMPORTANT! This method should only be called if mySelectedFile 
        // has been VERIFIED as a valid file, or if we need to clear/reset the model. (i.e. mySelectedFile === "")
        if (!outgoingRequest) {
            setSelectedFile(mySelectedFile);                    
            data.current = [];                                        // Allow either refresh or disable
            outputTypes.current = []                                  // Clear all graphs
            setTimeSliderValue(0);                                    // Move to start
            lineNumberRef.current = 0;                                // (same as above)
            setUseRipple(true)                                        // For the initialization of the model
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
            if (mySelectedFile !== "") {
                downloadMetafile(mySelectedFile).then(() => {
                    downloadFile(mySelectedFile)
                }, () => {})
            }
        }
    }

    /*   ----------------------
     *   NETWORK FILE RETRIEVAL
     *   ---------------------- */

    // PARENT XHR METHOD

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
    
    // NETWORK METHODS THAT SHOULD ONLY BE CALLED ONCE

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

    async function getMap() {
        const mapPath = (window.location.href.substring(0, 22) === "http://localhost:3000/" ? 
        "https://raw.githubusercontent.com/jpiland16/hmv_test/master" :
        "") + "/files/meta/map.json"
        return new Promise((myResolve, myReject) => {
            doXHR('GET', mapPath).then(
                (xhrr) => {
                    try {
                        fileMap = JSON.parse(xhrr.responseText)
                        myResolve()
                    } catch (e) {
                        console.error("File map not found!")
                        myReject()
                    }
                }, (errXhrr) => {
                    console.log(errXhrr)
                    myReject()
                }
            )
        });
    }

    // NETWORK METHODS THAT MAY BE CALLED MULTIPLE TIMES

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

    function downloadMetafile(selectedFilename) {
        let path = "/files/meta/" + fileMap[selectedFilename] + ".json"
        if (window.location.href.substring(0, 22) === "http://localhost:3000/") {
            path = "https://raw.githubusercontent.com/jpiland16/hmv_test/master" + path
        }

        return new Promise((myResolve, myReject) => {
            doXHR('GET', path).then(
                (xhrr) => {
                    try {
                        fileMetadata.current = JSON.parse(xhrr.responseText)
                        myResolve()
                    } catch (e) {
                        console.error("Metafile '" + path + "' not found!")
                        myReject()
                    }
                }, (errXhrr) => {
                    console.log(errXhrr)
                    myReject()
                }
            )
        });
    }

    /*  ---------------------
     *  WINDOW SIZE RETRIEVAL
     *  --------------------- */

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


    /*  ----------------------------
     *  MANIPULATION OF THE 3D MODEL
     *  ---------------------------- */

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

    /*  ---------------
     *  QUATERNION MATH
     *  --------------- */

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

    /*  --------------------------
     *  PROGRAMMATIC MODEL UPDATES
     *  -------------------------- */

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

        if (playTimerId.current === 0 && (props.dev && selectedFile === "")) { // (Don't bother doing this when viewing pre-recorded data, or if we aren't in dev mode and running tests.)
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

    /*  ---------------------------------
     *  THREE.JS REFERENCE GETTER METHODS
     *  --------------------------------- */

    function getCamera() {
        return camera.current;
    }

    function getControls() {
        return orbitControls.current;
    }

    /*  ----------------------------------------
     *  RETURN OF THE RENDER - PROPS -> CHILDREN
     *  ---------------------------------------- */

    return (
        <div className="myView">
            <Menu {...propertySet} />
            <Visualizer {...propertySet} onClick = { (event) => !menuIsPinned && setMenuIsOpen(false) } />
            <PlayBar {...propertySet} disabled={data.current.length === 0} />
            <CardSet {...propertySet} />
            <TopActionBar {...propertySet} />
            <Animator {...propertySet} />
        </div>
    )
}