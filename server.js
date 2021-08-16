const express = require('express');
const app = express();
const serveIndex = require('serve-index');
const https=require('https');
const fs = require('fs');
const { exec } = require('child_process');
const formidable = require('formidable');
const { Server } = require('socket.io');

var onContactUs = null;
let contactModulePath = __dirname+'/sendEmail.js';
if (fs.existsSync(contactModulePath)) {
    const { onContactUs: contactUsFunction } = require('./sendEmail')
    onContactUs = contactUsFunction;
}

const options = { //fullchain and privkey are used for the vm and server-crt and server-key are used locally
    cert: fs.existsSync('./sslcert/fullchain.pem') ? fs.readFileSync('./sslcert/fullchain.pem') : fs.readFileSync('./sslcert/server-crt.pem'),
    key: fs.existsSync('./sslcert/privkey.pem') ? fs.readFileSync('./sslcert/privkey.pem') : fs.readFileSync('./sslcert/server-key.pem')
};

const HTTPS_PORT = process.env.PORT || 443;

const httpsServer = https.createServer(options, app);

const io = new Server(httpsServer);

const formProcessor = require('./src/server_side/FormFileProcessor');

const VERBOSE_OUTPUT = process.argv[2] && process.argv[2] === 'verbose';

/**
 * Asynchronously and returns the display name from the metadata file at the given filepath.
 * @param {String} filepath The directory containing the metadata file which has the desired display name.
 * @returns A Promise that resolves to the display name for the data file. Resolves to 'null' for directories and
 * rejects if the associated metadata.json file can't be parsed.
 */
function getFileDisplayName(filepath) {
    return new Promise((myResolve, myReject) => {
       fs.readFile(filepath+'/metadata.json', 'utf8', (err, jsonString) => {
            if (err) {
                myResolve(null);
                return;
            }
            try {
                let displayName = JSON.parse(jsonString).displayName;
                myResolve(displayName? displayName : null);
            } catch (err) {
                myReject(err);
            }
        }) 
    })
    
}

/**
 * Checks the target filepath to see if the directory should be displayed to the user.
 * Note that this does NOT check recursively, so a directory containing an invalid directory
 * will be shown to the user.
 * @param {String} dir The filepath from the project root of the target directory.
 * @returns A Promise that resolves to true if the filepath leads to a directory that should
 * be shown to the client, and resolves to false otherwise.
 */
function isValidDir(dir) {
    return new Promise((myResolve, myReject) => {
        fs.readdir(dir, { withFileTypes: true }, (err, dirChildren) => {
            if (err) {
                myResolve(false);
                return;
            }
            let foundData, foundMetadata, containsFolder;
            foundData = foundMetadata = containsFolder = false;
            for (let file of dirChildren) {
                containsFolder = containsFolder || file.isDirectory();
                foundData = foundData || file.name === 'quaternion_data.dat';
                foundMetadata = foundMetadata || file.name === 'metadata.json';
            }
            myResolve(containsFolder || (foundData && foundMetadata));
        })
    })
    
    
}

