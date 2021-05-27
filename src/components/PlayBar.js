import React from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import Slider from '@material-ui/core/Slider'
import IconButton from '@material-ui/core/IconButton';
import './PlayBar.css'

export default function PlayBar(props) {

    const playAdvance = () => {

        let lineNumber = props.lineNumberRef.current;

        if (lineNumber < props.data.current.length - 1) {
            setLineNum(++lineNumber);
        } else {
            if (!props.repeat.current) {
                window.clearInterval(props.playTimerId.current);
                props.playTimerId.current = 0;
                setLineNum(props.lineNumberRef.current);
                props.setPlaying(false);
            } else {
                setLineNum(0);
            }
        }
        
    }

    const setLineNum = (n) => {
        props.setTimeSliderValue(n);
        props.lineNumberRef.current = n;
    }

    return (
        <div className="playBar" style={{ 
            left: props.menuIsOpen && props.getWindowDimensions()[0] > 768 ? "40vw" : "0px",
            width: props.menuIsOpen && props.getWindowDimensions()[0] > 768 ? "60%" : "100%" }}>
            <IconButton disabled={props.disabled} style={{ marginRight: "12px", marginTop: "2px" }} onClick={ () => {
                if(props.playTimerId.current !== 0) {
                    setLineNum(props.lineNumberRef.current);
                    window.clearInterval(props.playTimerId.current);
                    props.playTimerId.current = 0;
                    props.setPlaying(false);
                } else {
                    if (props.lineNumberRef.current === props.data.current.length - 1) setLineNum(0);
                    else setLineNum(props.lineNumberRef.current);
                    props.playTimerId.current = (
                        window.setInterval(playAdvance, 1000 / props.FPS.current));
                    props.setPlaying(true)
                }
            } }>
                { props.playing ? <PauseIcon /> : <PlayArrowIcon /> }
            </IconButton>
            <Slider disabled={props.disabled} min={0} max={props.data.current.length - 1} value={props.timeSliderValue} 
                onChange={(event, newValue) => setLineNum(newValue)} 
                style={{width: "calc(100% - 84px - 72px)"}}/>
            <div className="timeStamp">
                { props.data.current.length > 0 ? props.data.current[props.timeSliderValue][0] : "#######"}
            </div>
        </div>
    )
}