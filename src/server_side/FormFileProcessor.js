const FileReader = require('filereader');
const { spawn } = require('child_process');

const VERBOSE_OUTPUT = true

function handleForm(err, fields, files, callback, onError) {
    if (VERBOSE_OUTPUT) console.log("Proceeded to handleForm function...");
    if (err) {
        if (VERBOSE_OUTPUT) console.log(err);
    }
    if (VERBOSE_OUTPUT) console.log(fields);
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        try {
            handleUploadedFile(event, fields, (data) => callback(data, parseFormFields(fields)), onError);
        } catch (e) {
            if (VERBOSE_OUTPUT) console.log("handleUploadedFile threw an error!");
            if (VERBOSE_OUTPUT) console.log(e);
        }
    });
    reader.addEventListener('error', (err) => {
        if (VERBOSE_OUTPUT) console.log(err);
    });
    try {
        reader.readAsText(files.file);
    } catch (e) {
        onError(e);
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
    if (VERBOSE_OUTPUT) console.log(sensors);
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
    if (VERBOSE_OUTPUT) console.log(sensors);
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
    if (VERBOSE_OUTPUT) console.log("Python string params: " + pyStringParams);
    var pyProcess = spawn('python', ['src/server_side/python_programs/multi_sensor_fuser_obj.py', pyStringParams]);
    if (VERBOSE_OUTPUT) console.log("Generated python process pid (greater than 0 on success): " + pyProcess.pid);
    if (VERBOSE_OUTPUT) console.log("Current path: " + process.cwd());
    var pyOutput = "";
    var errorOutput;
    pyProcess.stdout.on('data', (pyData) => {
        // if (VERBOSE_OUTPUT) console.log("Data from python file: " + pyData);
        let responseMessage = pyData.toString('utf8');
        pyOutput += responseMessage;
    });    
    pyProcess.stderr.on('data', (pyData) => {
        if (VERBOSE_OUTPUT) console.log("Error from python file: " + pyData);
        if (VERBOSE_OUTPUT) console.log("We should probably report this to the client somehow.");
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

/**
 * Handles translating incoming an user `FormData` into data and metadata which
 * can be stored for delivery to clients. 
 * @param {Object} fields An Object containing the non-file data submitted by a user 
 * through the upload form.
 * @param {string} fields.sensorData Stringified JSON representing the parameters
 * of the individual sensors used to collect the incoming data. The result should
 * be a list of Objects with the following properties:
 * @param {number} fields.sensorData[].startColumn The column index (starting at 0) of the sensor's data in the
 * incoming file.
 * @param {number} fields.sensorData[].dataType A String describing the way the file data will be interpreted
 * for this sensor.
 * @param {number} fields.timeColumn The column index of the column in the data file
 * where the timestamp for the row's data is stored (in milliseconds).
 * @param {Object} files The containing object for the incoming data file
 * @param files.file The file object which can be read as text using a `FileReader`.
 * @returns {Promise} A Promise which resolves with an Object containing the 
 * file data and metadata in its `data` and `metadata` fields, or an error message
 * upon rejection.
 */
const processDownloadedForm = (fields, files) => {
    return new Promise((resolve, reject) => {
        if (VERBOSE_OUTPUT) console.log("Processing a downloaded form in the Form processor.");
        handleForm(null, fields, files, (data, metadata) => resolve({ data: data, metadata: metadata }), (errMessage) => reject(errMessage));
    });
};

exports.processDownloadedForm = processDownloadedForm;