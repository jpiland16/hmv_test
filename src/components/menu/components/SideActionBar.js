import './menu-components.css';
import IconButton from '@material-ui/core/IconButton'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import SettingsIcon from '@material-ui/icons/Settings'
import InfoIcon from '@material-ui/icons/Info'
import Tooltip from '@material-ui/core/Tooltip'
import Zoom from '@material-ui/core/Zoom'
import FileCopyIcon from '@material-ui/icons/FileCopy';
import TuneIcon from '@material-ui/icons/Tune';

export default function SideActionBar(props) {
    return (
        <div className="sidebar">             
            <Zoom in={props.visible} style={{ transitionDelay: props.visible ? '50ms' : '0ms' }}>
                <Tooltip title="Choose files" placement="right">
                    <IconButton style={{
                        marginTop: "48px"
                    }} color={props.selectedPanel == 0 ? "primary" : "default"} onClick={() => props.setSelected(0)}>
                        <FileCopyIcon />
                    </IconButton>
                </Tooltip>
            </Zoom>
            <Zoom in={props.visible} style={{ transitionDelay: props.visible ? '100ms' : '0ms' }}>
                <Tooltip title="Test model" placement="right">
                    <IconButton color={props.selectedPanel == 1 ? "primary" : "default"} onClick={() => props.setSelected(1)}>
                        <TuneIcon />
                    </IconButton>
                </Tooltip>
            </Zoom>
            <Zoom in={props.visible} style={{ transitionDelay: props.visible ? '150ms' : '0ms' }}>
                <Tooltip title="My account" placement="right">
                    <IconButton color={props.selectedPanel == 2 ? "primary" : "default"} onClick={() => props.setSelected(2)}>
                        <AccountCircleIcon />
                    </IconButton>
                </Tooltip>
            </Zoom>
            <Zoom in={props.visible} style={{ transitionDelay: props.visible ? '200ms' : '0ms' }}>
                <Tooltip title="Settings" placement="right">
                    <IconButton color={props.selectedPanel == 3 ? "primary" : "default"} onClick={() => props.setSelected(3)}>
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
            </Zoom>
            <div className="infoIcon">
                <Tooltip title="About" placement="right">
                    <IconButton color={props.selectedPanel == 4 ? "primary" : "default"} onClick={() => props.setSelected(4)}>
                        <InfoIcon />
                    </IconButton>
                </Tooltip>
            </div> 
        </div>
    );
}