/**
 * Asynchronously creates a nested JS object matching the file structure of the given directory,
 * subdirectories are only added to the file tree if (1) they contain a `metadata.json` file or 
 * (2) one of their children has already been added to the file tree.
 * Does not include the parameter directory. 
 * @example 
 * 
 *    Returns [{
 *      name: child1, 
 *      id: child1,
 *      children: [{
 *          name: original-filename.dat, 
 *          id: child1/original-filename.dat}
 *    ]}, {
 *      name: child2, 
 *      id: child2, 
 *      children: [{
 *          name: foo, 
 *          id: child2/grandchild
 *          children: [{
 *              name: bar.dat,
 *              id: child2/grandchild/bar.dat
 *          }]
 *      }]
 *    }]
 * 
 *    for the following file structure:
 * 
 *    parent
 *    |-- child1
 *    |    `-- metadata.json (contains no "displayName:" field)
 *    |    `-- original-filename.dat
 *    `-- child2
 *         `-- grandchild
 *             |-- metadata.json (contains "displayName": "foo")
 *             `-- bar.dat
 * getDirStructure("parent", false)
 * @param {String} dir The name of the directory to encode.
 * @param {String} displayDirname The prefix to the filename in the ID field for each subdirectory.
 * @returns Returns JS object matching the directory structure of dir.
 */
 function getDirStructure(dir, displayDirname) {
    return new Promise((myResolve, myReject) => {
        let thisDirElements = [];
        fs.readdir(dir, {withFileTypes: true}, (err, fileList) => {
            if (err) {
                myReject(err);
                return; 
            }
            let promises = [];

            // First check if there is a metadata file
            let containsMetadata = false;
            fileList.forEach((file) => {
                if (!file.isDirectory() && file.name == "metadata.json")
                    containsMetadata = true;
            })
            
            // Then actually go through the folder's items
            fileList.forEach((file) => {
                if (file.isDirectory()) {
                    let dirObj = {
                        name: null,
                        id: displayDirname + '/' + file.name,
                        children: null,
                    }
                    let dirStructPromise = getDirStructure(dir+'/'+file.name, displayDirname+'/'+file.name);
                    dirStructPromise.then((subDirElements) => {
                        if (subDirElements.length > 0) {
                            dirObj.children = subDirElements;
                            thisDirElements.push(dirObj)
                        }
                    });
                    let displayNamePromise = getFileDisplayName(dir+'/'+file.name);
                    displayNamePromise.then((displayName) => {
                        dirObj.name = (displayName === null) ? file.name : displayName;
                    });
                    promises.push(dirStructPromise, displayNamePromise);
                } else {
                    // Not a directory
                    if (containsMetadata) {
                        if (file.name !== "metadata.json") {
                            thisDirElements.push({
                                name: file.name,
                                id: displayDirname + '/' + file.name,
                                children: null,
                            })
                        }
                    }
                }
            });
            Promise.all(promises).then(() => {
                myResolve(thisDirElements);
            });
        });
    });
}

/**
 * Writes a nested list of all current directories in ./files/ to ./fileList.json. Writes relevant info
 * for displaying possible dataset selections and their display names.
 * @returns A Promise that resolves when the file is written and rejects in the case of a file writing error.
 */
async function scanAllFiles() {
    return new Promise(async function (myResolve, myReject) {
        try {
            let returnedFiles = await getDirStructure(`./files`, '');
            // TODO: Add currently processing files to this list.
            // How? find out which child of returnedFiles is user-uploads
            // push every entry of the filesInProgress map to its child list
            console.log("Directory rescan requested at " + new Date().toUTCString());
            let fileListString = JSON.stringify(returnedFiles);
            fs.writeFileSync(`${__dirname}/fileList.json`, fileListString); // Can be async without causing any problems

            myResolve(returnedFiles);
        } catch(error) {
            console.error("Promise rejected with error:");
            console.error(error);
            myReject(error);
        }
    });
}

function countItems(root) {
    if (!root.children) return [1, 1]; // [ Total items, files ]
    let allItemCount = 1; // Including self
    let leafCount = 0;
    for (let i = 0; i < root.children.length; i++) {
        let childCount = countItems(root.children[i]);
        allItemCount += childCount[0];
        leafCount += childCount[1];
    }
    return [allItemCount, leafCount]
}

function onProjectUpdate() {
    if (VERBOSE_OUTPUT) console.log("Pull operation requested at " + new Date().toUTCString());
    exec("git pull > git.log && npm run build > build.log")
}

function writeFilePromise(filePath, data) {
    return new Promise((myResolve, myReject) => {
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                myReject(err);
                return;
            }
            myResolve();
        });
    });
}

function handleFormUpload(req, res) {
    const storagePath = './files/user-uploads/';

    let currDate = new Date();
    const directoryName = `${currDate.getMonth()}_${currDate.getDate()}_${currDate.getHours()}_${currDate.getMinutes()}_${currDate.valueOf()}`;
    let fullPath = storagePath + directoryName;

    if (VERBOSE_OUTPUT) console.log("Received post request.");
    app.locals.currentFiles.set(fullPath.substr('./files'.length), { status: "Processing" });
    if (VERBOSE_OUTPUT) console.log("Updated file status. Printing full file status list: ");
    if (VERBOSE_OUTPUT) console.log(app.locals.currentFiles); 

    formidable().parse(req, (err, fields, files) => {
        if (err) {
            if (VERBOSE_OUTPUT) console.log(err);
            return;
        }
        if (VERBOSE_OUTPUT) console.log("Finished grabbing the files from the user upload.");
        res.json({ status: "File received", fileName: directoryName });
        formProcessor.processDownloadedForm(fields, files)
        .then(({ data: data, metadata: metadata}) => {
            if (VERBOSE_OUTPUT) console.log(`Completely done processing ${fullPath}. Now we just have to write the resulting data.`);
            writeUploadedFile(data, metadata, fullPath)
            .then(() => {
                notifySocketListeners(fullPath, 'File ready');
            })
            .catch((err) => {
                if (VERBOSE_OUTPUT) console.log("Some kind of error happened that we need to communicate to the client: " + err);
                app.locals.currentFiles.delete(fullPath.substr('./files'.length));
                notifySocketListeners(fullPath, 'File missing'); // TODO: Make another signal for when the file isn't "missing" but had an error
            });
        })
        .catch((errMessage) => {
            if (VERBOSE_OUTPUT) console.log("Received error from form processor: ")
            if (VERBOSE_OUTPUT) console.log(errMessage);
            app.locals.currentFiles.delete(fullPath.substr('./files'.length));
            notifySocketListeners(fullPath, 'File missing'); // TODO: Make another signal for when the file isn't "missing" but had an error
        })
    });
}

