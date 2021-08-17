[(Back to To TOC)](../TOC.md)
# File Info Form [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/upload-screen/FileInfoForm.js)
This is the first view in the online file upload process. It allows the user to select the target file. It then allows
the user to identify the relevant data columns, the type of data contained there, and the part of the body that data
measures. A basic user tutorial is available by clicking the 'Getting Started' button at the top right of the website's home page.

Note that this code has some differences in convention to the rest of the code body. 
First, the form is a React Class component
rather than a React functional component. This has no effect on its functionality, but it means you need to use `this.state`
and `this.setState` to modify stateful properties such as the sensor list.
Second, the layout of the form is controlled mostly by the `Grid` component from Material-UI rather than by CSS layouts. Ideally
CSS would be used instead.

The component follows a typical format for an input form where change callbacks in controlled components trigger state changes
in the form component. The slightly tricky parts are:
1. the use of `map` to translate `this.state.sensors` to a sequence of Grid rows containing modifiable sensor information. Besides
the [React documentation](https://reactjs.org/docs/lists-and-keys.html), this was constructed based on a [tutorial](https://goshakkk.name/array-form-inputs/) by Gosha Arinich.
2. the [function](https://github.com/jpiland16/hmv_test/blob/7e4793d126137fa7fd4d3cc651e95363cab2ee71/src/components/upload-screen/FileInfoForm.js#L57) to remove options from the dropdown list of bone choices
in order to prevent someone from mapping multiple data streams to one bone on the model.