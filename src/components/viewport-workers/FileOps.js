// Does not need to check for a mapping from filename to metadata in the current scheme, so it always
// just rubber stamps the file. May be changed later based on other criterion.
export function isFileNameValid(props, fname) {
    return true;
    // return props.fileMap[0] && Object.getOwnPropertyNames(props.fileMap[0]).indexOf(fname) >= 0
}

export function clickFile(props, id, name) {
    if(isFileNameValid(props, id)) {
        onSelectFileChange(props, id, name);
        // window.history.replaceState(null, null, "?file=" + id);
    }
}

export function onSelectFileChange(props, mySelectedFile, myDisplayName) {
    // IMPORTANT! This method should only be called if mySelectedFile 
    // has been VERIFIED as a valid file, or if we need to clear/reset the model. (i.e. mySelectedFile === "")
    props.data.current = [];
    props.setTimeSliderValue(0);
    props.lineNumberRef.current = 0;
    console.log("Selected file has been changed to " + mySelectedFile + " (re-printed below)");
    console.log(mySelectedFile);
    console.log("Display name: " + myDisplayName);
    props.setSelectedFile({ fileName: mySelectedFile, displayName: myDisplayName }); // We may want some verification, but verification is also done by this method.
    props.subscribeToFile(props, mySelectedFile);
}