function notifySocketListeners(fullPath, message) {
    let mappedPath = fullPath.substr('./files'.length);
    if (app.locals.fileListeners.has(mappedPath)) {
        app.locals.fileListeners.get(mappedPath).forEach((socket) => socket.emit(message));
    }
}

function writeUploadedFile(data, metadata, filepath) {
    return new Promise((myResolve, myReject) => {
        fs.mkdir(filepath, {recursive: true}, (err) => {
            if (err) {
                if (VERBOSE_OUTPUT) console.log("Error occurred when trying to make new directory!")
                myReject(err); // If I handle this somehow, then this can just return Promise.all below instead
                return;
            }
            let dataPromise = writeFilePromise(filepath + "/quaternion_data.dat", data);
            let metaPromise = writeFilePromise(filepath + "/metadata.json", JSON.stringify(metadata));
            if (VERBOSE_OUTPUT) console.log("About to print fileListeners:");
            if (VERBOSE_OUTPUT) console.log(app.locals.fileListeners);
            Promise.all([dataPromise, metaPromise]).then(() => {
                scanAllFiles().then(() => {
                    myResolve();
                });
            })
            .catch((err) => myReject(err));
        });
    })
    
}

app.post("/api/postform", (req, res) => {
    // handleFormUpload(req, res);
    handleFormUpload(req, res);
})

app.post('/api/send-message', (req, res) => {
    if (onContactUs === null) {
        res.status(503).send('server unable to forward message');
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.error("There was an error receiving the message. Check log for details.")
            if (VERBOSE_OUTPUT) console.log(err);
            res.status(503).send('message not received');
        } else {
            message = fields.message
            email = fields.email
            onContactUs(email, message).then(
                (response) => {
                    if (response.status == 200) {
                        res.status(200).send('message sent')
                    } else {
                        res.status(500).send('sending unsuccessful')
                    }
                },
                (error) => {
                    res.status(500).send(error.message)
                }
            )
        }
    })
});

// Deals with the strange arrangement Sam needs to fix with the way
// file IDs are assigned by the getDirStructure function, where every
// file ID starts with "./files/". Should be removed soon.
function cleanFilename(targetFile) {
    if (targetFile.substr(0,8) === './files/') {
        return targetFile.substr(8);
    }
    return targetFile;
}


// Remove the file name and replace it with `metadata.json`
function getMetadataPath(originalPath) {
    return originalPath.substr(0, originalPath.lastIndexOf("/") + 1) + "metadata.json"
}

function fileAvailable(targetFile) {
    targetFile = cleanFilename(targetFile);
    let fileRoot = `${__dirname}/files`;
    if (VERBOSE_OUTPUT) console.log("File root: " + fileRoot);
    let dataFilePath = `${fileRoot}/${targetFile}`;
    let metadataPath = `${fileRoot}/${getMetadataPath(targetFile)}`
    if (VERBOSE_OUTPUT) console.log(`Checking for available files: ${dataFilePath}, ${metadataPath}`);
    return (fs.existsSync(dataFilePath) && fs.existsSync(metadataPath));
}

