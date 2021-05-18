const express = require('express');
const app = express();
const serveIndex = require('serve-index');
const fs = require('fs');
const { count } = require('console');

function walkDirectory(dir) {
    let myPromise = new Promise(function(myResolve, myReject) {
        let thisDirFiles = [];
        fs.readdir(dir,{withFileTypes: true}, async function(err, fileList) {
            if (err) {
                myReject(error);
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
        default:
            res.send("Unexpected resource requested: " + requestedResource);
    
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
    res.sendFile("/build/index.html", {
        "root": __dirname
    });
});

const PORT = process.env.PORT || 80

app.listen(PORT);