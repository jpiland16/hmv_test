# Welcome Screen [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/home-screen/WelcomeScreen.js)

Most of the code at the top of the WelcomeScreen.js file is for a fun little Easter egg hidden in the welcome screen and isn't relevent to the rest of the application.
The Welcome Screen consists of the following components:
## Title Bar [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/TitleBar.js)
The title bar provides quick links to the following pages:
- Getting Started Page [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/getting-started-screen/TutorialScreen.js) - explains how users can upload their own datasets
- Dataset Info Page [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/dataset-info-screen/DatasetInfoScreen.js) - provides information on preuploaded datasets and links back to their original sources
- Code Documentation - links back to this GitHub repo
- Contact Us [(view code)](https://github.com/jpiland16/hmv_test/blob/master/files/contact-form.html)- allows users to send developers emails (Add more thorough explanation of how this is working)
## Home Animation [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/home-screen/HomeAnimation.js)
The Home Animation welcomes the user with a looping animation of a spinning model. This is done by creating a THREE.js scene, loading the mannequin model, and calling an animation loop which rotates the model about the y-axis. Before the true model has loaded, a static image of the model is shown to prevent the screen from appearing to be blank.
## Buttons
The buttons on the Welcome Screen include:
- Launch Visualizer Button - takes the user to the [Viewport Screen](https://github.com/jpiland16/hmv_test/edit/master/documentation/subpages/Viewport.md)
- Use OPPORTUNITY Dataset Button - pops up the DatasetDialog [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/home-screen/DatasetDialog.js)
which allows the user to select an OPPORTUNITY dataset trial to view and launches the Visualizer Screen with the file preloaded by passing the file name in as a parameter in the web address
- Upload File Button - takes the user to the [Upload Screen](https://github.com/jpiland16/hmv_test/edit/master/documentation/subpages/UploadScreen.md)
