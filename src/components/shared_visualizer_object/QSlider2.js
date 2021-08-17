import { Typography } from '@material-ui/core'
import Slider from '@material-ui/core/Slider'

/**
 * A slider to modify a single part of the quaternion (example: the X-component).
 * 
 * @param {Object} props
 * @param {Number} props.index
 * @param {Number} props.sliderValue
 * @param {function} props.onChange
 * 
 * @component
 */
function QSlider2(props) {

    return (
        <div>
                <Typography variant="caption">{["X (Q2)", "Y (Q3)", "Z (Q4)", "W (Q1)"][props.index] + ": "
                + (Math.round(props.sliderValue * 1000) / 1000)}</Typography>
                <Slider value={props.sliderValue} 
                onChange={props.onChange} min={-1.0} max={1.0} step={0.01}
                style={{ padding: "0px" }}/>
        </div>
    )

}

export default QSlider2