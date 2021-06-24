const express = require('express');
//const helmet = require('helmet')   
const app = express();
const serveIndex = require('serve-index');
const http = require('http')
const httpServer = http.createServer(app);
const fs = require('fs');
const { count } = require('console');
const { exec } = require('child_process');
const formidable = require('formidable');
const { Server } = require('socket.io');
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    },
});

const fileProcessor = require('./src/server_side/FileProcessor');
const formProcessor = require('./src/server_side/FormFileProcessor');


//app.use(helmet()); //adds security related HTTP headers

app.use(express.static(`${__dirname}/build`));
app.use(express.static(`${__dirname}/public`));

function walkDirectory(dir) {
    let myPromise = new Promise(function(myResolve, myReject) {
        let thisDirFiles = [];
        fs.readdir(dir,{withFileTypes: true}, async function(err, fileList) {
            if (err) {
                myReject(err);
            } else {
                for (let i = 0; i < fileList.length; i++) {
                    let item = fileList[i];
                    if (item.isDirectory()) {
                        //console.log("Adding dir  " + item.name);
                        try {
                            let subDirFiles = await walkDirectory(dir + "/" + item.name);
                            thisDirFiles.push({
                                name: item.name,
                                id: dir.substr(7) + "/" + item.name,
                                children:  subDirFiles
                            });
                        } catch (error) {
                            myReject(error);
                        }
                        //console.log("Finish dir  " + item.name);
                    } else {
                        //console.log("Adding file " + item.name);
                        thisDirFiles.push({
                            name: item.name,
                            id: dir.substr(7) + "/" + item.name
                        })
                    }
                }
                //console.log("Done with directory " + dir);
                myResolve(thisDirFiles);
            }
        })
    });
    return myPromise;
}

