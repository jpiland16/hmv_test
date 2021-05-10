const express = require('express');
const app = express();
const serveIndex = require('serve-index');
const fs = require('fs');

app.get("/api/*", (req, res) => {
    res.send("Resource requested: " + req.url.substr(5));
})

app.use('/files', serveIndex(__dirname + '/files', {
    stylesheet: "directory-style.css",
    template: "directory-template.html",
    icons: true
}));

app.get('/files/*', (req, res) => {
    let path = req.url.substr(7);
    let fileRoot = `${__dirname}/files`;
    if (fs.existsSync(fileRoot + "/" + path)) {
        res.sendFile(path, {root: fileRoot});
    } else {
        res.send(`File or directory "${path}" not found!`);
    }
});

app.use(express.static(`${__dirname}/build`));

app.use('*',  (req, res)=> {
    console.log(req.url)
    res.sendFile("/build/index.html", {
        "root": __dirname
    });
});

app.listen(80);