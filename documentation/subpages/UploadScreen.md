# Upload Screen [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/upload-screen/UploadScreen.js)

The upload screen is where users can upload datasets to the virtual machine. It consists of the following components:
### Title Bar [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/TitleBar.js)
The title bar provides quick links to the following pages:
- Getting Started Page [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/getting-started-screen/TutorialScreen.js) - explains how users can upload their own datasets
- Dataset Info Page [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/dataset-info-screen/DatasetInfoScreen.js) - provides information on preuploaded datasets and links back to their original sources
- Code Documentation - links back to this GitHub repo
- Contact Us [(view code)](https://github.com/jpiland16/hmv_test/blob/master/files/contact-form.html)- allows users to send developers emails (Add more thorough explanation of how this is working)
### Material Calibration Form [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/upload-screen/MaterialCalibrationForm.js)
The calibration form is where the user can upload their file and input relevent meta data. 

## Upload Process

The visualizer uses a standardized format of (w,x,y,z) quaternions to determine bone orientation. The following process determines these quaternions from the raw data.

The user sends the raw quaternion data (through the MaterialCalibationForm) to the server, alongside some metadata from the upload form describing the column number and data type corresponding to each sensor.

This takes the form of a POST request to `/api/postform` carrying a JS FormData object, which is JSON that can have a file as its value. `server.js` uses the [formidable](https://www.npmjs.com/package/formidable) library to separate the form data and the file before passing them to [FormFileProcessor.js](https://github.com/jpiland16/hmv_test/edit/master/documentation/subpages/FormFileProcessor.md) [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/server_side/FormFileProcessor.js), which calls [multi_sensor_fuser_obj.py](https://github.com/jpiland16/hmv_test/edit/master/documentation/subpages/MultiSensorFuserObj.md) [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/server_side/python_programs/multi_sensor_fuser_obj.py) and passes in the file data using its `stdin`. This Python program instantiates the appropriate `DatatypeHandler` for each sensor. After a [DatatypeHandler](https://github.com/jpiland16/hmv_test/edit/master/documentation/subpages/DatatypeHandler.md) converts the relevant columns to quaternions, the Python program returns the aggregate data, which is then combined with a JSON metadata file and stored in the `/files/user-uploads/` directory.
