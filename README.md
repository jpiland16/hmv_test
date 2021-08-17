# hmv_test  | [_launch website_](http://vcm-20389.vm.duke.edu/)

Human model visualizer project, 2021

### Authors *(alphabetically)*

 - [Jonathan Piland](https://github.com/jpiland16)
 - [Samuel Thompson](https://github.com/samuel-thompsonn)
 - [Sophie Williams](https://github.com/sosophiemw)

> Note: some concepts were reused from [HumanSkeletonVisualizer](https://github.com/karendeng00/HumanSkeletonVisualizer/) by [karendeng00](https://github.com/karendeng00) and [charlottemcc](https://github.com/charlottemcc).

### Getting started:
 - `git clone`
 - `npm install`
 - `node server` or `pm2 start server.js`

### Other credits
- Peter Hinch - [micropython-fusion](https://github.com/micropython-IMU/micropython-fusion/blob/master/LICENSE)


## Read below this line if you plan to expand on this project.

---
## Hi.
You want to maintain or update this project. What do you need to know?

Below are some of the most important notes for developing the app, in a loosely arranged set of guides.

> By the way, here's the logo--it helps make the project seem professional.
> 
> <img src="https://vcm-20389.vm.duke.edu/hmv-favicon-512.png" alt="" data-canonical-src="https://vcm-20389.vm.duke.edu/hmv-favicon-512.png" width="128" height="128" />
## Prior knowledge
It will be helpful to be familiar with the following programming languages, data formats, libraries, etc.
- Javascript - this app is primarily Javascript.
- Python - the app uses Python for some server-side calculations.
- JSON - important data is stored in JSON format.
- React - the client web app is built using React.
- Material-UI - most UI elements used in the website are from this library.
- CSS - a mixture of CSS files and Material-UI's 'styles' API control the look of components.
- Quaternions - quaternions are used to manipulate the model.
- [Xsens IMU sensors](http://www.opportunity-project.eu/system/files/MTi_and_MTx_User_Manual_and_Technical_Documentation.pdf) - multiple popular human activity recognition datasets, including OPPORTUNITY, use Xsens IMU sensors to collect data.
- [The OPPORTUNITY dataset](https://archive.ics.uci.edu/ml/datasets/OPPORTUNITY+Activity+Recognition) - the project was created with this dataset as the primary example.
- HTTP - the client gets files and some other data from the server using a (mostly) RESTful HTTP API.
- Web sockets - the file viewer page relies on web sockets for updates from the server.
- Node.js - the server uses the Node framework to handle incoming requests and to manage library dependencies.
- The layout of the [website](https://vcm-20389.vm.duke.edu/) - 🤔 go figure.
- THREE.js - The visualizer uses THREE.js to display a 3D scene to the user.
- JSDoc - an API documentation generator for JavaScript.

## Where to get information outside this document

- Check out the [/documentation](documentation/) folder for idea-based documentation of each subpart of the project.
- See [JSDoc](https://jsdoc.app/) docstring for many of the most important and most portable methods in the code base. 
- Watch the lengthy video tutorials (https://www.youtube.com/watch?v=ws-Vckk_YsM) which describe the website layout, how to install and run the development build, how to perform server maintenance, and how to investigate a freshly downloaded dataset. If you have the right browser plugin, you can even watch them at 3x speed.

## How to run the app locally
- Option 1 (Recommended): Run the client in dev mode and server locally
    1. Open two instances of the command prompt in the root directory of the `hmv_test` repository.
    2. On the first terminal instance, use `npm start` to start the client. This should take several seconds, generate a list of complaints, and then open a browser window with the app's home page.
    3. On the second terminal instance, use `node server` to start the server. It should print `Directory rescan requested at <date and time> GMT` and hang as it waits for a client to ask for files. 
    4. You can now test the server. Changes to the client will automatically be applied when you save them, but changes to the server (`server.js`) need a restart.

- Option 2: Run the client in production mode and serve it
    1. Open a terminal in the project root directory.
    2. Use the command `npm run build` to create the production build of the React application. This should around a minute.
    3. Use `node server` to run the server, and use `https://localhost:<PORT>` to connect to it, where PORT is the port number that the server says it is listening to upon startup. (As of 7/22/2021, this is port 443.)
    4. You can now test the server as it behaves in a production environment. Always try this before pushing a change to master. You will have to re-build the client (step 2) to see the result of any changes you make.

- Option 3: Run the client in dev mode with no server
    1. Go to the start of the `subscribeToFile` function in `NetOps.js` and set the constant `SKIP_SOCKET` to `true`.
    2. Open the command prompt in the project root directory.
    3. Use `npm start` to start the client.
    4. You can now use the server to access the sample file `S4-ADL4.dat` from the OPPORTUNITY dataset. For other files you will need to run the server (see Option 1). Set `SKIP_SOCKET` back to `false` to connect to the server.




## The [Viewport](src/components/visualizer-screen/Viewport.js) component is the 'Human activity visualizer'
- The viewport's responsibility is to:
    1. Display the 3D scene containing the model
    2. Manipulate the model based on the target data
    3. Display the status of the target data: Whether it is still loading, or waiting on the model to load, or if an error was encountered
    4. Allow the user to choose the target data by presenting an interface for making an informed decision
    5. Allow the user to choose which time slice of the target data to display
    6. Allow the user to navigate to any other part of the site through one or more pages

How does the viewport achieve these goals?

(1) is handled by the Visualizer object. (2) is handled by the Viewport, Animator, Reset, and SceneInitializer. (3) is handled by NetOps and FileViewer. (4) is handled by Menu. (5) is handled by PlayBar. (6) is handled by Menu.

### Encyclopedia of Viewport's property set
- Page layout (Meta-menu) properties: Describe the current status of the menu in the interface, for adjusting components that need to resize themselves both inside and out of the menu.
    - menuIsOpen
    - menuIsPinned
    - selectedPanel
    - expandedItems
- File selection properties
    - selectedFile: An Object with a fileName and displayName property which represents the file currently being viewed. Has default filename "" (empty) and default display name "None".
    - fileStatus: An Object with a status and message property. The status can be one of an enumerated number of types (described in the doc for NetOps), and the message is relevant for errors.
    - clickFile: A Function to run when a new file is selected. Right now this is done using the menu.
    - files, lastFiles, fileMap: Their purpose isn't clear, but it seems that they hold the currently selected file. 'files' holds it in its 'current' field, while lastFiles and fileMap put the current file in index 0.

## Data format
The `/files/user-uploads/` directory contains all files available to the user. A valid, viewable file contains `quaternion_data.dat` and `metadata.json` files. 

The quaternion data file contains (w,x,y,z) quaternions in 4-column groups, sorted in order of time such that the first row is displayed first. The first column is treated as the 'time' column in milliseconds and is displayed on the right of the play bar in the visualizer interface.

The metadata file carries the following info:
- `name`: The name of the dataset. Not currently used, but was formerly used for assigning one metadata configuration to multiple data files.
- `displayName`: The name that should be shown to the user in the file selection process.
- `globalTransformQuaternion`: A quaternion to pre-multiply to every bone's orientation before the data quaternions are applied.
- `targets`: A list of objects representing the individual sensors (IMUs). Each records the following data:
    - `bone`: The name of the bone for which the sensor determines the orientation. This is one of the following enumerated names, sorted topologically below:
        - ROOT (rotates the entire model about a point on the ground)
            - HIPS
                - BACK
                    - RUA (right upper arm)
                        - RLA (right lower arm/forearm)
                    - LUA (left upper arm)
                        - LLA (left lower arm/forearm)
                 - LUL (left upper leg)
                     - LLL (left lower leg/shin)
                         - LSHOE (left shoe)
                 - RUL (right upper leg)
                     - RLL (right lower leg/shin)
                         - RSHOE (right shoe)
    - `type`: The type of orientation transformation to apply to the bone. As of 7/22/2021, this is always "Quaternion".
    - `column`: The first column in `quaternion_data.dat` that contains the actual transformation values. Column indices begin at 0 for the first column.
    - `localTransformationQuaternion`: A quaternion that is applied to the sensor's bone after the global transformation and before the data.
    
## How data is processed
The visualizer uses a standardized format of (w,x,y,z) quaternions to determine bone orientation. The following process determines these quaternions from the raw data.

The user sends the raw quaternion data (usually in the form of the actual dataset file) to the server, alongside some metadata from the upload form describing the column number and data type corresponding to each sensor.

This takes the form of a POST request to `/api/postform` carrying a JS FormData object, which is JSON that can have a file as its value. `server.js` uses the [formidable](https://www.npmjs.com/package/formidable) library to separate the form data and the file before passing them to `FormFileProcessor.js`, which calls `multi_sensor_fuser_obj.py` and passes in the file data using its `stdin`. This Python program instantiates the appropriate `DatatypeHandler` for each sensor. After a `DatatypeHandler` converts the relevant columns to quaternions, the Python program returns the aggregate data, which is then combined with a JSON metadata file and stored in the `/files/user-uploads/` directory.

### Side note: The server-client split 

There is a server-side and client-side aspect to our data processing. The server processes the raw data into quaternions representing bone orientation, and the client uses these alongside the metadata and the orientations of other bones in order to create the final quaternion orientation for each bone. We could also have done all calculations on the server so that the client just reads out file data, or we could have done all calculations client-side in order to relieve stress on the shared server resource.

The processing is not more client-centric because we want freedom to use any sort of code for processing incoming data, including python or C libraries. It's not more server-centric because (1) unnecessary server-side activity allows users to more easily slow down the website, and (2) we want the metadata to be easily swappable, since it often changes many times before we have something we like.

## How processed data is applied to the model
`Animator.js` and the Visualizer object (`Visualizer.js` and `Model.js`) handle manipulating the model to show data.

`Animator.js` is a renderless component which checks on each re-render whether the selected time slice `timeSliderValue` has changed. When a file is loaded and the time slider changes, it parses the floats from the active file data and passes them as a JS Object to `Visualizer.acceptData`, which then applies them to the model using THREE.js Quaternion objects. 

The Visualizer object, which is owned by the Viewport component, calculates the 'local' and 'global' quaternions associated with the new orientation. 
The 'global' quaternion is the orientation with respect to the global THREE.js coordinate system, such that the identity quaternion (wxyz)=(1,0,0,0) would point the bone in the x direction, with its local up facing in the y direction.
The 'local' quaternion is the orientation with respect to the bone's parent-the bone whose end it is attached to. A local quaternion of (1,0,0,0) means that the bone points in the same direction as its parent (for the bone ROOT, which has no parent, we expect global and local orientation to match).

The utility functions `getGlobalFromLocal` and `getLocalFromGlobal` transform between the two by multiplying a quaternion by the orientations of its parent, grandparent, etc., or by multiplying by their inverses.

### Example: Local and Global transformations

Suppose an object *M* has local orientation *Q<sub>L</sub>* with respect to its parent. This parent has orientation *Q<sub>n</sub>* relative to *Q<sub>n-1</sub>* relative to ... relative to the root, *Q<sub>1</sub>*.

Then the net orientation of *M* relative to the world is the result of repeatedly left-applying parent rotations to the child rotation until you reach the __world orientation__, *Q<sub>W</sub>*, i.e.:

*Q<sub>W</sub>* = *Q<sub>1</sub>Q<sub>2</sub> &times; ... &times; Q<sub>n-1</sub>Q<sub>n</sub>Q<sub>L</sub>* &nbsp; *(converts local orientation to world orientation)*

and thus we can also obtain

*Q<sub>L</sub>* = *Q<sub>n</sub><sup>-1</sup>Q<sub>n-1</sub><sup>-1</sup>* &times; ... &times; *Q<sub>2</sub><sup>-1</sup>Q<sub>1</sub><sup>-1</sup>Q<sub>W</sub>* &nbsp; *(converts world orientation to local orientation)*.

## How to upload dataset files to the host machine for public access
Objective: Place a directory containing correctly formatted `metadata.json` and `quaternion_data.dat` files anywhere in the `/files/` directory on the server machine.


Assumptions:
- You have a directory containing the relevant data such that you can view it when running the server locally.
- The machine hosting the server is a Duke virtual machine for server hosting
- You have root access to the hosting machine through SSH, either using the command line or through some SSH client like MobaXTerm.
- You have a directory on the machien where you may upload files using SFTP.
- You have a way to send files using SFTP, either using the command line with the `scp` command or using an FTP app like FileZilla.

Procedure:
1. Connect to the Duke VM using an FTP software (see step 5 of [this OIT guide](https://courses.cs.duke.edu//spring19/compsci216/setup/VM/instructions.html)).
2. Transfer the target directory to any place on the target machine. I did not have permission to transfer the files to the `/files` directory, but I was able to transfer them to the directory corresponding to my own NetID.
3. Use your SSH program to access the machine (with root access).
4. Use the `cp <source> <target>` command in the Linux shell, where `<source>` is the filepath of your uploaded directory, and `<target>` is a filepath within the `.../hmv_test/files` directory where you want the files to show up.
5. Navigate to the HMV website, go to the visualizer, open the file browser on the left menu, and click 'REFRESH FILE LIST' at the top of the menu. After navigating back to the visualizer, your file should be visible and ready for viewing.

## How to add a new dataset
See the `/dataset-research` folder for some insight on the criterion we use to check whether a dataset is a good fit for the visualizer. This is subject to change as the visualizer expands in functionality.
- Assumptions:
    - The dataset represents movement data from an IMU/motion sensor which can be visualized as the actual 3D movement of an object.
    - You have not seen the data visualized yet, and you want to visualize before you slap it onto the model.
1. Acquire the dataset and its documentation. Find the format and meaning of the data. 
    - How many sensors were used?
    - What did the trials consist of? You'll want to look for movement in the app which matches the described movement. Examples include walking or opening/closing doors.
    - What kind of data was collected? Examples include accelerometer, gyroscope, magnetometer, Euler angle orientation, quaternion orientation, or a mix between one or more of these.
    - What is the format of the data files? Examples include CSV and whitespace-separated values. Some datasets lump all data from a trial into one file, and others separate it out either by timestamps or by which sensor is producing the data.
    - Which numbers represent exactly which data for which sensor? Which numbers represent the time (since the start of the trial) at which a reading was taken, or is the time implied by a sampling rate?
2. Create a sample of the target data in a normalized form.
    - The sample should just be one file.
    - Each row/line of data should represent the data from all involved sensors at a given time. *Note*: You don't have to include all the sensors in this sample--focus on one or two that might be relevant.
    - The data from each sensor should have the same format, and they should be spaced evenly apart such that the first column associated with sensor 1 is *n* columns apart from the first column of sensor 2, and so on.
    - For datasets in which different sensors have their own files, `append-files-horizontally.py` can be used to combine them into one file with the columns of a group of files combined.
3. Use the Python utility programs to visualize the data.
    - Make a directory for raw data and for processed data, and use `use-datatype-handler-multi.py` (use the `-h` flag for arguments) to process one or more of the sensors to produce an output file with columns of quaternions representing orientation. Here's an example in the Windows terminal with the [Daily and Sports Activity Dataset](https://archive.ics.uci.edu/ml/datasets/daily+and+sports+activities):
    ```
    C:\...\hmv-scratchpad\sample-test-data>use-datatype-handler-multi.py data-samples/barshan-altun-dailysports/raw-data/activity10-subj1-sample21.txt acc_gyro_mag 0 9 1 data-samples/barshan-altun-dailysports/processed-data/activity10-subj1-sample21-quats.dat --sep comma
    ```
    - Then, pick a single target sensor and use `graph-animate-transf.py` (also use `-h` to see arguments) to visualize it using 3D Matplotlib utilities. Here's an example using the file generated above:
    ```
    C:\Users\Sam\human-activity-visualizer\hmv-scratch\sample-test-data>graph-animate-transf.py --offset 0 data-samples/barshan-altun-dailysports/processed-data/activity10-subj1-sample21-quats.dat
    ```
    - If the resulting path on the graph isn't staying perfectly still and isn't tracing a crazy random sphere around the origin, you've probably got reasonable data. You can even try picking a specific sensor at a specific time slice to see if you can predict its general movement.
4. Plug the data into the human model visualizer locally.
    - Use the previous steps to generate a file containing quaternion data for each sensor, and decide which bone on the model corresponds best to which sensor.
    - Create a folder with the data labelled as `quaternion_data.dat` and add a `metadata.json` file. See any existing metadata file and follow its format. Keep in mind that although the sensors specifically list 'quaternion' as their data type, other types are not currently supported (since we can transform any other complete orientation data into quaternions).
    - The result will likely look very painful for our model (his name is Montie, by the way). The movements should be familiar from the Python visualizer.
5. Configure the transformation quaternions to align the limbs correctly.
    - You can use the 'tinker' tool (At the website homepage domain + '/tinker/, example: https://vcm-20389.vm.duke.edu/tinker) to upload a quaternion data file and mess with the limbs in order to get them in a reasonable position where the movements make sense. 
        - Use the drop down at the top right to select what bone you're modifying transformations for.
        - Upload a data file of column-based, whitespace-separated (w,x,y,z) data quaternions using the 'Choose File' button.
        - Use the number input to set the column number of the target data for the selected limb. Column numbers are going to be separated by multiples of 4 since the file has columns of quaternions.
        - Click 'add quaternion' to add an axis-angle rotation quaternion which you can adjust using an axis selector and slider. You can click the button repeatedly to use multiple, and you can click 'remove' for any of them if you want to simplify things.
        - A bone will only be moved by quaternion data if it has at least one transformation quaternion assigned to it--otherwise, it will follow its parent's orientation. 
        - I recommend doing this one limb at a time, starting with HIPS and proceeding in topological order such that no later limb affects the position of an earlier limb.
    The tutorial screen uses [this image](https://github.com/jpiland16/hmv_test/blob/master/src/components/getting-started-screen/coordsystem.PNG) to point out locations of bones in the upper body. The bones are parented in the following topological order (so the position of anything earlier in the list is not affected by the position of anything after it): HIPS, BACK, RUA, RLA, LUA, LLA, RUL, RLL, LUL, LLL.
    - In THREE.js, the y-axis points up, the z-axis points away (forward) from the camera's default starting position, and the x-axis points right from the camera's starting position. *Notice that this differs from the positions in the image linked in the previous bullet point.*

## How to work with a new orientation data type
For any type of data that you expect a file to contain, you should have at least one data type handler so that you can parse the orientation from it. A 'data type handler' is a class extending the simple `DatatypeHandler` API so that it can take in file data and relevant metadata (such as column number) and output quaternions. Here's how to make a new one.
1. Make an algorithm that takes data in the input format and gives output quaternions in (wxyz) format.
2. In the (src/server_side/python_programs/datatype_handlers/) directory, add a Python script with a relevant name ending with "Handler". Put a class with the same name that extends `DatatypeHandler`.
3. Implement the `get_quaternions` method, using the documentation comments in [`DatatypeHandler`](src/server_side/python_programs/datatype_handlers/) as a guide for the parameters and expected output. You should not modify the incoming 2D array, since it is passed by reference and later handlers may need that data (yes, this is a design flaw that adds fragility to the program). This may seem like a "just draw the rest of the owl" kind of step, but the documentation for the `get_quaternions` method alongside other DatatypeHandlers should serve as a useful guide.
