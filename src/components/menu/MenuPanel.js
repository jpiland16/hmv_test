import './Menu.css';
import Box from '@material-ui/core/Box'
import SideActionBar from './components/SideActionBar';
import MainPanel from './components/MainPanel';
import { useState } from 'react'

export default function MenuPanel(props) {
    const [selectedPanel, setSelectedPanel] = useState(0);
    
    const panelClick = (panelId) => {
        setSelectedPanel(panelId);
        window.localStorage.setItem("selectedPanel", panelId)
    }
    
    return (
        <Box className="menu-below-all">
            <SideActionBar visible={props.visible} selectedPanel={selectedPanel} setSelected={panelClick} dev={props.dev}/>
            <MainPanel selectedPanel={selectedPanel} setSelected={panelClick} {...props}/>
        </Box>
    );
}