async function scanAllFiles() {
    return new Promise(async function (myResolve, myReject) {
        try {
            let returnedFiles = await walkDirectory(`./files`);
            console.log("Directory rescan requested at " + new Date().toUTCString());
            let fileListString = JSON.stringify(returnedFiles);
            fs.writeFileSync(`${__dirname}/fileList.json`, fileListString);

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
    console.log("Pull operation requested at " + new Date().toUTCString());
    exec("git pull > git.log && npm run build > build.log")
}

app.post("/api/post", (req, res) => {
    console.log("Received post request.");
    fileProcessor.processFile(req, (data) => {
        res.json({ message: data });
    });
});

app.post("/api/postform", (req, res) => {
    const storagePath = './files/user-uploads/';
    let currDate = new Date();
    const directoryName = `${currDate.getMonth()}_${currDate.getDate()}_${currDate.getHours()}_${currDate.getMinutes()}_${currDate.valueOf()}`;
    console.log("Received post request.");
    app.locals.currentFiles.set("filename", "Processing") // TODO: This should be a map from file identifier to file status, so we can tell whether we're still working with a file.  
    let onError = (message) => {
        // This should be either (a) sent as a response or (b) stored so that it responds to a later GET message.
        // My inspriation is Gradescope's system, where you upload a file and get taken to a submission viewing screen.
        console.log("An error occurred while trying to process your submission: " + message);
    };
    try {
        formProcessor.processFile(req, (data, metadata) => {
            fs.mkdir(storagePath + directoryName, {recursive: true}, (err) => {
                if (err) {
                    console.log("Error occured when trying to make new directory!")
                    //send update to any file listeners
                    return;
                }
                fs.writeFile(storagePath + directoryName + "/quaternion_data.dat", data, (err) => {
                    if (err) {
                        console.log(err);
                        //send update to any file listeners
                        return;
                    }
                    //send update to any file listeners
                })
                fs.writeFile(storagePath + directoryName + "/metadata.json", JSON.stringify(metadata), (err) => {
                    if (err) {
                        console.log(err);
                        // send update to any file listeners
                        // remove all files in the case of any error, using a cleanup() function
                        return;
                    }
                })
            })
        }, onError);
        // notify listeners that file is done, but do not send the resulting file--this isn't a GET request.
        // We may want to also do some basic validation, but that's handled during file processing.
        res.json({ status: "File received", fileName: directoryName });
    } catch (e) {
        console.log("Cancelled due to error. This should probably be reported to the user when they ask for the resource later.")
        console.error(e);
    }
    
})

function fileAvailable(targetFile) {
    let fileRoot = `${__dirname}/files/user-uploads`;
    let dataFilePath = `${fileRoot}/${targetFile}/quaternion_data.dat`;
    let metadataPath = `${fileRoot}/${targetFile}/metadata.json`;
    return (fs.existsSync(dataFilePath) && fs.existsSync(metadataPath));
}

app.get("/api/uploadedfiles", (req, res) => {
    // This doesn't really work since we need an asynchronous update from server to client when status changes.
    console.log("Received GET request for file.")
    let targetFile = req.query.file;
    console.log("Target file: " + targetFile);
    // Disregard access code for now
    // if ((app.locals.currentFiles.get(targetFile).accessCode !== req.query.accessCode)) {
    //     res.json({
    //         status: "Bad access code"
    //     });
    //     return;
    // }
    let fileRoot = `${__dirname}/files/user-uploads`;
    let filePath;
    switch (req.query.type) {
        case ('data'):
            filePath = `${fileRoot}/${targetFile}/quaternion_data.dat`
            break;
        case ('metadata'):
            filePath = `${fileRoot}/${targetFile}/metadata.json`
            break;
        default:
            res.sendStatus(400);
            // res.json({ status: "Invalid file type: should be 'data' or 'metadata'." });
            return;
    }
    console.log("File path: " + filePath);
    if (fs.existsSync(filePath)) {
        console.log("The file exists. Let's send it.");
        res.sendFile(filePath);
    } else {
        console.log("File was not found.");
        res.sendStatus(404);
        return;
    }
    // If the file is done processing and we're good, send the file.
    //  This includes progress reports based on file download status on the client. is that our job to manage?
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
                    console.log(error);
                }
            );
            break;
        case "get-file-list":
            res.sendFile(`${__dirname}/fileList.json`);
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
              console.log(err);
              res.send('upload failed')
         } else {
            let fileIds = Object.getOwnPropertyNames(files);
            for (let i = 0; i < fileIds.length; i++) {
                let fileId = fileIds[i];
                console.log(` >>> Attempting to obtain: "${files[fileId].name}" with params: ${fields[fileId + 'params']}`)
                var oldpath = files[fileId].path;
                var newpath = path + files[fileId].name;
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                });
            }
            console.log(`${fileIds.length} file(s) uploaded to the server at ${new Date().toUTCString()}`)
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

app.use('*',  (req, res)=> {
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
                        <a href='https://github.com/jpiland16/hmv_test#hmv_test---launch-website'>Contact the developers</a> if you believe this message is in error.
                    </body>
                  </html>`)
    }
});

io.use((socket, next) => {
    console.log("A new socket connection is going through middleware: " + socket)
    // need identication of some sort
    const name = socket.handshake.auth.username;
    if (!name) {
        console.log("The attempted socket didn't have a username. Aborting connection.");
        return next(new Error("A name is required to associate with this connection"));
    }
    socket.userName = name;
    next();
})

//Purely for debugging!
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Also for debugging: send timed response to client
async function executeDelayed(delayMillis, callback) {
    await sleep(delayMillis);
    callback();
}

io.on('connection', (socket) => {
    //when disconnecting, remove from map (and maybe even delete the associated file)
    socket.on('disconnect', (reason) => {
        console.log("Socket was disconnected. Removing them from listener map...");
        app.locals.fileListeners.delete(socket.handshake.query.file);
    })
    socket.on('Debug request', (info) => {
        console.log("Debug request: client wants message of type " + info.messageType);
        socket.emit(info.messageType, info.params);
    });
    console.log("A new socket connection just started up");
    console.log("Asking for file: " + socket.handshake.query.file);
    //use query to map filename to socket in app.locals.fileListeners
        // if no such file exists, send that information
    if (!app.locals.currentFiles.has(socket.handshake.query.file) && !fileAvailable(socket.handshake.query.file)) {
        console.log("The requested file does not exist. Time to notify the client.")
        socket.emit("File missing", null);
    }
    app.locals.fileListeners.set(socket.handshake.query.file, socket);
    //send current file status to socket
    executeDelayed(1000, () => {
        socket.emit('Processing data', {});
        executeDelayed(1000, () => {
            socket.emit('File ready', {});
        })
    })
    // await sleep(5000);
    // socket.emit("file status", { status: "Processing" });
        // if the status is final, there's no need for a listener relationship
})

scanAllFiles();

const PORT = process.env.PORT || 5000

// app.listen(PORT);
httpServer.listen(PORT, () => {
    console.log("Listening on port " + PORT + "...");
    app.locals.currentFiles = new Map();
    app.locals.currentFiles.set("placeholderfile", { status: "Processing", accessCode: "password" });
    
    app.locals.fileListeners = new Map();
})
