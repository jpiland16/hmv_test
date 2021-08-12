[(Back to TOC)](../TOC.md)

# Viewport [(view code)](../../src/components/visualizer-screen/Viewport.js)
The Viewport serves as a bridge between every top-level element of the "Visualizer" screen (anywhere with the "/visualizer" URL).
It holds a large number of React state hooks which are used as React props for Animator, FileViewer, PlayBar, Menu, CardSet, and TopActionBar.
The [React documentation](https://reactjs.org/docs/lifting-state-up.html) describes how this can help React components work together to modify one piece of 
state, and how it can decouple the effect of components from their UI design by letting UI elements use callbacks that are defined by a higher-level component. For example, the `visualizer` state hook refers to the THREE.js visualizer that gets manipulated by whatever file data is being viewed by the user.
The Viewport has a number of "private" state-changing methods which have been extracted out into files in the [viewport-workers](../../src/components/visualizer-screen/viewport-workers) directory based on their category. 

In FileOps, the `onSelectFileChange` function should run whenever the selected file is changed (or if we switch to having *no* file selected). The method should have access to all Viewport state through the Viewport's `propertySet` data bundle, and it should
always be configured to reset any file-dependent state to the new necessary values when changed (or to default values when we switch to 'no file selected'). For example, it sets the `timeSliderValue` so that switching to a file with fewer rows doesn't leave us trying to access an out-of-bounds index.

NetOps handles all socket.io interaction and handles the GET request to the server API when data files are ready to be delivered. As described in the JSDoc for `subscribeToFile`, NetOps modifies the `fileStatus` state value in Viewport to reflect the current progress in processing a file. This is then used by the FileViewer component to decide what message to show to the user.

Do not be fooled by the use of multiple worker files to modify Viewport state--the methods in NetOps and FileOps are essentially just private methods that belong in the Viewport as callback functions for child components. The methods as they exist now are not very portable and rely on `propertySet` having several properly defined default values. Because distant parts of the program are modifying shared variables such as `fileStatus` and `timeSliderValue`, and they're doing it asynchronously because React state hooks don't update until the next render, the actual value of these variables can be hard to predict. When designing a component that relies on any member of Viewport's `propertySet`, it's important to handle unexpected or undefined values in a way that (1) never crashes the program and (2) doesn't take any meaningful action that uses the unexpected value. This can be as simple as checking if a member of `props` is undefined before using it as content for a component.

Viewport has the following sub-components:
## FileViewer [(view code)](../../src/components/visualizer-screen/FileViewer.js)
Handles showing the current status of the selected file, as defined by the `data` React ref and `fileStatus` state object.
## Menu [(view code)](../../src/components/visualizer-screen/menu/Menu.js)
Allows choosing the file to view, as well as accessing other information for manipulating the UI or even going into developer mode to look at any labs that are
still functional. 
## TopActionBar [(view code)](../../src/components/visualizer-screen/TopActionBar.js)
Shows the display name or file name of the currently selected file as defined by the `SelectedFile` state object. Uses the `onSelectFileChange` callback when deselecting a file to return it to its 'no file selected' default value.
## CardSet [(view code)](../../src/components/visualizer-screen/cards/CardSet.js)
Uses similar state data as `FileViewer` to show relevant graphs and activity status.
## PlayBar [(view code)](../../src/components/visualizer-screen/PlayBar.js)
Displays current `timeSliderValue` and uses the React state callback to modify it.
## Animator [(view code)](../../src/components/visualizer-screen/Animator.js)
Applies the relevant quaternion data to the `visualizer` state object whenever `timeSliderValue` is changed by any component (such as the PlayBar).
## HomeButton [(view code)](../../src/components/visualizer-screen/HomeButton.js)
Allows a quick exit back to the home page for user convenience.