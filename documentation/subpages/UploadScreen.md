[(Back to To TOC)](../TOC.md)
# Upload Screen 

The upload screen is where users can upload datasets to the virtual machine. It consists of the following components:
### [Title Bar](https://github.com/jpiland16/hmv_test/blob/master/documentation/TitleBar.md) [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/TitleBar.js)
### Upload Screen Component [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/upload-screen/UploadScreen.js)
The Upload Screen component acts a bridge connecting the two forms (File Info Form and Quaternion Calibration Form) that are needed to collect the necessary meta data for the file. It carries out the following roles:
- Provides the styling of the form container
- Contains the FormData object with the uploaded file and the relevent meta data
- Handles the submission of the form
- Returns a Stepper component that switches between the two forms

### File Info Form [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/upload-screen/FileInfoForm.js)
This is the first step of uploading process and allows the user to input the file, display name, time column, and sensor information for a dataset. When the 'Next' button is pressed, this meta data is appended to a FormData object 
and passed through props.formData back to the Upload Screen component.

### Quaternion Calibration Form [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/upload-screen/QuaternionCalibrationForm.js)
This is the second step of the uploading process and allows the user to set the local transformation quaternions for their dataset. Essentially, this means that the user must set the idenitity
or 'no rotation' position of the model. In terms of sensors, the 'no rotation' position is where the local coordinate system of each sensor is aligned with the global coordinate system. 
For example, if the x-axis of the sensor points down a persons arm, the model must be transformed so its arm is pointing down the global x-axis. 

The Quaternion Calibration component consist of a mannequin visualizer object and quaternion sliders for each bone listed in the props.sensorList (passed in the File Info Form). The quaternion sliders or dropdown menus can be used to set the transformation quaternion for each bone. 
When the 'Submit' button is pressed, props.sensorList is updated with the current transformation quaternions, and props.submit is set to true which triggers a useEffect submit function in the Upload Screen component. 

## Upload Process

The visualizer uses a standardized format of (w,x,y,z) quaternions to determine bone orientation. The following process determines these quaternions from the raw data.

When the 'Submit' button is pressed, the user sends the raw quaternion data from the Upload Screen component to the server, alongside some metadata from the upload form describing the column number and data type corresponding to each sensor.

This takes the form of a POST request to `/api/postform` carrying a JS FormData object, which is JSON that can have a file as its value. `server.js` uses the [formidable](https://www.npmjs.com/package/formidable) library to separate the form data and the file before passing them to [FormFileProcessor.js](https://github.com/jpiland16/hmv_test/blob/master/documentation/subpages/FormFileProcessor.md) [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/server_side/FormFileProcessor.js), which calls [multi_sensor_fuser_obj.py](https://github.com/jpiland16/hmv_test/blob/master/documentation/subpages/MultiSensorFuserObj.md) [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/server_side/python_programs/multi_sensor_fuser_obj.py) and passes in the file data using its `stdin`. This Python program instantiates the appropriate `DatatypeHandler` for each sensor. After a [DatatypeHandler](https://github.com/jpiland16/hmv_test/blob/master/documentation/subpages/DatatypeHandler.md) converts the relevant columns to quaternions, the Python program returns the aggregate data, which is then combined with a JSON metadata file and stored in the `/files/user-uploads/` directory.
