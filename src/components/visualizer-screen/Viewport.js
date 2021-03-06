import './Viewport.css'
import Menu from './menu/Menu'
import React from 'react'
import HomeButton from './HomeButton'
import FileViewer from './FileViewer'
import PlayBar from './PlayBar'
import TopActionBar from './TopActionBar'
import CardSet from './cards/CardSet'
import Animator from './Animator'
import { MannequinVisualizer, PhoneVisualizer } from '../shared_visualizer_object/Models'

import { getFileList, downloadFile, subscribeToFile } from './viewport-workers/NetOps'
import { onSelectFileChange, isFileNameValid, clickFile} from './viewport-workers/FileOps'

let outgoingRequest = false;
const lastFiles = [null]; // Wrapped in an array to be mutable

const VERBOSE_OUTPUT = false

const isReactDevServer = (window.location.href.substring(0, 22) === "http://localhost:3000/")
const SKIP_SOCKET = false
const useProxy = !(isReactDevServer && SKIP_SOCKET)

const mannequinVisualizer = new MannequinVisualizer()
const phoneVisualizer = new PhoneVisualizer()
phoneVisualizer.initialize()

/**
 * 
 * Contains all the elements visible to the user when viewing the Visualizer
 * screen. In the future, elements such as the PlayBar and TopActionBar
 * should be moved into their own object, such as what was done with the
 * split-screen branch.
 * 
 * @component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.dev - whether we are in the /dev mode (additional
 * options)
 * @param {boolean} props.firstLoad - whether the site has been loaded already
 * @param {function} props.setFirstLoad - function to set whether the site has 
 * been loaded already 
 */