app.get("/api/uploadedfiles", (req, res) => {
    // This doesn't really work since we need an asynchronous update from server to client when status changes.
    if (VERBOSE_OUTPUT) console.log("Received GET request for file.")
    let targetFile = req.query.file;
    if (VERBOSE_OUTPUT) console.log("Target file: " + targetFile);
    targetFile = cleanFilename(targetFile);
    if (VERBOSE_OUTPUT) console.log("Target file after cleaning: " + targetFile);
    // Disregard access code for now
    // if ((app.locals.currentFiles.get(targetFile).accessCode !== req.query.accessCode)) {
    //     res.json({
    //         status: "Bad access code"
    //     });
    //     return;
    // }
    let fileRoot = `${__dirname}/files/`;
    let filePath;
    switch (req.query.type) {
        case ('data'):
            filePath = `${fileRoot}/${targetFile}`
            break;
        case ('metadata'):
            filePath = `${fileRoot}/${getMetadataPath(targetFile)}`
            break;
        default:
            res.sendStatus(400);
            // res.json({ status: "Invalid file type: should be 'data' or 'metadata'." });
            return;
    }
    if (VERBOSE_OUTPUT) console.log("File path: " + filePath);
    if (fs.existsSync(filePath)) {
        if (VERBOSE_OUTPUT) console.log("The file exists. Let's send it.");
        res.sendFile(filePath);
    } else {
        if (VERBOSE_OUTPUT) console.log("File was not found.");
        res.sendStatus(404);
        return;
    }
    // If the file is done processing and we're good, send the file.
    // This includes progress reports based on file download status on the client. is that our job to manage?
    // If the file is still processing, send a progress report. And then somehow also send the file?
    // If the file encountered an error, send the error.
});

app.get("/api/*", (req, res) => {
    let requestedResource = req.url.substr(5);
    switch (requestedResource) {
        case "scan-all-files":
            //res.sendFile(`${__dirname}/scanning.html`);
            let d = new Date();
            scanAllFiles().then((files) => {
                    const [ totalCount, fileCount ] = countItems({ children: files });
                    let time = new Date() - d;
                    res.send(`<html>
                                <head>
                                    <title>Directory Scan</title> 
                                </head>
                                <body style="font-size: 24px">
                                    Scan complete. ${totalCount - 1} items found (${fileCount} files). 
                                    Completed in ${time} ms. <a href="/">Return to the home page.</a>
                                </body>
                            </html>
                            `)
                }, (error) => {
                    if (VERBOSE_OUTPUT) console.log(error);
                }
            );
            break;
        case "get-file-list":
            res.sendFile(`${__dirname}/fileList.json`)
            break;
        case "pull":
            res.send("POST request expected.");
            // res.send("Initiating website rebuild...");
            // onProjectUpdate();
            break;
        default:
            res.send("Unexpected resource requested: " + requestedResource);
    
    }
});

app.post('/api/pull', (req, res) => {
    res.sendStatus(200);
    onProjectUpdate();
});

app.post('/api/upload-file', (req, res) => {
    // See https://stackoverflow.com/questions/60107387/nodejs-express-file-upload-with-xmlhttprequest-not-working
    const path = './files/user-uploads/';

    var form = new formidable.IncomingForm();
    form.uploadDir = path;
    form.encoding = 'binary';

    form.parse(req, function(err, fields, files) {
         if (err) {
              if (VERBOSE_OUTPUT) console.log(err);
              res.send('upload failed')
         } else {
            let fileIds = Object.getOwnPropertyNames(files);
            for (let i = 0; i < fileIds.length; i++) {
                let fileId = fileIds[i];
                if (VERBOSE_OUTPUT) console.log(` >>> Attempting to obtain: "${files[fileId].name}" with params: ${fields[fileId + 'params']}`)
                var oldpath = files[fileId].path;
                var newpath = path + files[fileId].name;
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                });
            }
            if (VERBOSE_OUTPUT) console.log(`${fileIds.length} file(s) uploaded to the server at ${new Date().toUTCString()}`)
            res.send('complete').end();
         }
    });
});

app.use('/files', serveIndex(__dirname + '/files', {
    stylesheet: "directory-style.css",
    template: "directory-template.html",
    icons: true
}));

app.get('/files/*', (req, res) => {
    let path = decodeURI(req.url.substr(7));
    let fileRoot = `${__dirname}/files`;
    if (fs.existsSync(fileRoot + "/" + path)) {
        res.sendFile(path, {root: fileRoot});
    } else {
        res.send(`File or directory "${path}" not found!`);
    }
});

