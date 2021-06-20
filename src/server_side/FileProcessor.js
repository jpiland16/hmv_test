const formidable = require('formidable');
const FileReader = require('filereader');
const { spawn } = require('child_process');

const processFile = (form, callback) => {
    console.log("Processing a file sent by a POST request.");
    const formParser = formidable();
    formParser.parse(form, (err, fields, files) => {
        handleForm(err, fields, files, (data) => callback(data));
    });
};

function handleForm(err, fields, files, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        handleUploadedFile(event, fields, (data) => callback(data));
    });
    reader.readAsText(files.file);
}

function handleUploadedFile(event, fields, callback) {
    console.log("File contents: " + event.target.result);
    let pyStringParams = JSON.stringify(
        { 
            param: fields.params,
            start_column: fields.start_column,
            time_column: fields.time_column
        }
    );
    console.log("Python string params: " + pyStringParams);
    // var pyProcess = spawn('python', ['pyprogs/testprog.py', pyStringParams], { cwd: process.cwd() + "\\src\\server_side"});
    var pyProcess = spawn('python', ['src/server_side/python_programs/sensor_fuser.py', pyStringParams]);
    console.log("Generated python process pid: " + pyProcess.pid);
    console.log("Current path: " + process.cwd());
    var pyOutput = "";
    pyProcess.stdout.on('data', (pyData) => {
        console.log("Data from python file: " + pyData);
        let responseMessage = pyData.toString('utf8');
        pyOutput += responseMessage;
    });    
    pyProcess.stderr.on('data', (pyData) => {
        console.log("Error from python file: " + pyData);
    });
    pyProcess.stdout.on('close', () => {
        console.log("Python process stdout closed.");
    })
    pyProcess.stdout.on('end', () => {
        // console.log(pyProcess.stdout);
        console.log("Sending data back from server side: " + pyOutput);
        callback(pyOutput);
    })
    pyProcess.stdin.write(event.target.result);
    pyProcess.stdin.end();
}

exports.processFile = processFile;