function Viewport(props) {

    if (VERBOSE_OUTPUT) console.log("Re-rendering viewport.")
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let initialSelectedFile = { fileName: "", displayName: "None" };
    let initialExpandedItems = ["/"];
    let initialFileStatus = { status: "Contacting server" };

    if (urlParams.has('file')) {
        const fpath = urlParams.get('file');
        initialSelectedFile.fileName = fpath;
        initialSelectedFile.displayName = "Loading...";
        if (urlParams.has('name')) { 
            initialSelectedFile.displayName = urlParams.get('name'); 
        }
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
    const [ menuIsOpen, setMenuIsOpen ] = React.useState(urlParams.has('menu'));                 
    const [ menuIsPinned, setMenuIsPinned ] = React.useState(true);              // Menu is pinned by default
    const [ useRipple, setUseRipple ] = React.useState(false);                   // Limbs move independently by default
    const [ timeSliderValue, setTimeSliderValue ] = React.useState(0);           // Initial position is 0
    const [ playing, setPlaying ] = React.useState(false);                       // Paused by default
    const [ toolTipOpen, setTipOpen ] = React.useState(false);
    const [ cardsPos, setCardsPos ] = React.useState(window.localStorage.getItem("cardsPos") || 'right');
    const [ timeDisplay, setTimeDisplay ] = React.useState(window.localStorage.getItem("timeDisplay") || 'msm')
    const [ downloadPercent, setDownloadPercent ] = React.useState(0);
    const [ downloading, setDownloading ] = React.useState(false);
    const [ openLab, setOpenLab ] = React.useState("");
    const [ fileStatus, setFileStatus ] = React.useState(initialFileStatus);
    const [ modelDownloadProgress, setModelProgress ] = React.useState(0);
    const [ windowDimensions, setWindowDimensions ] = React.useState(getWindowDimensions());
    const [ visualizer, setVisualizer ] = React.useState(mannequinVisualizer)
    
    /*   ---------------------
     *   REFS (React.useRef())
     *   --------------------- */  

    const data = React.useRef([]);
    const FPS = React.useRef(30);
    const repeat = React.useRef(false);
    const lastIndex = React.useRef(-1);
    const playTimerId = React.useRef(0);
    const lineNumberRef = React.useRef(0); // Start from beginning of file by default
    const fileMetadata = React.useRef(null)
    const files = React.useRef([]);
    const outputTypes = React.useRef([]);
    const scenePromise = React.useRef(null);

    const propertySet = {

        // -- VISUALIZER --
            visualizer: visualizer,
            setVisualizer: setVisualizer,
            mannequinVisualizer: mannequinVisualizer,
            phoneVisualizer: phoneVisualizer,
            awaitScene: scenePromise,

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

            fileStatus: fileStatus,
            setFileStatus: setFileStatus,
            clickFile: (id, name) => clickFile(propertySet, id, name), 
            onSelectFileChange: (file, displayName) => onSelectFileChange(propertySet, file, displayName),
            checkFileName: (fname) => isFileNameValid(propertySet, fname),
            files: files,
            lastFiles: lastFiles,

            // FILE SEARCH PROPERTIES
            searchFileText: searchFileText,
            setSearchFileText: setSearchFileText,

            // CARD SETTINGS
            cardsPos: cardsPos,
            setCardsPos: setCardsPos,

            // TIME-DISPLAY OPTIONS (for the time in bottom right of the screen)
            timeDisplay: timeDisplay,
            setTimeDisplay: setTimeDisplay,

            // MODEL OPTIONS
            useRipple: useRipple,
            setUseRipple: setUseRipple,

        // -- FILE VIEWING & PLAYBACK --

            // FILE DOWNLOADS
            downloading: downloading,
            setDownloading: setDownloading,
            downloadPercent: downloadPercent,
            setDownloadPercent: setDownloadPercent,
            downloadFile: downloadFile,
            outgoingRequest: outgoingRequest, 
            subscribeToFile: subscribeToFile,
            modelDownloadProgress : modelDownloadProgress,

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
            toolTipOpen: toolTipOpen, //tooltip for play button can only be viewed when play button is disabled
            setTipOpen: setTipOpen,     

        // -- WINDOW PROPERTIES --
            getWindowDimensions: () => windowDimensions,

        // -- DEVELOPMENT OPTIONS --
        
            // LAB OPTIONS
            openLab: openLab,
            setOpenLab: setOpenLab,

            // DEV MODE
            dev: props.dev,
            baseURL: useProxy ? "" : "https://raw.githubusercontent.com/jpiland16/hmv_test/master/files",

            // console.log
            verbose: VERBOSE_OUTPUT

    }

    /*   -------------------
     *   POST-RENDER EFFECTS
     *   ------------------- */  

    React.useEffect(() => {

        if(props.firstLoad) {
            // getMap(propertySet).then(() => {
            // }, () => { });
            props.setFirstLoad(false);
        } else {
            if (files.current && files.current.length === 0) {
                files.current = propertySet.lastFiles[0];
            }
        }

        if (VERBOSE_OUTPUT) console.log("Running useEffect");
        scenePromise.current = mannequinVisualizer.initialize((percent) => setModelProgress(percent));

        getFileList(propertySet);
        
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        
        if (selectedFile.fileName !== '' && isFileNameValid(propertySet, selectedFile.fileName)) {
            if (VERBOSE_OUTPUT) console.log("Running onSelectFileChange");
            onSelectFileChange(propertySet, selectedFile.fileName, selectedFile.displayName);
        }
        else {
            if (VERBOSE_OUTPUT) console.log("Not running onSelectFileChange");
        }
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);


    }, []); // No dependencies, so it runs only once at first render.

    /*  ---------------------
     *  WINDOW SIZE RETRIEVAL
     *  --------------------- */

    // Window resize code: see https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return [
            width,
            height
        ];
    }      

    /*  ----------------------------------------
     *  RETURN OF THE RENDER - PROPS -> CHILDREN
     *  ---------------------------------------- */

    return (
        <div className="myView">
            <HomeButton />
            <Menu {...propertySet} />
            <TopActionBar {...propertySet} />
            <FileViewer targetFile={""} {...propertySet}/>
            <CardSet {...propertySet} />
            <PlayBar {...propertySet} disabled={(!fileStatus || fileStatus.status !== "Complete" || selectedFile.fileName === "") && openLab === ""} />
            <Animator {...propertySet} />
        </div>
    )
}

export default Viewport;