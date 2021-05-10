import './menu-components.css';
import IconButton from '@material-ui/core/IconButton'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import SettingsIcon from '@material-ui/icons/Settings'
import Zoom from '@material-ui/core/Zoom'

export default function SideActionBar(props) {
    return (
        <div className="sidebar">
            <Zoom in={props.visible} style={{ transitionDelay: props.visible ? '75ms' : '0ms' }}>
                <IconButton>
                    <AccountCircleIcon />
                </IconButton>
            </Zoom>
            <Zoom in={props.visible} style={{ transitionDelay: props.visible ? '150ms' : '0ms' }}>
                <IconButton>
                    <SettingsIcon />
                </IconButton>
            </Zoom>
        </div>
    );
}