app.get('/jsdoc/*', (req, res) => {
    let path = decodeURI(req.url.substr(7));
    let fileRoot = `${__dirname}/jsdoc`;
    if (fs.existsSync(fileRoot + "/" + path)) {
        res.sendFile(path, {root: fileRoot});
    } else {
        res.send(`File or directory "${path}" not found!`);
    }
});

app.get('/.well-known/*', (req, res) => {
    let path = req.url;
    let fileRoot = `${__dirname}/public`;
    if (fs.existsSync(fileRoot + "/" + path)) {
        res.sendFile(path, {root: fileRoot});
    } else {
        res.send(`File or directory "${path}" not found!`);
    }
});

app.use(express.static(`${__dirname}/build`));

app.get('/*',  (req, res)=> {
    if (VERBOSE_OUTPUT) console.log("Got a GET request that made it through the router. URL: ");
    if (VERBOSE_OUTPUT) console.log(req.url);
    if (VERBOSE_OUTPUT) console.log(req.path);
    if (fs.existsSync("./build/index.html")) {
        res.sendFile("/build/index.html", {
            "root": __dirname
        });
    } else {
        res.send(`<html>
                    <head>
                        <title>
                            Wesite under maintenance
                        </title>
                    </head>
                    <body>
                        The website is currently being rebuilt. Please refresh the page in 1-2 minutes.
                        <a href='/files/contact-form.html'>Contact the developers</a> if you believe this message is in error.
                    </body>
                  </html>`)
    }
});



io.use((socket, next) => {
    if (VERBOSE_OUTPUT) console.log("A new socket connection is going through middleware: " + socket)
    // // need identication of some sort
    // const name = socket.handshake.auth.username;
    // if (!name) {
    //     if (VERBOSE_OUTPUT) console.log("The attempted socket didn't have a username. Aborting connection.");
    //     return next(new Error("A name is required to associate with this connection"));
    // }
    // socket.userName = name;  
    next();
})

io.on('connection', (socket) => {
    if (VERBOSE_OUTPUT) console.log("A new socket connection just started.");
    let targetFile = socket.handshake.query.file;
    //when disconnecting, remove from map (and maybe even delete the associated file)
    socket.on('disconnect', (reason) => {
        if (VERBOSE_OUTPUT) console.log("Socket was disconnected. Removing them from listener map...");
        if (!app.locals.fileListeners.has(targetFile)) { return; }
        let removeIndex = app.locals.fileListeners.get(targetFile).indexOf(socket);
        if (removeIndex != -1) {
            app.locals.fileListeners.get(targetFile).splice(removeIndex, 1);
        }
    })
    socket.on('Debug request', (info) => {
        if (VERBOSE_OUTPUT) console.log("Debug request: client wants message of type " + info.messageType);
        socket.emit(info.messageType, info.params);
    });
    if (VERBOSE_OUTPUT) console.log("Asking for file: " + targetFile);
    // TODO: Make this logic more readable by method extraction, so it looks like:
    //  if file is available:
    //      say that file is ready, terminate
    //  if file doesn't exist:
    //      say that file doesn't exist, terminate
    //  add socket to listeners for target file
    //  say the current status of the file, terminate
    if (fileAvailable(targetFile)) {
        socket.emit('File ready');
        return;
    }
    if (!app.locals.currentFiles.has(targetFile)) {
        if (VERBOSE_OUTPUT) console.log("The requested file does not exist. Time to notify the client.")
        socket.emit("File missing", null);
        return;
    }
    if (!app.locals.fileListeners.has(targetFile)) {
        app.locals.fileListeners.set(targetFile, []);
    }
    app.locals.fileListeners.get(targetFile).push(socket);
    if (VERBOSE_OUTPUT) console.log("Requested file: " + targetFile);
    if (VERBOSE_OUTPUT) console.log("Printing full file status list that we're about to access: ");
    if (VERBOSE_OUTPUT) console.log(app.locals.currentFiles); 
    switch (app.locals.currentFiles.get(targetFile).status) {
        case "Processing":
            socket.emit('Processing data');
            return;
        default:
            if (VERBOSE_OUTPUT) console.log(`The client's target file has an invalid status: ${app.locals.currentFiles.get(targetFile).status}. We should notify them`);
            return;
    }
})

scanAllFiles();

httpsServer.listen(HTTPS_PORT, () => {
    console.log("Listening on port " + HTTPS_PORT + "...");
    app.locals.currentFiles = new Map();
    app.locals.fileListeners = new Map();
});

// Redirect from http port 80 to https
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);