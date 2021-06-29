import io from 'socket.io-client'
import { getFileList } from './NetOps' // Rather than importing from NetOps, we should move the dependent code to NetOps.js
import { initializeScene } from '../visualizer_experimental/SceneInitializer'; // This should belong to Viewport or some other worker.

let boneNames = {
    LUA: "upperarm_l", 
    LLA: "lowerarm_l", 
    RUA: "upperarm_r", 
    RLA: "lowerarm_r", 
    BACK: "spine_02", /** IMPORTANT */
    LSHOE: "foot_l", 
    RSHOE: "foot_r",
    ROOT: "_rootJoint",
    RUL: "right_upper_leg",
    LUL: "left_upper_leg",
    RLL: "right_lower_leg",
    LLL: "left_lower_leg"
}

// Does not need to check for a mapping from filename to metadata in the current scheme, so it always
// just rubber stamps the file. May be changed later based on other criterion.
export function isFileNameValid(props, fname) {
    return true;
    // return props.fileMap[0] && Object.getOwnPropertyNames(props.fileMap[0]).indexOf(fname) >= 0
}

export function clickFile(props, id) {
    if(isFileNameValid(props, id)) {
        onSelectFileChange(props, id);
        window.history.replaceState(null, null, "?file=" + id);
    }
}

export function onSelectFileChange(props, mySelectedFile) {
    console.log("OnSELECTFILECHANGE IS RUNNING");
    // // IMPORTANT! This method should only be called if mySelectedFile 
    // // has been VERIFIED as a valid file, or if we need to clear/reset the model. (i.e. mySelectedFile === "")
    // if (!props.outgoingRequest) {
    //     props.setSelectedFile(mySelectedFile);                    
    //     props.data.current = [];                                        // Allow either refresh or disable
    //     props.outputTypes.current = []                                  // Clear all graphs
    //     props.setTimeSliderValue(0);                                    // Move to start
    //     props.lineNumberRef.current = 0;                                // (same as above)
    //     props.setUseRipple(true)                                        // For the initialization of the model
    //     if (props.modelLoaded) {
    //         props.resetModel()                                          // Same as above
    //         props.setUseRipple(false)           
    //         if (props.playTimerId.current !== 0) {                      // Stop playback if it is occuring
    //                 window.clearInterval(props.playTimerId.current);   
    //                 props.playTimerId.current = 0;
    //                 props.setPlaying(false);
    //         } 
    //         let cam = props.getCamera();
    //         if (cam) {
    //             cam.position.x = 0;
    //             cam.position.y = 0;
    //             cam.position.z = 3;
    //             cam.up.set(0, 1, 0);
    //             props.getControls().update();
    //         }  
    //     }
    //     if (mySelectedFile !== "") {
    //         props.downloadMetafile(props, mySelectedFile).then(() => {
    //             props.downloadFile(props, mySelectedFile)
    //         }, () => {})
    //     }
    // }
    props.data.current = [];
    console.log("Selected file has been changed to " + mySelectedFile + " (re-printed below)");
    console.log(mySelectedFile);
    props.setSelectedFile(mySelectedFile); // We may want some verification, but verification is also done by this method.
    const URL = "http://localhost:3000"; // This needs to be flexible based on whether we're locally running
    const socket = io(URL, { 
        autoConnect: false,
        auth: {
            username: "placeholder_username"
        },
        query: {
            "file": mySelectedFile
        },
    });

    socket.on("Processing data", () => {
        console.log("Received processing data message");
        props.setFileStatus({ status: "Processing data" }); // What should I use as a stand-in for changing status here? Probably props.setStatus("Processing Data"), or just use a flag
    });

    socket.on("File ready", () => {
        props.setFileStatus({ status: "Loading file" });
        console.log(mySelectedFile);
        getFileList(props);
        getFile(mySelectedFile)
        .then((responses) => {
            console.log(responses[0]); // Data file
            console.log(responses[1]); // Metadata file

            //When we get the files, we should use the original code to assign them as quaternions (after decoding from metadata)
            // Lifted from NetOps.js temporarily
            let inputArray = responses[0].split("\n");
            let linesArray = [];
    
            for (let i = 2; i < inputArray.length - 1; i++) {
                linesArray.push(inputArray[i].split(" ").filter(item => item !== '\r'));
            }
    
            props.data.current = linesArray;
            props.setDownloading(false);
            props.outgoingRequest = false;

            props.fileMetadata.current = JSON.parse(responses[1]);

            socket.disconnect();
            props.setFileStatus({ status: "Loading models" });
            initializeScene().then((newSceneInfo)=> { // This call gets us way too nested. This should be extracted as a function.
                props.setSceneInfo({
                    scene: newSceneInfo.scene,
                    model: newSceneInfo.model,
                    camera: null,
                    renderer: newSceneInfo.renderer,
                });                
                
                let modelBoneList = Object.getOwnPropertyNames(boneNames);

                let bones = [];
                for (let i = 0; i < modelBoneList.length; i++) {
                    bones[modelBoneList[i]] = newSceneInfo.model.getObjectByName(boneNames[modelBoneList[i]])
                }
                props.onLoadBones(bones)
                // props.batchUpdate("RUA", [0,0,0,1]);
                props.setTimeSliderValue(0);
                props.setFileStatus({ status: "Complete" }); // Determining the next stage by completing the previous stage forces sequential loading. Try using progress flags.
            });
        })
        .catch((error) => {
            // this.setState({
            //     errorMessage: "Encountered an error retrieving the file from the server. Try reloading or resubmitting."
            // });
            props.setFileStatus({ status: "Error", message: "The file could not be retrieved from the server. Try refreshing or resubmitting." });
            socket.disconnect();
        });
    });

    socket.on("File missing", () => {
        console.log("File doesn't exist.");
        props.setFileStatus({ status: "Error", message: "The requested file doesn't exist. Try reselecting the file or resubmitting." });
        socket.disconnect();
    })

    socket.onAny((event, ...args) => {
        console.log("Received data through socket.");
        console.log(event, args);
    });

    socket.connect();
    console.log("Connected with socket.");
}

//TODO: Should move this to NetOps and merge with existing concept for file downloads
function getFile(fileName) {
    let dataPromise = getFilePart(fileName, 'data');
    let metadataPromise = getFilePart(fileName, 'metadata');
    return Promise.all([dataPromise, metadataPromise]);
}

function getFilePart(fileName, type) {
    return new Promise((resolve, reject) => {
        if (type !== 'data' && type !== 'metadata') {
            console.log("Inappropriate data type: Should either be data or metadata.");
        }   
        let dataReq = new XMLHttpRequest();
        dataReq.onload = (event => {
            console.log(dataReq);
            switch(dataReq.status) {
                case (200):
                    resolve(dataReq.responseText);
                    break;
                case (400):
                    reject("Invalid data type request!");
                    break;
                case (404):
                    reject("The target file was not found.");
                    break;
            }
        });
        dataReq.onerror = (() => {
            reject();
        })
        const targetURL = ("/api/uploadedfiles?")
        const params = new URLSearchParams();
        params.set('file', fileName);
        params.set('type', type);
        params.set('accessCode', 'password_wrong');
        console.log(params.toString());
        const target = targetURL + params.toString();
        dataReq.open("GET", target);
        // TODO: Right now the response is in the default 'text' format, but it might
        // be more appropriate to use another format.
        dataReq.send();
        console.log("GET request has been sent: ");
    });
}
