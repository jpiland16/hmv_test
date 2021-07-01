const formidable = require('formidable');
const FileReader = require('filereader');
const { spawn } = require('child_process');

//Purely for debugging!
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Also for debugging: send timed response to client
async function executeDelayed(delayMillis, callback) {
    await sleep(delayMillis);
    callback();
}

const processFile = (form, callback, onError) => {
    console.log("Processing a file sent by a POST request in the Form processor.");
    const formParser = formidable({ maxFileSize: 50 * 1024 * 1024});
    try {
        formParser.on('error',  (err) => { 
            console.log("Formparser has encountered an error"); 
            console.log(err);
        });
        formParser.parse(form, (err, fields, files) => {
            console.log("Finished parsing the form!")
            handleForm(err, fields, files, (data, metadata) => callback(data, metadata), onError);
        });
    }
    catch (e) {
        console.log(e);
    }

};

function handleForm(err, fields, files, callback, onError) {
    console.log("Proceeded to handleForm function...");
    if (err) {
        console.log(err);
    }
    console.log(fields);
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        try {
            handleUploadedFile(event, fields, (data) => callback(data, parseFormFields(fields)), onError);
        } catch (e) {
            console.log("handleUploadedFile threw an error!");
            console.log(e);
        }
    });
    reader.addEventListener('error', (err) => {
        console.log(err);
    });
    try {
        reader.readAsText(files.file);
    } catch (e) {
        onError("Failed to read incoming file. We should probably notify the client.")
    }
}

function parseFormFields(fields) {
    metadata = {
        name: "Opportunity Dataset",
        displayName: fields.displayName,
        globalTransformQuaternion: {
            x: 0.7071,
            y: 0,
            z: 0,
            w: -0.7071
        },
        targets: []
    }
    let sensors = JSON.parse(fields.sensorData);
    console.log(sensors);
    for (let i = 0; i < sensors.length; i ++) {
        let sensor = sensors[i];
        metadata.targets.push({
            bone: sensor.bone,
            type: sensor.dataType,
            column: (i * 4) + 1,
            localTransformQuaternion: {
                x: 0.7071,
                y: 0.7071,
                z: 0,
                w: 0
            }
        });
    }
    return metadata;
}

function handleUploadedFile(event, fields, callback, onError) {
    let sensors = JSON.parse(fields.sensorData);
    console.log(sensors);
    let sensorColumns = [];
    for (let i = 0; i < sensors.length; i ++) {
        sensorColumns.push({ start_column: sensors[i].startColumn, data_type: sensors[i].dataType });
    }
    let pyStringParams = JSON.stringify(
        {
            sensor_columns: sensorColumns,
            time_column: fields.timeColumn
        }
    );
    console.log("Python string params: " + pyStringParams);
    // var pyProcess = spawn('python', ['pyprogs/testprog.py', pyStringParams], { cwd: process.cwd() + "\\src\\server_side"});
    var pyProcess = spawn('python', ['src/server_side/python_programs/multi_sensor_fuser_obj.py', pyStringParams]);
    console.log("Generated python process pid (greater than 0 on success): " + pyProcess.pid);
    console.log("Current path: " + process.cwd());
    var pyOutput = "";
    var errorOutput;
    pyProcess.stdout.on('data', (pyData) => {
        // console.log("Data from python file: " + pyData);
        let responseMessage = pyData.toString('utf8');
        pyOutput += responseMessage;
    });    
    pyProcess.stderr.on('data', (pyData) => {
        console.log("Error from python file: " + pyData);
        console.log("We should probably report this to the client somehow.");
        pyProcess.kill();
        errorOutput = pyData;
    });
    pyProcess.stdout.on('end', () => {
        if (errorOutput) {
            onError(errorOutput);
            return;
        }
        callback(pyOutput);
    })
    pyProcess.stdin.write(event.target.result);
    pyProcess.stdin.end();
}

exports.processFile = processFile;