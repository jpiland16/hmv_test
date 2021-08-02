import React, { useEffect } from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import ReplayIcon from '@material-ui/icons/Replay';
import Slider from '@material-ui/core/Slider'
import IconButton from '@material-ui/core/IconButton';
import './PlayBarAlt.css'

function getTimeStringFromMillis(time) {
    let millis = time % 1000;
    let allSeconds = (time - millis) / 1000;
    let displaySeconds = allSeconds % 60;
    let displayMinutes = (allSeconds - displaySeconds) / 60;
    return `${displayMinutes}:${displaySeconds < 10 ? "0" : ""}${displaySeconds}.${millis < 100 ? "0" : ""}${millis < 10 ? "0" : ""}${millis}`;
}

export default function PlayBarAlt(props) {

    let maxIndex = props.values.length - 1;

    const [playing, setPlaying] = React.useState(false);
    const [onHold, setHold] = React.useState(false);

    const handleChangeIndex = (event, newIndex) => {
        props.onChangeIndex(newIndex);
        setHold(true);
    }

    // source: https://stackoverflow.com/questions/40885923/countdown-timer-in-react
    const handleStart = () => {
        if (props.index === maxIndex) { props.onChangeIndex(0); }
        setPlaying(true);
    }

    const handleStop = () => {
        setPlaying(false);
    }

    function shouldPlay() {
        return (playing && !onHold);
    }

    // React.useEffect(() => {
    //     props.onChange && props.index <= maxIndex && props.onChange(index, props.values[index]);
    // }, [index])

    useInterval(() => {
        if (props.index < maxIndex) {
            props.onChangeIndex(props.index + 1);
            return; 
        }
        if (props.loop) { 
            props.onChangeIndex(0);
        }
        else {
            setPlaying(false);
        }
    }, shouldPlay()? 1000 / props.FPS : null);

    return (
        <div className="playBarAlt">
            <div className="buttonContainer">
                <IconButton 
                    onClick={()=>{(!playing? handleStart() : handleStop())}}>
                    { playing ? <PauseIcon /> : (props.index === maxIndex && !props.loop) ? <ReplayIcon/> : <PlayArrowIcon /> }
                </IconButton>
            </div>
            <div className="sliderContainer">
                <Slider min={0} max={maxIndex} value={props.index} onChange={handleChangeIndex} onChangeCommitted = {()=>setHold(false)}/>
            </div>
            <div className="timeStamp">
                {props.timeDisplay === "millis"?
                    props.values[props.index] :
                    getTimeStringFromMillis(props.values[props.index])
                }
            </div>
        </div>
    )
}

// source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
    const savedCallback = React.useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        // I really don't understand why this declaration is necessary. Is it because savedCallback.current is modified at some point?
        // And by that I mean that the CURRENT VALUE of it is modified, since saving a reference to savedCallback.current also
        // causes the same problem (the [callback] useEffect is never activated).
        let tick = () => { savedCallback.current(); }
        if (delay !== null) {
            let intervalID = setInterval(tick, delay);
            return () => clearInterval(intervalID);
        }
    }, [delay]);
}