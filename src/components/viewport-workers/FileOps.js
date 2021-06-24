export function isFileNameValid(fname) {
    return fname.substr(-4) === ".dat"
}

export function clickFile(props, id) {
    if (isFileNameValid(id)) {
        onSelectFileChange(props, id);
        window.history.replaceState(null, null, "?file=" + id);
    }
}

export function onSelectFileChange(props, mySelectedFile) {
    // IMPORTANT! This method should only be called if mySelectedFile 
    // has been VERIFIED as a valid file, or if we need to clear/reset the model. (i.e. mySelectedFile === "")
    if (!props.outgoingRequest) {
        props.setSelectedFile(mySelectedFile);                    
        props.data.current = [];                                        // Allow either refresh or disable
        props.outputTypes.current = []                                  // Clear all graphs
        props.setTimeSliderValue(0);                                    // Move to start
        props.lineNumberRef.current = 0;                                // (same as above)
        props.setUseRipple(true)                                        // For the initialization of the model
        if (props.modelLoaded) {
            props.resetModel()                                          // Same as above
            props.setUseRipple(false)           
            if (props.playTimerId.current !== 0) {                      // Stop playback if it is occuring
                    window.clearInterval(props.playTimerId.current);   
                    props.playTimerId.current = 0;
                    props.setPlaying(false);
            } 
            let cam = props.getCamera();
            if (cam) {
                cam.position.x = 0;
                cam.position.y = 0;
                cam.position.z = 3;
                cam.up.set(0, 1, 0);
                props.getControls().update();
            }  
        }
        if (mySelectedFile !== "") {
            props.downloadMetafile(props, mySelectedFile).then(() => {
                props.downloadFile(props, mySelectedFile)
            }, () => {})
        }
    }
}