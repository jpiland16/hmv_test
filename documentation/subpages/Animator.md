[(Back to To TOC)](../TOC.md)
# Animator [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/Animator.js)

This component is purely for computation, so it returns a non-displaying div so that it doesn't show up during rendering.
The Animator serves as a bridge between the inputs which decide what quaternions to display (PlayBar, metadata, data) and
the Visualizer object which is supplying the 3D scene shown to the user.

The Animator communicates through React props supplied by a containing component, the Viewport [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/visualizer-screen/Viewport.js). Whenever the `timeSliderValue` prop changes, the Animator uses the `data`, `timeSliderValue`, and `metadata` props to determine the quaternions to apply to each bone on the model, then applies them using Visualizer's `acceptData` method [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/components/shared_visualizer_object/Visualizer.js).

The Animator also listens for changes in the file status of the displayed file, since it should immediately apply the proper transformations to the model when it about to be displayed.

The Animator keeps track of changes in `timeSliderValue` (which is usually modified by the PlayBar) by comparing it to a memorized previous value, stored at `lastIndex.current`. This works perfectly fine but is very open to refactoring, since there's no fundamental reason to use a React ref to store a number. It would also be acceptable to refactor the Animator to not be a React component, since it doesn't need to be rendered and doesn't need to contain anything that gets rendered.
