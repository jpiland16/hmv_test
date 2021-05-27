import QuaternionEditor from './QuaternionEditor'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import HelpIcon from '../../../../HelpIcon';
import Button from '@material-ui/core/Button'

export default function TestModel(props) {
    return (
        <div style={{width: "calc(100% - 30px)", marginTop: "12px", marginLeft: "6px", display: props.display}}>
            {
            
            props.modelLoaded && props.bones && props.sliderValues ?
            
            <div>
                <Tooltip title={props.playTimerId.current !== 0 ? "Cannot reset model while viewing pre-recorded data. Pause playback first, then try again." : ""} >
                    <div>
                        <Button
                            color="secondary"
                            variant="contained"
                            disabled={props.playTimerId.current !== 0}
                            onClick={() => props.resetModel()}
                        >
                            Reset model
                        </Button>
                    </div>
                </Tooltip>
                <Tooltip title={props.playTimerId.current !== 0 ? "Cannot change this setting while viewing pre-recorded data. Pause playback first, then try again." : ""} >
                    <FormControlLabel
                        control={
                        <Switch
                            checked={props.useGlobalQs.current}
                            onChange={(event) => {
                                    props.useGlobalQs.current = event.target.checked;
                                    props.refreshGlobalLocal(props.bones, event.target.checked);
                                }
                            }
                            color="primary"
                            disabled={props.playTimerId.current !== 0}
                        />
                        }
                        label="Use global quaternions"
                    />
                </Tooltip>
                <HelpIcon tooltip="About this setting" onClick={() => window.open("https://github.com/jpiland16/hmv_test#global-vs-local-quaternions")}/>
                <Tooltip title={props.playTimerId.current !== 0 ? "Cannot change this setting while viewing pre-recorded data. Pause playback first, then try again." : ""} >
                    <FormControlLabel
                        control={
                        <Switch
                            checked={props.useRipple.current}
                            onChange={(event) => props.useRipple.current = event.target.checked }
                            color="primary"
                            disabled={props.playTimerId.current !== 0}
                        />
                        }
                        label="Changes to parent auto-ripple to children"
                    />
                </Tooltip>
                <HelpIcon tooltip="About this setting" onClick={() => window.open("https://github.com/jpiland16/hmv_test#auto-ripple")}/>

                {

                Object.keys(props.bones).map((boneId) => {
                        return (<div key={boneId + "div"} >
                                    <QuaternionEditor {...props} key={boneId + "editor"}   title={boneId} />
                                </div>)
                }) 

                }

            </div>

            :

            "Model not yet loaded. Please wait..."
            
            }

        </div>
    );
}