import IconButton from '@material-ui/core/IconButton'
import { Tooltip } from '@material-ui/core';

function MenuButton(props) {
    return (
        <Tooltip title={"Return to the home page"} placement="right">
            <IconButton style={{"width": "100%"}} onClick={() => window.location.href = "/"}>
                <img style={{"width": "200%"}} src="/hmv-favicon-512.png" />
            </IconButton>
        </Tooltip>
    );
}

export default MenuButton;