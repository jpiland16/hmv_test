import io from 'socket.io-client'

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

/**
 * Retrieves the file tree from the server as a nested JSON file containing display names
 * and IDs for each file. The IDs can be used for GET requests to "/api/uploadedfiles".
 * @param {Object} props An Object with mutable entries props.files.current and lastFiles
 * to store the JSON from the server.
 */
export async function getFileList(props) {
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
            props.files.current = res;
            props.lastFiles[0] = res;
        },
        (errXhrr) => {
            console.error("XHR Error");
            console.log(errXhrr.status);
            console.log(errXhrr.statusText);
            console.log(errXhrr.responseText);
        }
    )
}

export async function getMap(props) {
    const mapPath = (window.location.href.substring(0, 22) === "http://localhost:3000/" ? 
    "https://raw.githubusercontent.com/jpiland16/hmv_test/master" :
    "") + "/files/meta/map.json"
    return new Promise((myResolve, myReject) => {
        doXHR('GET', mapPath).then(
            (xhrr) => {
                try {
                    props.fileMap[0] = JSON.parse(xhrr.responseText)
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

export function downloadFile(props, fname) {
    props.outgoingRequest = true;
    props.setDownloading(true);
    props.setDownloadPercent(0);
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

        props.data.current = linesArray;
        props.setDownloading(false);
        props.outgoingRequest = false;
    }

    x.onprogress = (event) => {
        props.setDownloadPercent(Math.min(100, Math.round(event.loaded / event.total * 100)));
    }

    x.onerror = (error) => {
        console.log(error);
    }

    x.send();
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

export function subscribeToFile(props, mySelectedFile) {
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
            props.initializeScene().then((newSceneInfo)=> { // This call gets us way too nested. This should be extracted as a function.
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
    props.setFileStatus({ status: "Contacting server" });
}

export function downloadMetafile(props, selectedFilename) {
    // let path = "/files/meta/" + props.fileMap[0][selectedFilename] + ".json"
    // if (window.location.href.substring(0, 22) === "http://localhost:3000/") {
    //     path = "https://raw.githubusercontent.com/jpiland16/hmv_test/master" + path
    // }

    // return new Promise((myResolve, myReject) => {
    //     doXHR('GET', path).then(
    //         (xhrr) => {
    //             try {
    //                 props.fileMetadata.current = JSON.parse(xhrr.responseText)
    //                 myResolve()
    //             } catch (e) {
    //                 console.error("Metafile '" + path + "' not found!")
    //                 myReject()
    //             }
    //         }, (errXhrr) => {
    //             console.log(errXhrr)
    //             myReject()
    //         }
    //     )
    // });

    return new Promise((resolve, reject) => {
        let dataReq = new XMLHttpRequest();
        dataReq.onload = (event => {
            switch(dataReq.status) {
                case (200):
                    resolve(JSON.parse(dataReq.responseText));
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
        params.set('file', selectedFilename);
        params.set('type', 'metadata');
        params.set('accessCode', 'password_wrong');
        const target = targetURL + params.toString();
        dataReq.open("GET", target);
        // TODO: Right now the response is in the default 'text' format, but it might
        // be more appropriate to use another format.
        dataReq.send();
        console.log("GET request has been sent: ");
    });
}