import './Viewport.css'
import Menu from './menu/Menu'
import React from 'react'

function Viewport() {

    const [expandedItems, setExpandedItems] = React.useState(["/"])
  
    const updateExpanded = (nodeId) => {
        const index = expandedItems.indexOf(nodeId);
        index >= 0 ? expandedItems.splice(index, 1) : expandedItems.unshift(nodeId);
    }

    return (
        <div className="myView">
            <Menu expandeditems={expandedItems} updateexpanded={updateExpanded} />
        </div>
    )
}

export default Viewport;