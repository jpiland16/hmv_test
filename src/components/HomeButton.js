import IconButton from '@material-ui/core/IconButton'
import { Tooltip } from '@material-ui/core';

function MenuButton(props) {
    return (
        <Tooltip title={"Return to the home page"} placement="right">
            <IconButton style={{position: "absolute", zIndex: 5}} onClick={() => window.location.href = "/"}>
                <img style={{height: "36px", margin: "-6px"}} src="/hmv-favicon-512.png" />
            </IconButton>
        </Tooltip>
    );
}

export default MenuButton;