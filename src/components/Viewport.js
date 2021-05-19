import './Viewport.css'
import Menu from './menu/Menu'
import React from 'react'
import Visualizer from './visualizer/Visualizer';

// Window resize code: see https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs

export default function Viewport() {

    const [expandedItems, setExpandedItems] = React.useState(["/"]);
    const [selectedFile, setSelectedFile] = React.useState("");
    const [searchFileText, setSearchFileText] = React.useState("");

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
    

    return (
        <div className="myView">
            <Menu expandedItems={expandedItems} 
                setExpandedItems={setExpandedItems} 
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                getWindowDimensions={useWindowDimensions}
                searchFileText={searchFileText}
                setSearchFileText={setSearchFileText}
            />
            <Visualizer />
        </div>
    )
}