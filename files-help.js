const fs = require('fs');

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

function generateToken(size) {
    return new Promise((myResolve, myReject) => {
        token = [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        checkTokenExists(token).then((exists) => {
            if (exists) {
                generateToken(size).then((token) => {
                    myResolve(token)
                })
            } else {
                myResolve(token)
            }
        })
    });
}

function checkTokenExists(token) {
    return new Promise(function(myResolve, myReject) {
        fs.readdir("./private", {withFileTypes: true}, async function(err, fileList) {
            if (err) {
                myReject(err)
            } else {
                for (let i = 0; i < fileList.length; i++) {
                    let item = fileList[i];
                    if (item.isDirectory()) {
                        if (item.name == token) {
                            myResolve(true)
                        }
                    }
                }
                myResolve(false)
            }
        });
    });
}

async function getPrivateFiles(token) {
    dir = "./privt/private-uploads/" + token
    let privateFiles = await walkDirectory(dir);
    return privateFiles;
}

function getFilesWithPrivate(token) {
    return new Promise((myResolve, myReject) => {
        files = JSON.parse(fs.readFileSync('./fileList.json'))
        getPrivateFiles(token).then((privateFiles) => {
            files.push({
                name: "private-uploads",
                id: "/private-uploads",
                children: privateFiles
            })
            myResolve(files)
        }, (err) => myReject(err));
    });
}

exports.generateToken = generateToken
exports.getFilesWithPrivate = getFilesWithPrivate
exports.walkDirectory = walkDirectory