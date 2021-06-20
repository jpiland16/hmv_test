import './Viewport.css'
import Menu from './menu/Menu'
import React from 'react'
import Visualizer from './visualizer/Visualizer';
import PlayBar from './PlayBar'
import TopActionBar from './TopActionBar'
import CardSet from './cards/CardSet'
import * as THREE from 'three'
import Animator from './Animator';

import { getMap, getFileList, downloadFile, downloadMetafile } from './viewport-workers/NetOps'
import { onSelectFileChange, isFileNameValid, clickFile} from './viewport-workers/FileOps'
import { getLocalFromGlobal, getGlobalFromLocal } from './viewport-workers/MathOps'
import { setSliderPositions, onLoadBones } from './viewport-workers/BoneOps'
import { resetModel } from './viewport-workers/Reset'

// Window resize code: see https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs

let childrenOf = {};
let parentOf = {};
let globalQs = {};
let sliderValuesShadowCopy = {};
let outgoingRequest = false;
const lastFiles = [null]; // Wrapped in array to be mutable
const fileMap = [null]; // Wrapped in an array to be mutable

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
            setSelectedFile: setSelectedFile,
            clickFile: click, 
            onSelectFileChange: selectChange,
            checkFileName: validateFileName,
            files: files,
            lastFiles: lastFiles,
            fileMap: fileMap,

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
            setBones: setBones,
            onLoadBones: loadBones,
            resetModel: reset,
            parentOf: parentOf,
            childrenOf: childrenOf,

            // MODEL MANIPULATION
            sliderValues: sliderValues,
            setSliderValues: setSliderValues,
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
            globalQs: globalQs,
            useGlobalQs: useGlobalQs,
            useRipple: useRipple,
            setUseRipple: setUseRipple,
            refreshGlobalLocal: resetSliders,

        // -- FILE VIEWING & PLAYBACK --

            // FILE DOWNLOADS
            downloading: downloading,
            setDownloading: setDownloading,
            downloadPercent: downloadPercent,
            setDownloadPercent: setDownloadPercent,
            downloadFile: downloadFile,
            downloadMetafile: downloadMetafile,
            outgoingRequest: outgoingRequest, 

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

        // -- MATH --
            getGlobalFromLocal: getGlobalFromLocal,
            getLocalFromGlobal: getLocalFromGlobal,

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
                    getFileList(propertySet);
                }
                getMap(propertySet).then(() => {
                    if (selectedFile !== "") {
                        if (isFileNameValid(propertySet, selectedFile)) {
                            onSelectFileChange(propertySet, selectedFile);
                        }
                    }
                }, () => { });
                props.setFirstLoad(false);
            } else {
                if (files.current && files.current.length === 0) {
                    files.current = propertySet.lastFiles[0];
                }
            }
        }
    });

    // REDIRECTORS TO IMPORTED FUNCTIONS, using needed properties

    function reset() {
        resetModel(propertySet)
    }

    function validateFileName(fname) {
        return isFileNameValid(propertySet, fname)
    }

    function click(id) {
        clickFile(propertySet, id)
    }

    function selectChange(file) {
        onSelectFileChange(propertySet, file)
    }

    function resetSliders(bones, useGlobal) {
        setSliderPositions(propertySet, bones, useGlobal)
    }

    function loadBones(bones) {
        onLoadBones(propertySet, bones)
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
            getGlobalFromLocal(propertySet, bones, newQ, boneId);

        let newLocalQ = useGlobalQs.current ?
            getLocalFromGlobal(propertySet, newQ, boneId) :
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
                    let currGlobalQ = getGlobalFromLocal(propertySet, bones, currLocalQ, currentBone);
                    let sliderQ = useGlobalQs.current ? currGlobalQ : currLocalQ;
                    newSliderValues[currentBone] = [sliderQ.x, sliderQ.y, sliderQ.z, sliderQ.w];
                    globalQs[currentBone] = currGlobalQ;
                } else {
                    // This is NOT the default behavior.
                    let oldGlobalQ = globalQs[currentBone];
                    // Note: scope
                    let newLocalQ = getLocalFromGlobal(propertySet, oldGlobalQ, currentBone);
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