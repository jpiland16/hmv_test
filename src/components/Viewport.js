import './Viewport.css'
import Menu from './menu/Menu'
import React from 'react'
import Visualizer from './visualizer/Visualizer';

// Window resize code: see https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs

export default function Viewport() {

    const [expandedItems, setExpandedItems] = React.useState([]);
    const [selectedFile, setSelectedFile] = React.useState("");
    const [searchFileText, setSearchFileText] = React.useState("");
    const [ modelLoaded, setModelLoaded ] = React.useState(false);
    const [ bones, setBones ] = React.useState(null);
    const [ quaternionValues, updateModel ] = React.useState(null);
    const [ modelNeedsUpdating, setModelNeedsUpdating ] = React.useState(false);

    function getWindowDimensions() {
            const { innerWidth: width, innerHeight: height } = window;
            return [
                width,
                height
            ];
      }
      
    function useWindowDimensions() {
        const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());
      
        React.useEffect(() => {
            function handleResize() {
              setWindowDimensions(getWindowDimensions());
            }
        
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);
      
        return windowDimensions;
    }

    function onLoadBones(bones) {
        setBones(bones);
        let boneList = Object.getOwnPropertyNames(bones);
        let newModelState = { };
        for (let i = 0; i < boneList.length; i++) {
            let boneQ = bones[boneList[i]].quaternion;
            newModelState[boneList[i]] = [boneQ.x, boneQ.y, boneQ.z, boneQ.w];
        }
        updateModel(newModelState);
    }

    function onSliderUpdate(boneId, qIndex, newValue) {
        let newModelState = { ...quaternionValues }; // Create shallow clone of old model state
        newModelState[boneId][qIndex] = newValue;
        let newQ = newModelState[boneId];
        bones[boneId].quaternion.set(newQ[0], newQ[1], newQ[2], newQ[3]);
        updateModel(newModelState);
        setModelNeedsUpdating(true);
    }

    function batchUpdateObject(boneId, newQ) {
        let newModelState = { ...quaternionValues }; // Create shallow clone of old model state
        newModelState[boneId] = newQ;
        bones[boneId].quaternion.set(newQ[0], newQ[1], newQ[2], newQ[3]);
        updateModel(newModelState);
        setModelNeedsUpdating(true);
    }

    return (
        <div className="myView">
            <Menu expandedItems={expandedItems} 
                setExpandedItems={setExpandedItems} 
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                getWindowDimensions={useWindowDimensions}
                searchFileText={searchFileText}
                setSearchFileText={setSearchFileText}
                modelLoaded={modelLoaded}
                sliderValues={quaternionValues}
                updateModel={onSliderUpdate}
                batchUpdate={batchUpdateObject}
                bones={bones}
            />
            <Visualizer 
                modelLoaded={modelLoaded}
                setModelLoaded={setModelLoaded}
                setBones={onLoadBones}
                modelNeedsUpdating={modelNeedsUpdating}
                setModelNeedsUpdating={setModelNeedsUpdating}
            />
        </div>
    )
}