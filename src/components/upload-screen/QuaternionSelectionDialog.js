import React from 'react';

// For JSdoc
import { BasicVisualizerObject } from '../shared_visualizer_object/Visualizer';

/**
 * @param {Object} props
 * @param {BasicVisualizerObject} props.visualizer
 */
export default function DialogSelect(props) {

  const [ windowDimensions, setWindowDimensions ] = React.useState(getWindowDimensions());

  const elementRef = React.useRef(null)

  const handleOK = () => {
    // props.onAccept(props.boneList, thisSlider().props.quaternionTarget.current)
    // setOpen(false);
  };

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return [
        width,
        height
    ];
}  

  const sliders = () => props.boneList.map((boneName)=>(props.visualizer.getSliders(props.quaternions, props.setQuaternions).filter((element) => element.props.quaternionTarget.shortName === boneName))[0])

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

  return (
    <div style={{width: "100%"}}>
            <div style={{height: "50vh", width: "50%", float: "left", overflowY: "auto", overflowX: "hidden"}} ref={elementRef}>
                    {props.visualizer.modelLoaded && sliders().map((slider)=>(slider))}   
            </div>
            <div style={{height: "50vh", width: "50%", float: "left", position: "relative"}} ref={elementRef}>
                {props.visualizer.component(windowDimensions)}
                {props.visualizer.getTools()}
            </div>
    </div>
  );
}