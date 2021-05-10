import './menu-components.css';
import IconButton from '@material-ui/core/IconButton'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import SettingsIcon from '@material-ui/icons/Settings'
import FolderIcon from '@material-ui/icons/Folder'
import Tooltip from '@material-ui/core/Tooltip'
import Zoom from '@material-ui/core/Zoom'

export default function SideActionBar(props) {
    return (
        <div className="sidebar">
            <Zoom in={props.visible} style={{ transitionDelay: props.visible ? '75ms' : '0ms' }}>
                <Tooltip title="My account" placement="right">
                    <IconButton>
                        <AccountCircleIcon />
                    </IconButton>
                </Tooltip>
            </Zoom>
            <Zoom in={props.visible} style={{ transitionDelay: props.visible ? '150ms' : '0ms' }}>
                <Tooltip title="Open data folder" placement="right">
                    <IconButton>
                        <FolderIcon />
                    </IconButton>
                </Tooltip>
            </Zoom>
            <Zoom in={props.visible} style={{ transitionDelay: props.visible ? '225ms' : '0ms' }}>
                <Tooltip title="Settings" placement="right">
                    <IconButton>
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
            </Zoom>
        </div>
    );
}