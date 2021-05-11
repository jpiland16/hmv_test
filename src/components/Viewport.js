import './Viewport.css'
import Menu from './menu/Menu'
import React from 'react'

// Window resize code: see https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs

function Viewport() {

    const [expandedItems, setExpandedItems] = React.useState(["/"]);
    const [selectedFile, setSelectedFile] = React.useState("");
    const [searchFileText, setSearchFileText] = React.useState("");
  
    const updateExpanded = (nodeId) => {
        console.log(nodeId)
        const index = expandedItems.indexOf(nodeId);
        index >= 0 ? expandedItems.splice(index, 1) : expandedItems.unshift(nodeId);
        console.log(expandedItems)
    }

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
                updateExpanded={updateExpanded} 
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                getWindowDimensions={useWindowDimensions}
                searchFileText={searchFileText}
                setSearchFileText={setSearchFileText}
            />
        </div>
    )
}

export default Viewport;