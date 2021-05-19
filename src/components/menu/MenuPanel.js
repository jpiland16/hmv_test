import './Menu.css';
import Box from '@material-ui/core/Box'
import SideActionBar from './components/SideActionBar';
import MainPanel from './components/MainPanel';
import { useState } from 'react'

export default function MenuPanel(props) {
    const [selectedPanel, setSelectedPanel] = useState(1);
    return (
        <Box className="menu-below-all">
            <SideActionBar visible={props.visible} selectedPanel={selectedPanel} setSelected={(panel) => setSelectedPanel(panel) }/>
            <MainPanel selectedPanel={selectedPanel} setSelected={setSelectedPanel} {...props}/>
        </Box>
    );
}