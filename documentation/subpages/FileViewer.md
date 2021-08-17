[(Back to To TOC)](../TOC.md)
# FileViewer [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/FileViewer.js)
The FileViewer is responsible for showing the status of a target file, and for providing a Visualizer when the target file is ready for viewing.
Since the server can take as long as it wants to translate an uploaded file to the desired format, and the server can encounter errors that prevent it from processing a submission, the FileViewer lets the user know whether they should expect a file or just try re-uploading. 
The component relies on the Viewport to report the status of the target file as a React property, so it should not care how the communication occurs.
It can display one of a number of sub-components which are defined in the same file. Note that the `FileDisplay` functional component needs the File Viewer as a React prop in order to access these sub-components.

Here are the enumerated sub-components:

## ContactingServerMessage
Displays if no communication with the server has taken place yet. If there is no server to receive messages, this screen will display forever. It may want to have a timeout instead.

## ProcessingDataMessage
Displays if the server says that the desired file is still being processed server-side. We don't expect this to have a progress indicator. This should never be the final status unless the server goes offline unexpectedly.

## LoadingFileMessage
Displays if the target file is being sent to the client. This is accompanied by an indicator of the download progress.

## LoadingModelMessage
Displays if the file has been received by the client but the model is not ready. This screen should be rare because the models are usually loaded by the time the file is ready, but we should not assume they will be ready and we should avoid displaying an empty scene to the user. This is also accompanied by a progress indicator. The FileViewer should not have to know how the model loading takes place or what models are in use.

## ErrorMessage
Displays if the target file cannot be displayed to the user. If an error is encountered, they should not expect the File Viewer's status to change unless they take an action to change it (such as picking a different file to look at). The FileViewer doesn't need to know how the error message was acquired.

## ("Confused" message)
Displays if the File Viewer receives an invalid status string in its React props. If you see this message in the File Viewer, the program has a bug.

## Visualizer [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/shared_visualizer_object/Visualizer.js)
This is not a sub-component, but it's one of the things the File Viewer can display. If file is ready for viewing--we have the model and the data file--then the user gets to see the interactive 3D scene that shows the quaternions on the model.
