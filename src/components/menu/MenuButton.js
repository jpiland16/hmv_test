import './Menu.css'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
// import { Tooltip } from '@material-ui/core';

function MenuButton(props) {
    return (
        // <Tooltip title={props.isCloseIcon ? "Close menu" : "Menu"} placement="right">
            <IconButton disabled={props.disabled} className="menuButton" onClick={props.onClick}>
                {props.isCloseIcon ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
        // </Tooltip>
    );
}

export default MenuButton;