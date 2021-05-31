import './Menu.css';
import Box from '@material-ui/core/Box'
import SideActionBar from './components/SideActionBar';
import MainPanel from './components/MainPanel';
import { useState } from 'react'

export default function MenuPanel(props) {
    const [selectedPanel, setSelectedPanel] = useState((window.localStorage.getItem("selectedPanel")) ? Number(window.localStorage.getItem("selectedPanel")) : 1);
    
    const panelClick = (panelId) => {
        setSelectedPanel(panelId);
        window.localStorage.setItem("selectedPanel", panelId)
    }
    
    return (
        <Box className="menu-below-all">
            <SideActionBar visible={props.visible} selectedPanel={selectedPanel} setSelected={panelClick}/>
            <MainPanel selectedPanel={selectedPanel} setSelected={panelClick} {...props}/>
        </Box>
    );
}