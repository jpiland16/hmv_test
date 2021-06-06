import './Menu.css';
import Box from '@material-ui/core/Box'
import SideActionBar from './components/SideActionBar';
import MainPanel from './components/MainPanel';

export default function MenuPanel(props) {
    
    const panelClick = (panelId) => {
        props.setSelectedPanel(panelId);
        window.localStorage.setItem("selectedPanel", panelId)
    }
    
    return (
        <Box className="menu-below-all">
            <SideActionBar visible={props.visible} selectedPanel={props.selectedPanel} setSelected={panelClick} dev={props.dev}/>
            <MainPanel selectedPanel={props.selectedPanel} setSelected={panelClick} {...props}/>
        </Box>
    );
}