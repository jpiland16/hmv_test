[(Back to To TOC)](https://github.com/jpiland16/hmv_test/blob/master/documentation/TOC.md)
# PlayBar [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/PlayBar.js)

The PlayBar as a UI element is a slider with an autoplay / pause button. The React component also actively modifies the `lineNumberRef` value that the Viewport gives to the Animator to determine what line of data should be shown on the model.

The PlayBar also displays a label for the timestamp of the frame being viewed. This is currently hard-coded to display the first column of the current row of file data, which works properly only in the OPPORTUNITY datset where the first column is the time in milliseconds.

In its current form (as of [this commit](https://github.com/jpiland16/hmv_test/commit/c191f81151e6748cb188aadd7a43afbeb9992abe)) the PlayBar needs to know whether the Menu is open on the Viewport page in order to adjust its width. [This issue](https://github.com/jpiland16/hmv_test/issues/8) asks that we refactor the component using CSS styling to automatically adjust the size.

The PlayBar should be disabled whenever it doesn't know how many timestamps are in the data, *or* when adjusting the PlayBar shouldn't do anything. This is controlled by a `disabled` prop, so higher-level components can decide the effective rules.
