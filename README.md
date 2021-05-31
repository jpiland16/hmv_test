# hmv_test  | [_launch website_](http://vcm-20389.vm.duke.edu/)

human model visualizer project, 2021

### Authors *(alphabetically)*

 - [Jonathan Piland](https://github.com/jpiland16)
 - [Samuel Thompson](https://github.com/samuel-thompsonn)
 - [Sophie Williams](https://github.com/sosophiemw)

> Note: some concepts were reused from [HumanSkeletonVisualizer](https://github.com/karendeng00/HumanSkeletonVisualizer/) by (karendeng00)[https://github.com/karendeng00] and (charlottemcc)[https://github.com/charlottemcc].

### Getting started:
 - `git clone`
 - `npm install`
 - `node server` or `pm2 start server.js`

## Specific notes

### Global vs. local quaternions

By default, setting an object's quaternion in Three.js is done relative to its parent's coordinate frame. However, it is also possible to set an objects orientation with respect to the world coordinate frame; however, this requires quaternion multiplication in order to convert a local orientation to a global orientation and vice versa. 

#### Example

Suppose an object *M* has local orientation *Q<sub>L</sub>* with respect to its parent. This parent has orientation *Q<sub>n</sub>* relative to *Q<sub>n-1</sub>* relative to ... relative to the root, *Q<sub>1</sub>*.

Then the net orientation of *M* relative to the world is the result of repeatedly left-applying parent rotations to the child rotation until you reach the __world orientation__, *Q<sub>W</sub>*, i.e.:

*Q<sub>W</sub>* = *Q<sub>1</sub>Q<sub>2</sub> &times; ... &times; Q<sub>n-1</sub>Q<sub>n</sub>Q<sub>L</sub>* &nbsp; *(converts local orientation to world orientation)*

and thus we can also obtain

*Q<sub>L</sub>* = *Q<sub>n</sub><sup>-1</sup>Q<sub>n-1</sub><sup>-1</sup>* &times; ... &times; *Q<sub>2</sub><sup>-1</sup>Q<sub>1</sub><sup>-1</sup>Q<sub>W</sub>* &nbsp; *(converts world orientation to local orientation)*

These functions are implemented as [`getGlobalFromLocal`](https://github.com/jpiland16/hmv_test/blob/master/src/components/Viewport.js#L160-L170) and [`getLocalFromGlobal`](https://github.com/jpiland16/hmv_test/blob/master/src/components/Viewport.js#L172-L184), respectively, in [Viewport.js](https://github.com/jpiland16/hmv_test/blob/master/src/components/Viewport.js).

### Auto ripple

The auto-ripple feature is purely a matter of convenience that simulates character animation. For testing purposes, enabling this option allows a user-requested orientation change of a parent to affect the orientations of all child objects. (This option would most likely need to be disabled when reading from a dataset.) 

Auto-ripple is accomplished by keeping the local quaternions of children constant during a reorientation of the parent. This causes behavior of the UI that might be slightly unintuitive:

 - When using **global quaternions**, auto-ripple has the effect of changing child quaternions (so you will see multiple sets of sliders move if the target object has any children.) Disabling auto-ripple means *child global quaternions* are not programatically affected by changing *parent global quaternions*.

 - When using **local quaternions**, auto-ripple has the effect of keeping child quaternions constant. Disabling auto-ripple means *child local quaternions* **WILL BE** programatically affected by changing *parent local quaternions*.

Note: All slider values are converted to global quaternions in [Viewport.js](https://github.com/jpiland16/hmv_test/blob/master/src/components/Viewport.js).