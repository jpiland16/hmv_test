# BasicVisualizerObject [(view code)](https://jpiland16.github.io/jump-to-location/?repo=jpiland16/hmv_test&file=src/components/shared_visualizer_object/Visualizer.js&type=js-class&jump=BasicVisualizerObject)

While the [`BasicVisualizerObject`](https://jpiland16.github.io/jump-to-location/?repo=jpiland16/hmv_test&file=src/components/shared_visualizer_object/Visualizer.js&type=js-class&jump=BasicVisualizerObject) found in [Visualizer.js](https://github.com/jpiland16/hmv_test/blob/master/src/components/shared_visualizer_object/Visualizer.js) is not truly a React component, it does contain 
a component known as `Visualizer`. This is a simple React component that responds to changes in the 
window dimensions and contains a simple `div` which is added to the DOM whenever the component
is rendered.

The `BasicVisualizerObject` contains the most basic methods that should be implemented
for any "Visualizer" that would be used on this website. However the data is going to be
viewed, there are just a few simple methods that cover the needed functionality.

## BasicVisualizerObject functions

### Constructor & initialization

The constructor for this object takes two optional parameters: (1) a function to be called 
when the window dimensions change (must accept a single parameter - the `div` which is part of 
the `Visualizer` component) and (2) a child element that should be rendered after the Visualizer's 
`div` has loaded. To be more specific, note that the `Visualizer` component accepts three props, 
`childElement`, `windowDimensions`, and `onChangeWindowDimensions`. The `windowDimensions` prop is 
not actually used; it is only present so that whenever `windowDimensions` is changed, the 
`onChangeWindowDimensions` function can be called in the `useEffect` hook. 

To access the React component associated with a `BasicVisualizerObject` instance, call
```js
basicViz.component(windowDimensions)
```
where `basicViz` has already been initialized by calling
```js
basicViz = new BasicVisualizerObject
```
and 
```js
basicViz.initialize()
```

### Other functions

#### `acceptData`

Receives an object containing data of an unspecified form. In the case of a 3-D model, 
this function would be overridden to move the model whenever new data arrives.

#### `reset`

Can be used to reset a visualizer to some identity position.

#### `getTools`

Should return a React component (which may contain one or more components)
with tools specific to an implementation (extension) of `BasicVisualizerObject`.
For the 3-D model, this includes the "Reset model" button as well as buttons to 
jump to the front, right, and top views.

#### `getSliders`

Should return a React component containing elements that may be used to manipulate a 
visualizer (usually, a 3-D model).


# QuaternionTarget [(view code)](https://jpiland16.github.io/jump-to-location/?repo=jpiland16/hmv_test&file=src/components/shared_visualizer_object/Visualizer.js&type=js-class&jump=QuaternionTarget)

This is a class designed to act as nodes in the representation of a model as a tree structure.
Most of the functionality is explained in the JSdoc (click the link above to view).


# ThreeJSVisualizer [(view code)](https://jpiland16.github.io/jump-to-location/?repo=jpiland16/hmv_test&file=src/components/shared_visualizer_object/Visualizer.js&type=js-class&jump=ThreeJSVisualizer)

This is a class which provides most of the basic functionality required when using 
a Three.js scene to view a 3-D model, such as loading the scene, renderer, camera, and controls.
One unusual "hack" in order to avoid an incorrectly-sized scene is that the renderer size must be 
refreshed after the model is loaded, which will usually occur *after* the `useEffect` hook has been 
called. This means that we must temporarily hold on to an element reference in order to refresh the 
renderer size.

By default, simply loads a grid onto the scene.


# ModelWithBones [(view code)](https://jpiland16.github.io/jump-to-location/?repo=jpiland16/hmv_test&file=src/components/shared_visualizer_object/Models.js&type=js-class&jump=ModelWithBones)

Extends `ThreeJSVisualizer` by providing functions to load a model from a specified path,
modify a 3-D model's appearance by recursively adjusting local quaternions through a tree traversal,
reset the 3-D model, and move to three different default camera angles.


# MannequinVisualizer [(view code)](https://jpiland16.github.io/jump-to-location/?repo=jpiland16/hmv_test&file=src/components/shared_visualizer_object/Models.js&type=js-class&jump=MannequinVisualizer)

Extends `ModelWithBones` by providing the skeletal tree as well as the correct model path.


# PhoneVisualizer [(view code)](https://jpiland16.github.io/jump-to-location/?repo=jpiland16/hmv_test&file=src/components/shared_visualizer_object/Models.js&type=js-class&jump=PhoneVisualizer)

Extends `ModelWithBones` by providing the skeletal tree (just a single bone in this case)
as well as the correct model path.
