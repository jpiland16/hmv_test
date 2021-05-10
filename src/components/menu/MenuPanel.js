import './Menu.css';
import Box from '@material-ui/core/Box'
import SideActionBar from './components/SideActionBar';
import MainPanel from './components/MainPanel';

export default function MenuPanel(props) {
    return (
        <Box className="menu-below-all">
            <SideActionBar visible={props.visible} />
            <MainPanel {...props}/>
        </Box>
    );
}