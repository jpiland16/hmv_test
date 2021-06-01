import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Tooltip from '@material-ui/core/Tooltip';

export default function HelpIcon(props) {

    return (<Tooltip title={props.tooltip} placement="top">
        <div onClick={props.onClick} style={{ cursor: "pointer", margin: "0px 0px 12px 0px", display: "inline", marginRight: "12px"}}>
            <InfoOutlinedIcon style={{ opacity: 0.7, width: "12px"}}/>
        </div>
    </Tooltip>);

}