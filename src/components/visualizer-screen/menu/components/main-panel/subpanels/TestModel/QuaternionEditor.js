import Typography from '@material-ui/core/Typography'
import QSlider from './QSlider'
import Tooltip from '@material-ui/core/Tooltip'

export default function QuaternionEditor(props) {

    const handleSliderUpdate = (quaternionId, newValue) => {

        const thisObj = props.title;
        const fixedId = quaternionId; // The one the user is dragging

        let needsKickstart = true;
        for (let i = 0; i < 4; i++) {
            if (i !== fixedId) {
                if (props.sliderValues[thisObj][i] !== 0) {
                    needsKickstart = false;
                    break;
                }
            }
        }

        if (needsKickstart) {
            props.updateModel(thisObj, (fixedId + 1) % 4, 0.01);
        }

        let targetMag = Math.sqrt(1 - Math.pow(props.sliderValues[thisObj][fixedId], 2));

        let otherSumOfSq = 0;

        for (let i = 0; i < 4; i++) {
            if (i !== fixedId) otherSumOfSq += 
                Math.pow(props.sliderValues[thisObj][i], 2); 
        }

        let wrongMag = Math.sqrt(otherSumOfSq);

        let newQarray = [];

        for (let i = 0; i < 4; i++) {
            if (i === fixedId) newQarray[i] = newValue;
            else newQarray[i] = props.sliderValues[thisObj][i] * (targetMag / wrongMag);
        }

        props.batchUpdate(thisObj, newQarray);
    }

    return (
        <div>

            <Typography>{props.title}</Typography>
            <Tooltip title={props.playTimerId.current !== 0 ? "Cannot adjust sliders while viewing pre-recorded data. Pause playback first, then try again." : ""} >
                <div style={{backgroundColor: "#eeeeee", padding: "6px"}}>
                    {[0, 1, 2, 3].map((myIndex) => 
                        <QSlider key={myIndex} index={myIndex} {...props} 
                        onChange={(event, newValue) => handleSliderUpdate(myIndex, newValue)}/>)}
                </div>
            </Tooltip>
        </div>
    );
}