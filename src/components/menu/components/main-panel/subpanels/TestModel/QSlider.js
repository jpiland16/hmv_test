import { Typography } from '@material-ui/core'
import Slider from '@material-ui/core/Slider'

export default function QSlider(props) {

    let sliderValue = props.sliderValues[props.title][props.index];

    return (
        <div>
            <Typography variant="caption">{["X (Q2)", "Y (Q3)", "Z (Q4)", "W (Q1)"][props.index] + ": "
             + (Math.round(sliderValue * 1000) / 1000)}</Typography>
            <Slider value={sliderValue} 
            onChange={props.onChange} min={-1.0} max={1.0} step={0.01}
            style={{ padding: "0px" }}/>
        </div>
    )

}