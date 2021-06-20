import './TopActionBar.css'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import CancelIcon from '@material-ui/icons/Cancel';
import Tooltip from '@material-ui/core/Tooltip'

export default function TopActionBar(props) {
    return (
        <div className="topBar"style={{ 
            left: props.menuIsOpen && props.getWindowDimensions()[0] > 768 ? "40vw" : "48px",
            width: props.cardsPos !== 'right' ?
                props.menuIsOpen && props.getWindowDimensions()[0] > 768 ? "60%" : "calc(100% - 48px)" 
                : props.menuIsOpen && props.getWindowDimensions()[0] > 768 ? "calc(60% - 28vw)" : "calc(100% - 28vw - 48px)" 
        }}> 
            <Tooltip placement="bottom" title={props.modelLoaded ? "Click to choose file" : "Please wait for the model to load"}>
                <Typography className="fileName" style={{marginRight: "12px"}}
                    onClick={() => {
                        if (props.modelLoaded) {
                            props.setMenuIsOpen(true);
                            props.setSelectedPanel(0);
                        }
                }} >
                    {props.selectedFile === "" ? "No file selected." : <span><b>Viewing: </b>{(props.selectedFile.length > 16 ? "..." : "") + props.selectedFile.substr(-16)}</span>}
                </Typography>
            </Tooltip>
            <Button disabled={!props.modelLoaded} className="topBtn" onClick={() => {
                        if(props.selectedFile === "") {
                            props.setMenuIsOpen(true);
                            props.setSelectedPanel(0);
                        } else {
                            //if(window.confirm("Are you sure you want to close the file " + props.selectedFile + "?")) 
                                window.history.replaceState(null, null, "?") || props.onSelectFileChange("")
                        }
            }} size="small">
                { props.selectedFile === "" ?
                    <div style={{display: "flex", alignItems: "center"}}>
                        <FolderOpenIcon style={{marginRight: "6px"}}/>
                        Choose a file
                    </div>
                :   <div style={{display: "flex", alignItems: "center"}}>
                        Close file
                        <CancelIcon fontSize="small" style={{marginLeft: "6px"}}/>
                    </div>
                }    
            </Button>
        </div>
    )
}