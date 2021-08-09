import './Menu.css'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import IconButton from '@material-ui/core/IconButton'
// import { Tooltip } from '@material-ui/core';

function MenuButton(props) {
    return (
        // <Tooltip title={props.isCloseIcon ? "Close menu" : "Menu"} placement="right">
            <IconButton disabled={props.disabled} className="menuButton" onClick={props.onClick} style={{backgroundColor: "rgba(0.5, 0.5, 0.5, 0.12)", margin: "4px", padding: "8px"}}>
                {props.isCloseIcon ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
        // </Tooltip>
    );
}

export default MenuButton;