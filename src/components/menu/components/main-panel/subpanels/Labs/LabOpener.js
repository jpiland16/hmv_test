import './LabOpener.css'
import IconButton from '@material-ui/core/IconButton'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Tooltip from '@material-ui/core/Tooltip'

export default function LabOpener(props) {
    return (
        <div className="opener" style={{
            border: props.openLab === props.title ? "2px solid green" : "2px solid gray"
        }}>
            <Tooltip title={props.title} placement="right">
                <div className="openerClickable" onClick={() => {
                    if (props.openLab === props.title) {
                        props.setOpenLab("");
                    } else {
                        props.setOpenLab(props.title);  
                    }
                    props.setData([]);                                          // Allow either refresh or disable
                    props.setTimeSliderValue(0);                                // Move to start
                    props.lineNumberRef.current = 0;                            // (same as above)
                    if (props.playTimerId.current !== 0) {                      // Stop playback if it is occuring
                            window.clearInterval(props.playTimerId.current);   
                            props.playTimerId.current = 0;
                            props.setPlaying(false);
                    }                           
                }}>
                    <IconButton>
                        {props.openLab === props.title ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    <div className="openerTitle">
                        <b>{props.title}</b>
                    </div>  
                </div>
            </Tooltip>
            {props.openLab === props.title ? props.children : ""}
        </div>)
}