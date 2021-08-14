# Lab Guidelines

This page aims to explain the process and requirements of creating a working lab for the *labs* page of the website. To see the entire file I'll be working through, please [click here](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/menu/components/main-panel/subpanels/Labs/Jonathan20210526/RequestFile.js). Hopefully, the act of viewing an existing file (not through the labs page) would follow a very similar pattern.

## Overview

### What your code should accomplish

 - Obtaining or providing input data in some format
 - Adjusting relevant model settings (FPS, repetition, global quaternions, etc.)
 - Responding to a change in the slider value and calling ~~`props.batchUpdate`~~ `props.visualizer.acceptData` ~~for each bone you wish to move~~ with a single parameter of an object whose values are  of type `THREE.Quaternion` for each key/bone.

### What the existing code will accomplish

 - Ensuring the time slider does not extend beyond the length of the data array you provide
 - Modifying the value of `props.timeSliderValue` whenever an update to the model should occur
 - Loading the model and moving the sliders on the "Test Model" page
 - Handling play, pause, load and unload of the lab

## Line by line guide

Here, I'll go through an overview of how I created a lab to test viewing one of the files from the dataset. *The result is not great, so no worries there. :)*

### Lines 1-3

```js
import React from 'react';
import * as THREE from 'three'
import LinearProgress from '@material-ui/core/LinearProgress'
```

You'll probably want to import React and THREE, unless you are solely using raw data. As for components such as `LinearProgress` and others, feel free to add whatever you need.

### Lines 5-11

```js
const boneList = {
    'BACK': 46,
    'RUA': 59,
    'RLA': 72,
    'LUA': 85,
    'LLA': 98
};
```

These are the relevant columns for quaternions in the Opportunity dataset.

### Lines 13-16

```js
const USE_GLOBAL = true;

const REPEAT = false;
const FPS = 30;
```
I have a personal preference for specifying constants at the top of the code. Feel free to write them inline. 

### Line 18

```js
let outgoingRequest = false;
```

I'm using an external variable to prevent the code from sending multiple `XMLHttpRequest`s at once.

### Line 20

```js
export default function GeneratedData(props) {
```

