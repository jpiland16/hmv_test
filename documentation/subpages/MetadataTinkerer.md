[(Back to To TOC)](../TOC.md)
# MetadataTinkerer [(view code)](../../src/components/MetadataTinkerer.js)
Provides a useful interface for finding the pre- and post-transformations to quaternion data to make it look
reasonable on the model. The user can modify the global quaternion and the quaternion applied to each bone
by adding, removing, or modifying rotations about the x-, y-, or z-axis. Multiple rotations can be stacked together
to get more complex transformations.

How to use it:
1. Scroll down to the 'Choose file' button and upload the whitespace-separated quaternion columns that will be used by the client when displaying the data.
    - The 'Data Quat Index' slider can be used to adjust which row of the file is being displayed on the model.
2. For each limb in the drop-down menu above the 'Choose file' button, you can edit the column index denoting the start of its quaternion data in the file by changing the number in the text input box. You can modify the axis-angle local transformations using the quaternion inputs below (if you don't see any, click the 'Add quaternion' button).
    - Note: A limb will only move in response to the data iff it has at least one local transform quaternion.
3. If local transformations are not enough (likely because the movements of the limbs are the wrong direction *relative to each other*), you can use the stack of quaternion inputs at the top of the div to adjust the global transformation.
4. When you want to save your progress, click the 'Download metadata' button to download a `metadata.json` file you can plug directly into the file system for use.

The tinker tool has the following components:

## SimpleSceneVis [(view code)](../../src/components/upload-screen/SimpleSceneVis.js)
Displays a Visualizer object using a THREE.js scene with zero extra frills. Used here to show how the
model changes when transformation quaternions are changed.

## QuatEditorGroup [(view code)](../../src/components/QuatEditorGroup.js)
Provides a set of editors for individual axis-angle quaternions and reports them as an ordered list (from top to bottom) to a
callback provided through React props. Allows adding and removing quaternions from the list of `QuaternionSelect` components.

## QuaternionSelect [(view code)](../../src/components/QuatEditorGroup.js)
Allows specifying a quaternion rotation about the x-,y-, or z-axis by selecting an axis from a radio button set and using a slider
to adjust the angle between 0 and $2\pi$. Acts exclusively as a controlled React component which takes a value prop and calls an `onChange` callback.