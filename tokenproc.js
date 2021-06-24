const fs = require('fs');
const { get } = require('https');

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

function getPrivateFiles(token) {
    dir = "./private/" + token
    return new Promise((myResolve, myReject) => {
        fs.readdir(dir,{withFileTypes: true}, async function(err, fileList) {
            thisDirFiles = []
            if (err) {
                myReject(err);
            } else {
                for (let i = 0; i < fileList.length; i++) {
                    let item = fileList[i];
                    thisDirFiles.push({
                        name: item.name,
                        id: dir.substring(2) + "/" + item.name
                    })
                }
                myResolve(thisDirFiles);
            }
        })
    });
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