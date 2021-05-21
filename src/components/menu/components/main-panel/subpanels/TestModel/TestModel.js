import QuaternionEditor from './QuaternionEditor'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import HelpIcon from '../../../../HelpIcon';

export default function TestModel(props) {
    return (
        <div style={{width: "calc(100% - 24px)"}}>
            {
            
            props.modelLoaded && props.bones && props.sliderValues ?
            
            <div>
                
                <FormControlLabel
                    control={
                    <Switch
                        checked={props.useGlobalQs}
                        onChange={(event) => {
                                props.setUseGlobalQs(event.target.checked);
                                props.refreshGlobalLocal(props.bones, event.target.checked);
                            }
                        }
                        color="primary"
                    />
                    }
                    label="Use global quaternions"
                />
                <HelpIcon tooltip="About this setting" onClick={() => window.open("https://github.com/jpiland16/hmv_test#global-vs-local-quaternions")}/>
                <Tooltip title={props.useGlobalQs ? "" : "Changes always auto-ripple when using local quaternions"} >
                    <FormControlLabel
                        control={
                        <Switch
                            checked={props.useGlobalQs ? props.useRipple : "true"}
                            onChange={(event) => {
                                    if(props.useGlobalQs) props.setUseRipple(event.target.checked);
                                }
                            }
                            disabled={!props.useGlobalQs}
                            color="primary"
                        />
                        }
                        label="Changes to parent auto-ripple to children"
                    />
                </Tooltip>
                <HelpIcon tooltip="About this setting" onClick={() => window.open("https://github.com/jpiland16/hmv_test#auto-ripple")}/>

                {

                Object.keys(props.bones).map((boneId) => {
                        return (<div>
                                    <QuaternionEditor {...props} title={boneId} />
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