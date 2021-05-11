const express = require('express');
const app = express();
const serveIndex = require('serve-index');
const fs = require('fs');

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
    try {
        let returnedFiles = await walkDirectory(`./files`);
        console.log("Directory rescan requested at " + new Date().toUTCString());
        let fileListString = JSON.stringify(returnedFiles);
        fs.writeFileSync(`${__dirname}/fileList.json`, fileListString);
    } catch(error) {
        console.error("Promise rejected with error:");
        console.error(error);
    }
}

app.get("/api/*", (req, res) => {
    let requestedResource = req.url.substr(5);
    switch (requestedResource) {
        case "scan-all-files":
            res.sendFile(`${__dirname}/scanning.html`);
            scanAllFiles();
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

app.listen(80);