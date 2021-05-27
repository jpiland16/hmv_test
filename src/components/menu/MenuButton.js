import './Menu.css'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import IconButton from '@material-ui/core/IconButton'
// import { Tooltip } from '@material-ui/core';

function MenuButton(props) {
    return (
        // <Tooltip title={props.isCloseIcon ? "Close menu" : "Menu"} placement="right">
            <IconButton disabled={false} className="menuButton" onClick={props.onClick}>
                {props.isCloseIcon ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
        // </Tooltip>
    );
}

export default MenuButton;