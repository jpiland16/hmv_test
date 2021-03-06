import io from 'socket.io-client'
// PARENT XHR METHOD

/**
 * Conducts an XMLHttpRequest and returns the output through a promise.
 * 
 * @param {string} method - XHR method
 * @param {string} url - target URL
 * 
 * @category Client-side functions
 */
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
 * 
 * @param {Object} props An Object with mutable entries props.files.current and lastFiles
 * to store the JSON from the server.
 * @param {Object} props.files - React ref containing the file tree
 * @param {Object} props.files.current
 * 
 * @param {Array} props.lastFiles - mutable single-element array used to cache the file tree
 * and prevent unnecessary GET requests.
 * 
 * @category Client-side functions
 */
export async function getFileList(props) {
    doXHR("GET", "/api/get-file-list").then(
        (xhrr) => {
            if (props.verbose) console.log("Did XHR to get file list.");
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
                      id: '/demo/demo-anyname',
                      name: 'S4-ADL4'
                    }],
                }]
            }
            props.files.current = res;
            props.lastFiles[0] = res;
        },
        (errXhrr) => {
            if (props.verbose) console.error("XHR Error");
            if (props.verbose) console.log(errXhrr.status);
            if (props.verbose) console.log(errXhrr.statusText);
            if (props.verbose) console.log(errXhrr.responseText);
        }
    )
}

// NETWORK METHODS THAT MAY BE CALLED MULTIPLE TIMES

/**
 * This function is not being used anymore. Should be deleted.
 * 
 * @category Client-side functions
 */
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
        console.error(error);
    }

    x.send();
}


//TODO: Should merge with existing concept for file downloads

/**
 * Retrieves quaternion data and metadata from the server.
 * 
 * @param {string} fileName - the ID/full path to the file
 * @param {function} onProgress - function to be called as file is downloading
 * 
 * @category Client-side functions
 */
function getFile(fileName, onProgress) {
    let dataPromise = getFilePart(fileName, 'data', onProgress);
    let metadataPromise = getFilePart(fileName, 'metadata');
    return Promise.all([dataPromise, metadataPromise]);
}

function getFilePart(fileName, type, onProgress=null, verbose = false) {
    return new Promise((resolve, reject) => {
        if (type !== 'data' && type !== 'metadata') {
            if (verbose) console.log("Inappropriate data type: Should either be data or metadata.");
        }   
        let dataReq = new XMLHttpRequest();
        if (onProgress) {
            dataReq.onprogress = (event) => {
                onProgress(Math.round((event.loaded / event.total) * 100));
                // console.log("Loading " + ((type === 'data')? "data" : "metadata") + ":" + loadedPercent + "%");
            }
        }

        dataReq.onload = (event => {
            if (verbose) console.log(dataReq);
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
        if (verbose) console.log(params.toString());
        const target = targetURL + params.toString();
        dataReq.open("GET", target);
        dataReq.send();
        if (verbose) console.log("GET request has been sent: ");
    });
}

/**
 * Notifies the server that this client has subscribed to the target dataset file. Unsubscribes from any
 * other file that the component with properties `props` is subscribed to.
 * 
 * @param {Object} props 
 * 
 * @param {function} props.setFileStatus - Sets a String to one of the following values describing the visualizer's readiness:
 *      ( `"Processing data"`
 *      `"Loading file"`
 *      `"File ready"`
 *      `"Loading models"`).
 * 
 * @param {function} props.getFileList - Retreives the list of currently available files for viewing.
 * 
 * @param {Promise} props.awaitScene - A Promise that resolves with a sceneInfo Object (see below) when the scene has been loaded.
 * 
 * @param {function} props.setSceneInfo - Stores an Object containg entries for the scene, the mannequin model, and the renderer.
 * @param {function} props.onLoadBones - Sets the state of the client so that it applies data transformations to the model's bones.
 *  Runs any other relevant initialization code.
 * 
 * @param {function} props.setTimeSliderValue - Stores an int representing the data point to show to the user.
 * 
 * @param {String} mySelectedFile - The full filepath of the file to subscribe to, as enumerated by
 * the response to a GET request to 'api/get-file-list'.
 * 
 * @category Client-side functions
 */
export function subscribeToFile(props, mySelectedFile) {
    if (props.fileStatus.socket) {
        props.fileStatus.socket.disconnect();
        props.setFileStatus({ currentSocket: null });
    }
    const socket = io({ 
        autoConnect: false,
        auth: {
            username: "placeholder_username"
        },
        query: {
            "file": mySelectedFile
        },
    });

    socket.on("Processing data", () => {
        if (props.verbose) console.log("Received processing data message");
        props.setFileStatus({ status: "Processing data" }); // What should I use as a stand-in for changing status here? Probably props.setStatus("Processing Data"), or just use a flag
    });

    socket.on("File ready", () => {
        props.setFileStatus({ status: "Loading file", progress: 0 });
        if (props.verbose) console.log(mySelectedFile);
        getFileList(props);
        getFile(mySelectedFile, (progressPercent) => props.setFileStatus({ status: "Loading file", progress: progressPercent }), props.verbose)
        .then((responses) => {
            //When we get the files, we should use the original code to assign them as quaternions (after decoding from metadata)
            let inputArray = responses[0].split("\n");
            let linesArray = [];

            const COMMENT_DELIMITER = '#';
            const MIN_ITEMS_PER_LINE = 4;
            for (let i = 0; i < inputArray.length - 1; i++) {
                const lineItems = inputArray[i].split(" ").filter(item => item !== '\r');
                if (lineItems.length < MIN_ITEMS_PER_LINE || lineItems[0] === COMMENT_DELIMITER) { continue; }
                linesArray.push(inputArray[i].split(" ").filter(item => item !== '\r'));
            }
    
            props.data.current = linesArray;
            props.setDownloading(false);
            props.outgoingRequest = false;

            props.fileMetadata.current = JSON.parse(responses[1]);

            socket.disconnect();
            props.setFileStatus({ status: "Loading models" });
            // Note that this awaitScene dependence means that subscribeToFile will not work if we haven't yet rendered the viewport!
            try {
                    props.awaitScene.current.then( () => {
                        if (props.selectedFile.displayName === "Loading...") {
                            // Then this load must have been triggered from the initial load of the page, not from the user clicking the file tree
                            props.setSelectedFile({
                                fileName: props.selectedFile.fileName,
                                displayName: props.fileMetadata.current.displayName // Pull the display name from the metadata file (rather than from the file list)
                            })
                        } 
                        
                        props.setOpenLab("")
                        props.setFileStatus({ status: "Complete" }) // Determining the next stage by completing the previous stage forces sequential loading. Try using progress flags.
                    }
                );
            } catch (error) {
                props.setFileStatus({status: "Error", message: "Unexpected scene-loading issue. Check console.log for details."})
                console.error(error)
            }
            
        })
        .catch((error) => {
            props.setFileStatus({ status: "Error", message: "The file could not be retrieved from the server. Try refreshing or resubmitting." });
            console.error(error)
            socket.disconnect();
        });
    });

    socket.on("File missing", () => {
        console.log("File doesn't exist.");
        props.setFileStatus({ status: "Error", message: "The requested file doesn't exist or is of an invalid format. Try reselecting the file or resubmitting." });
        socket.disconnect();
    })

    socket.onAny((event, ...args) => {
        if (props.verbose) console.log("Received data through socket.");
        if (props.verbose) console.log(event, args);
    });

    socket.connect();
    if (props.verbose) console.log("Connected with socket.");
    props.setFileStatus({ status: "Contacting server", currentSocket: socket });
}