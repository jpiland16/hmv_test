import React from 'react';
import { Grid } from '@material-ui/core';
import {Button } from '@material-ui/core';
import { MannequinVisualizer } from '../shared_visualizer_object/Models';
import * as THREE from 'three'

const mannequinVisualizer = new MannequinVisualizer()
mannequinVisualizer.initialize((progress) => {})
mannequinVisualizer.showSliders = true

export default function QuaternionCalibrationForm(props) {

const [modelQuaternions, setModelQuaternions] = React.useState({})

const boneList=props.sensorList.map((sensor) => (sensor.bone))

const newSensorList=[...props.sensorList]

const setQuaternions = (newQObj) => {
  setModelQuaternions(newQObj)
} 
      
function handleSubmit() {
  let newQuaternions=sliders().map((slide)=>slide.props.quaternionTarget.current)
  newSensorList.forEach((sensor, index) => {
    sensor.localTransformQuaternion = new THREE.Quaternion().copy(newQuaternions[index])
  });
  props.setSensorList(newSensorList)
  console.log(props.sensorList)
  props.setSubmit(true)
}

const [ windowDimensions, setWindowDimensions ] = React.useState(getWindowDimensions());

const elementRef = React.useRef(null)
  
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return [
      width,
      height
  ];
}  
    
const sliders = () => boneList.map((boneName)=>(mannequinVisualizer.getSliders(modelQuaternions, setQuaternions).filter((element) => element.props.quaternionTarget.shortName === boneName))[0])

React.useEffect(() => {
  
  function handleResize() {
      setWindowDimensions(getWindowDimensions());
  }
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);


}, []); // No dependencies, so it runs only once at first render.

return <div>
<Grid container justify="center">
    <Grid item xs='12'>
            <div style={{width: "100%"}}>
                <div style={{height: "50vh", width: "50%", float: "left", overflowY: "auto", overflowX: "hidden"}} ref={elementRef}>
                        {mannequinVisualizer.modelLoaded && sliders().map((slider)=>(slider))}   
                </div>
                <div style={{height: "50vh", width: "50%", float: "left", position: "relative"}} ref={elementRef}>
                    {mannequinVisualizer.component(windowDimensions)}
                    {mannequinVisualizer.getTools()}
                </div>
            </div>
    </Grid>
</Grid>
<div style={{display:"flex", justifyContent: "flex-end", marginTop:"2%"}}>
  <Button color="primary" variant="contained" onClick={()=>{handleSubmit()}}>Submit</Button>
</div>
</div>
}
    