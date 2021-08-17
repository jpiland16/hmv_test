import IconButton from '@material-ui/core/IconButton'
import { Tooltip } from '@material-ui/core';

/**
 * The button containing the logo of the HMV project. Only seen on the Visualizer screen.
 * 
 * @component
 */
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