const express = require('express');
//const helmet = require('helmet')   
const app = express();
const serveIndex = require('serve-index');
const https=require('https');
const fs = require('fs');
const { exec } = require('child_process');
const formidable = require('formidable');
const { onContactUs } = require('./sendEmail')
const { generateToken, getFilesWithPrivate, walkDirectory } = require('./files-help')


//app.use(helmet()); //adds security related HTTP headers

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

app.get("/api/get-file-list", (req, res, next) => {
    tokenIndex = req.url.indexOf("token=")
    if (tokenIndex > -1) {
        token = req.url.substr(tokenIndex + 6)
        getFilesWithPrivate(token).then((files) => {
            res.send(JSON.stringify(files))
        }, (err) => res.sendFile(`${__dirname}/fileList.json`))
    } else {
        next()
    }
});

app.get("/api/generate-token", (req, res) => {
    generateToken(64).then((token) => res.send(token));
})

app.get("/api/*", (req, res) => {
    let requestedResource = req.url.substr(5);
    switch (requestedResource) {
        case "scan-all-files":
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
            console.log(`Unknown request: ${requestedResource}`)
    }
});

app.post('/api/pull', (req, res) => {
    res.sendStatus(200);
    onProjectUpdate();
});


app.post('/api/send-message', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.error("There was an error receiving the message. Check log for details.")
            console.log(err);
            res.status(503).send('message not received');
        } else {
            message = fields.message
            email = fields.email
            onContactUs(email, message)
            res.status(200).send('message received')
        }
    })
});

app.post('/api/upload-file', (req, res) => {
    // See https://stackoverflow.com/questions/60107387/nodejs-express-file-upload-with-xmlhttprequest-not-working
    const path = './privt/private-uploads';

    var form = new formidable.IncomingForm();
    form.uploadDir = path;
    form.encoding = 'binary';

    form.parse(req, function(err, fields, files) {
         if (err) {
              console.log(err);
              res.send('upload failed')
         } else {

            if (!fs.existsSync(path + "/" + fields["token"])) {
                fs.mkdirSync(path + "/" + fields["token"])
            }

            let fileIds = Object.getOwnPropertyNames(files);
            for (let i = 0; i < fileIds.length; i++) {
                let fileId = fileIds[i];
                console.log(` >>> Attempting to obtain: "${files[fileId].name}" with params: ${fields[fileId + 'params']}`)
                var oldpath = files[fileId].path;
                var newpath = path + "/" + fields["token"] + "/" + files[fileId].name;
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                });
            }
            console.log(`${fileIds.length} file(s) uploaded to the server at ${new Date().toUTCString()}`)
            res.send('complete').end();
         }
    });
});

app.get('/files/private-uploads/*', (req, res) => {
    let path = decodeURI(req.url.substr(7));
    let fileRoot = `${__dirname}/privt`;
    if (fs.existsSync(fileRoot + "/" + path)) {
        // Have to watch out for index.html here, hence the check to make sure path is not a directory
        if (fs.lstatSync(fileRoot + "/" + path).isDirectory()) {
            res.status(403).send("Access Denied");
        } else {
            res.sendFile(path, {root: fileRoot});
        }
    } else {
        res.send(`File or directory "${path}" not found!`);
    }
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

app.use(express.static(`${__dirname}/build`));

app.use('*',  (req, res)=> {
    if (fs.existsSync("./build/index.html")) {
        res.sendFile("/build/index.html", {
            "root": __dirname
        });
    } else {
        sendMaintenancePage(res)
    }
});

function sendMaintenancePage(res) {
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

scanAllFiles();

const options = {
    cert: fs.readFileSync('./sslcert/fullchain.pem'),
    key: fs.readFileSync('./sslcert/privkey.pem')
};

https.createServer(options, app).listen(443);

// Redirect from http port 80 to https
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);