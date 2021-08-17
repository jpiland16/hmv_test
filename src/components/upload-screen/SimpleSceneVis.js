import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Slider, TextField } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import * as THREE from 'three'
import { RadioGroup, Radio } from '@material-ui/core';
import { FormLabel, FormControlLabel } from '@material-ui/core';

// For JSdoc
import { BasicVisualizerObject } from '../shared_visualizer_object/Visualizer';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const axisMap = {
  "x" : { x: 1, y: 0, z: 0},
  "y" : { x: 0, y: 1, z: 0},
  "z" : { x: 0, y: 0, z: 1}
};

/**
 * @param {Object} props
 * @param {BasicVisualizerObject} props.visualizer
 */
export default function SimpleSceneVis(props) {

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  
  const [axis, setAxis] = React.useState("x");
  const [angle, setAngle] = React.useState(0);

  const [ windowDimensions, setWindowDimensions ] = React.useState(getWindowDimensions());

  const elementRef = React.useRef(null)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOK = () => {
    props.onAccept(props.boneName, thisSlider().props.quaternionTarget.current)
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return [
        width,
        height
    ];
  }  

  const thisSlider = () => (props.visualizer.getSliders(props.quaternions, props.setQuaternions).filter((element) => element.props.quaternionTarget.shortName === props.boneName))[0]

  React.useEffect(() => {
    
    function handleResize() {
        setWindowDimensions(getWindowDimensions());
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);


  }, []); // No dependencies, so it runs only once at first render.

  function quaternionToString(q) {
      return ("(" + Math.round(q.x * 1000) / 1000 + ", " + 
      Math.round(q.y * 1000) / 1000 + ", " + 
      Math.round(q.z * 1000) / 1000 + ", " + 
      Math.round(q.w * 1000) / 1000 + ")")
  }

  React.useEffect(() => {
    let newQ = quatFromAxisAngle(axisMap[axis], angle);
    let threeQuat = new THREE.Quaternion(newQ.x, newQ.y, newQ.z, newQ.w);
  }, [axis, angle])

  const handleChangeAngle = (event, newValue) => {
    setAngle(newValue);
  }
  
  function quatFromAxisAngle(axis, angle) {
    return {
      w: Math.cos(angle / 2),
      x: axis.x * Math.sin(angle / 2),
      y: axis.y * Math.sin(angle / 2),
      z: axis.z * Math.sin(angle / 2),
    };
  }

  const handleChangeAxis = (event) => {
    setAxis(event.target.value);
  }

  return (
    <div>
      <div style={{height: "50vh", width: "100%", float: "left", position: "relative"}} ref={elementRef}>
          {props.visualizer.component(windowDimensions)}
      </div>
    </div>
  );
}