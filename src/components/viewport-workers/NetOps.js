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