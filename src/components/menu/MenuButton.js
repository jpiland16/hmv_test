import './Menu.css'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'

function MenuButton(props) {
    return (
        <IconButton onClick={props.onClick}>
            {props.isCloseIcon ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
    );
}

export default MenuButton;