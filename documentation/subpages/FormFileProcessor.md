[(Back to To TOC)](../TOC.md)
# Form File Procesor [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/server_side/FormFileProcessor.js)

This file is the server-side counterpart to the client-side upload form. It is in charge of taking the incoming `FormData` object containing the form fields and uploaded files from the user's program and translating them into a 2D array of quaternions and associated metadata for use in the Viewport.

Since the user can upload arbitrarily large files, this is where the bulk of the processing should take place, so it uses the `Promise` API to resolve asynchronously whenever it's done. It should also be able to handle pretty much any input without a crash, since the server could receive any sort of nonsense data in a POST request and should never crash.

The Form File Processor is responsible for knowing the format of metadata files, since the JS Object it returns in its callback is directly transcribed into the `metadata.json` file accompanying each viewable data file. One current definitive prototype for the metadata files is [stored in the repo](https://github.com/jpiland16/hmv_test/blob/master/files/demo/demo-anyname/metadata.json). The Form File Processor is *not* responsible for knowing anything about how the files or stored--that is handled by the caller, `server.js`.

## Multi Sensor Fuser [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/server_side/python_programs/multi_sensor_fuser_obj.py)
The Form File Processor serves as the interface between the Node.js server code and the Python code (all in the `python_programs/` directory) that is used to actually process the data. In fact, the main motivation for having any server-side processing is that the server can execute any sort of code without having to deal with browser app limitations, which lets us use Python sensor fusion libraries (or even C/C++ libraries!).

We use the `child_process` package to execute `multi_sensor_fuser_obj.py` as if we are using the command line. The Python code is responsible for putting the data in the correct format to pass back to the server. This reliance is very important, since the metadata file describing the returned data is created by the Form File Processor under the assumption that the output Quaternion data will have the same order for its column indices (so if the first sensor is RUA, then the RUA quaternions will be at column 0).
