/**
 * Does not need to check for a mapping from filename to metadata in the current scheme, so it always
 * just rubber stamps the file. May be changed later based on other criterion.
 * 
 * @category Client-side functions
 */ 
export function isFileNameValid(props, fname) {
    return true;
    // return props.fileMap[0] && Object.getOwnPropertyNames(props.fileMap[0]).indexOf(fname) >= 0
}


/**
 * Function called whenever the user clicks a file in the file tree.
 * 
 * @param {Object} props
 * @param {string} id - the file ID/path
 * @param {string} name - the display name of the file
 * 
 * @category Client-side functions
 */
export function clickFile(props, id, name) {
    if(isFileNameValid(props, id)) {
        onSelectFileChange(props, id, name);
        window.history.replaceState(null, null, "?file=" + id);
    }
}

/**
 * Performs all necessary cleanup in order to switch which file is currently being
 * viewed by the user in the Viewport.
 * @param {Object} props - Component props
 * 
 * @param {Object} props.data - a React reference whose 'current' field can be set to an empty list.
 * @param {function} props.setTimeSliderValue - a function to set the target datapoint in the new dataset.
 * @param {Object} props.lineNumberRef - a React reference whose 'current' is the index of the target datapoint.
 * @param {function} props.setSelectedFile - A function to set the filepath of the currently selected file.
 * @param {function} props.subscribeToFile - A function that notifies the server that we are viewing a specified file.
 * 
 * @param {String} mySelectedFile The filepath of the target file, as described by the server in the response 
 * of a '/get-file-list' GET request.
 * @param {String} myDisplayName The file's display name
 * 
 * @category Client-side functions
 */
export function onSelectFileChange(props, mySelectedFile, myDisplayName) {
    // IMPORTANT! This method should only be called if mySelectedFile 
    // has been VERIFIED as a valid file, or if we need to clear/reset the model. (i.e. mySelectedFile === "")
    // (TODO: unsubscribe from current file)
    props.data.current = [];
    props.setTimeSliderValue(0);
    props.lineNumberRef.current = 0;    
    if (props.visualizer.modelLoaded) props.visualizer.reset()
    if (props.verbose) console.log("Selected file has been changed to " + mySelectedFile + " (re-printed below)");
    if (props.verbose) console.log(mySelectedFile);
    if (props.verbose) console.log("Display name: " + myDisplayName);
    props.setSelectedFile({ fileName: mySelectedFile, displayName: myDisplayName }); // We may want some verification, but verification is also done by this method.
    
    if (mySelectedFile.indexOf("smartphone-dataset") !== -1) {
        if (props.visualizer !== props.phoneVisualizer) {
            props.setVisualizer(props.phoneVisualizer);
            props.phoneVisualizer.reset()
        }
    } else {
        if (props.visualizer !== props.mannequinVisualizer) {
            props.setVisualizer(props.mannequinVisualizer);
            props.mannequinVisualizer.reset()
        }
    }

    if (mySelectedFile !== "") {
        props.setOpenLab("") // Close any open labs
        props.subscribeToFile(props, mySelectedFile);
    }
}
