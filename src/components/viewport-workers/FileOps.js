// Does not need to check for a mapping from filename to metadata in the current scheme, so it always
// just rubber stamps the file. May be changed later based on other criterion.
export function isFileNameValid(props, fname) {
    return true;
    // return props.fileMap[0] && Object.getOwnPropertyNames(props.fileMap[0]).indexOf(fname) >= 0
}

export function clickFile(props, id, name) {
    if(isFileNameValid(props, id)) {
        onSelectFileChange(props, id, name);
        window.history.replaceState(null, null, "?file=" + id);
    }
}

export function onSelectFileChange(props, mySelectedFile, myDisplayName) {
    console.log("OnSELECTFILECHANGE IS RUNNING");
    // // IMPORTANT! This method should only be called if mySelectedFile 
    // // has been VERIFIED as a valid file, or if we need to clear/reset the model. (i.e. mySelectedFile === "")
    // if (!props.outgoingRequest) {
    //     props.setSelectedFile(mySelectedFile);                    
    //     props.data.current = [];                                        // Allow either refresh or disable
    //     props.outputTypes.current = []                                  // Clear all graphs
    //     props.setTimeSliderValue(0);                                    // Move to start
    //     props.lineNumberRef.current = 0;                                // (same as above)
    //     props.setUseRipple(true)                                        // For the initialization of the model
    //     if (props.modelLoaded) {
    //         props.resetModel()                                          // Same as above
    //         props.setUseRipple(false)           
    //         if (props.playTimerId.current !== 0) {                      // Stop playback if it is occuring
    //                 window.clearInterval(props.playTimerId.current);   
    //                 props.playTimerId.current = 0;
    //                 props.setPlaying(false);
    //         } 
    //         let cam = props.getCamera();
    //         if (cam) {
    //             cam.position.x = 0;
    //             cam.position.y = 0;
    //             cam.position.z = 3;
    //             cam.up.set(0, 1, 0);
    //             props.getControls().update();
    //         }  
    //     }
    // }
    props.data.current = [];
    props.setTimeSliderValue(0);
    console.log("Selected file has been changed to " + mySelectedFile + " (re-printed below)");
    console.log(mySelectedFile);
    props.setSelectedFile({ fileName: mySelectedFile, displayName: myDisplayName }); // We may want some verification, but verification is also done by this method.
    props.subscribeToFile(props, mySelectedFile);
}
