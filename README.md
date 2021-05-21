# hmv_test  | [_launch website_](https://jpiland16.github.io/hmv_test/)

testing page for human model visualizer

## Specific notes

### Global vs. local quaternions

By default, setting an object's quaternion in Three.js is done relative to its parent's coordinate frame. However, it is also possible to set an objects orientation with respect to the world coordinate frame; however, this requires quaternion multiplication in order to convert a local orientation to a global orientation and vice versa. 

#### Example

Suppose an object *M* has local orientation *Q<sub>L</sub>* with respect to its parent. This parent has orientation *Q<sub>n</sub>* relative to *Q<sub>n-1</sub>* relative to ... relative to the root, *Q<sub>1</sub>*.

Then the net orientation of *M* relative to the world is the result of repeatedly left-applying parent rotations to the child rotation until you reach the __world orientation__, *Q<sub>W</sub>*, i.e.:

*Q<sub>W</sub>* = *Q<sub>1</sub>Q<sub>2</sub> &times; ... &times; Q<sub>n-1</sub>Q<sub>n</sub>Q<sub>L</sub>* &nbsp; *(converts local orientation to world orientation)*

and thus we can also obtain

*Q<sub>L</sub>* = *Q<sub>n</sub><sup>-1</sup>Q<sub>n-1</sub><sup>-1</sup>* &times; ... &times; *Q<sub>2</sub><sup>-1</sup>Q<sub>1</sub><sup>-1</sup>Q<sub>W</sub>* &nbsp; *(converts world orientation to local orientation)*

These functions are implemented as [`getGlobalFromLocal`](https://github.com/jpiland16/hmv_test/blob/master/src/components/Viewport.js#L136-L145) and [`getLocalFromGlobal`](https://github.com/jpiland16/hmv_test/blob/master/src/components/Viewport.js#L147-L159), respectively, in [Viewport.js](https://github.com/jpiland16/hmv_test/blob/master/src/components/Viewport.js).

### Auto ripple

The auto-ripple feature is purely a matter of convenience when using global quaternions. For testing purposes, enabling this option allows a user-requested orientation change of a parent to affect the orientations of all child objects. (This option would most likely need to be disabled when reading from a dataset.) 

Auto-ripple is accomplished by keeping the local quaternions of children constant during a reorientation of the parent. (This is the default behavior of Three.js, and is the reason why it cannot be disabled when using local coordinates.)