import QuaternionEditor from './QuaternionEditor'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import HelpIcon from '../../../../HelpIcon';
import Button from '@material-ui/core/Button'

export default function TestModel(props) {
    return (
        <div style={{width: "calc(100% - 30px)", marginTop: "12px", marginLeft: "6px", display: props.display}}>
            {(props.visualizer.showSliders = true) && props.visualizer.getSliders()}
        </div>
    );
}