const express = require('express');
const helmet = require('helmet')   
const app = express();
const serveIndex = require('serve-index');
const https=require('https');
const fs = require('fs');
const { count } = require('console');
const { exec } = require('child_process');
const formidable = require('formidable');


app.use(helmet()); //adds security related HTTP headers

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


scanAllFiles();

const options = {
    cert: fs.readFileSync('./sslcert/fullchain.pem'),
    key: fs.readFileSync('./sslcert/privkey.pem')
};

// const PORT = process.env.PORT || 80


// app.listen(PORT);

https.createServer(options, app).listen(443);

//app.listen(443)