This allows the file [Labs.js](https://github.com/jpiland16/hmv_test/blob/master/src/components/menu/components/main-panel/subpanels/Labs/Labs.js) to import this code. The title of the function is actually irrelevant, since it is the default export. (See [implementing your lab](#implementing-your-lab).)

### Line 22

```js
const [ progress, setProgress ] = React.useState(0)
```

This is a React Hook. Any call to `setProgress` will trigger a re-rendering of this component (assuming that you use the variable `progress` somewhere.) I'm using this state variable to show the progress of an `XMLHttpRequest`.

### Line 24 

```js
if (props.data.current.length === 0) {
```

This `if` statement should be used for code that should only be run once, when the lab is loaded. The `LabOpener` guarantees that the value of `props.data` will be an empty array when your lab is initialized.

### Line 26

```js
if(!outgoingRequest) {
```

I'm performing an asynchronous request in this lab, so I needed to make sure that the request would not repeat if re-renders were triggered during the data retrieval. (For example, re-rendering the progress bar would have caused an infinite loop without this statement, because every re-render would create a new request.) If you're just using a string or some other kind of included data, however, you shouldn't need any extra `if` statements.

### Lines 29-31

```js
props.repeat.current = REPEAT;
props.FPS.current = FPS;
props.lastIndex.current = -1;
```

The first 2 lines modify some of the settings referenced [above](#lines-13-16): whether to repeat at the end and frames per second. The last line triggers an immediate refresh of the model once loaded.

### Lines 33-36

```js
props.outputTypes.current = [{
    startCol: 243,
    columnCount: 1
}]
```

I'm working on an interface to make it easy to check the data while it being viewed. Right now, the only things that work are the label columns; however, in the future, we would hopefully be able to use the value columns and create cards with graphs. The syntax is as follows: each element in the array `props.outputTypes.current` corresponds to a card that will appear in the Viewport, depending on your settings.


### Lines 38-64

```js
let x = new XMLHttpRequest();
x.open("GET", window.location.href === "http://localhost:3000/" ? 
    "https://raw.githubusercontent.com/jpiland16/hmv_test/master/files/demo/S4-ADL4.dat" : 
    "files/demo/S4-ADL4.dat");

x.onload = () => {
    let inputArray = x.responseText.split("\n");
    let linesArray = [];

    for (let i = 0; i < inputArray.length - 1; i++) { // Last line is blank
        linesArray[i] = inputArray[i].split(" ");
    }

    props.data.current = linesArray;
    outgoingRequest = false;
}

x.onprogress = (event) => {
    setProgress(Math.round(event.loaded / event.total * 100));
}

x.onerror = (error) => {
    console.log(error);
}

x.send();
outgoingRequest = true;
```

A basic implementation of an `XMLHttpRequest`.

### Line 67

```js
React.useEffect(() => {
```

I wrapped the function updating the model in a `useEffect` hook, to tell React to perform this action after rendering the UI.

### Line 68

```js
if (props.timeSliderValue !== props.lastIndex.current && props.data.current.length > 0) {
```

The code inside this `if` statement is executed when the `timeSliderValue` becomes different from the `lastIndex` upon which the model was updated. This is where your code should move the Three.js model. *(Note: I had to add the additional condition of `props.data.current.length > 0` because of the asynchronous `XMLHttpRequest`. Again, this would not be necessary if using hard-coded data.)*

### Lines 72-78

```js
let columnStart = boneList[boneNames[i]];
let q = new THREE.Quaternion(
    props.data.current[props.timeSliderValue][columnStart + 1] / 1000, // X
    props.data.current[props.timeSliderValue][columnStart + 2] / 1000, // Y
    props.data.current[props.timeSliderValue][columnStart + 3] / 1000, // Z
    props.data.current[props.timeSliderValue][columnStart + 0] / 1000, // W
);
```

Updating each of the selected bones with the Opportunity quaternions.

### Line 79

```js
props.lastIndex.current = props.timeSliderValue;
```

Prevents an infinte loop of re-rendering once the 3-D model has been updated. This line is extremely important! ~~*(Another note: I feel like this line __does__ need to be inside the `for` loop so that re-rendering has no chance of occuring after a `batchUpdate`, even though it is redundant to call this function repeatedly. I haven't actually tried moving it outside of the loop, however.)*~~ Honestly, there should be no chance of re-render now since we removed `batchUpdate`.

### Line 80

```js
dataObj[boneNames[i]] = q
```
~~The first parameter should be a string with the name of the bone (currently supported: `ROOT`, `BACK`, `RUA`, `RLA`, `LUA`, `LLA`, `LSHOE`, and `RSHOE`) while the second parameter should be an array of quaternion values.~~ `boneNames[i]` should be one of the following: `ROOT`, `BACK`, `RUA`, `RLA`, `LUA`, `LLA`, `RUL`, `RLL`, `LUL`, `LLL`, `LSHOE`, and `RSHOE`, and `q` should be a `THREE.Quaternion`.

### Line 82

```js
props.visualizer.acceptData(dataObj)
```
Send the data to the visualizer.

### Lines 86-92

```JSX
return (
    <div>
        <div>{props.data.current.length > 0 ? "File downloaded successfully." : `File downloading: ${progress}% complete`}</div>
        { props.data.current.length === 0 && <LinearProgress variant="determinate" value={progress} /> }
        <a href="https://github.com/jpiland16/hmv_test/blob/master/src/components/menu/components/main-panel/subpanels/Labs/Jonathan20210526/RequestFile.js" target="_blank" rel="noreferrer">View relevant code</a>
    </div>
)
```
Any content or controls that you wish to show on the Labs page. (You have to return exactly one element, even if it is just an empty div. *To return multiple elements, wrap them all in a `div`.*)


## Implementing your lab

> Note: up to this point, my routine has been to make a folder with name and date in the following format: `JonathanYYYYMMDD` and place that folder in the `Labs/` directory. Then I would give the JS file a descriptive name. I am open to other formats, however, if anyone has a better idea.

Suppose you've created a lab called `NewCoolTest.js` and placed it in the `Labs/Jonathan20210527/` directory. In the Labs.js file, you will need to import the file as follows:

```js
import SOME_UNIQUE_NAME from './Jonathan20210527/NewCoolTest'
```

where `SOME_UNIQUE_NAME` is a variable name not used elswhere in Labs.js. I've been using the name-date format for simplicity.

Then, add a `LabOpener` for your lab, giving it a recognizable title. Inside of the `<div>` you would add the following three lines: 

```js
<LabOpener title="Your cool title" {...props}>
    <SOME_UNIQUE_NAME {...props} />
</LabOpener>
```

That's all you should have to do! I hope this was helpful.


