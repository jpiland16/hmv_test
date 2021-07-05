import React from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import Slider from '@material-ui/core/Slider'
import IconButton from '@material-ui/core/IconButton';
import { Tooltip } from '@material-ui/core';
import './PlayBar.css'

function getTimeStringFromMillis(time) {
    let millis = time % 1000;
    let allSeconds = (time - millis) / 1000;
    let displaySeconds = allSeconds % 60;
    let displayMinutes = (allSeconds - displaySeconds) / 60;
    return `${displayMinutes}:${displaySeconds < 10 ? "0" : ""}${displaySeconds}.${millis < 100 ? "0" : ""}${millis < 10 ? "0" : ""}${millis}`;
}

export default function PlayBar(props) {

    const handleToolTipClose = () => {
      props.setTipOpen(false);
    };
  
    const handleToolTipOpen = () => {
        if (props.disabled){
            props.setTipOpen(true);
       };
      
    };

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
            <Tooltip title="Select a file to play" open={props.toolTipOpen} onClose={handleToolTipClose} onOpen={handleToolTipOpen}> 
                <span>
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
                </span>
            </Tooltip>
            <Slider disabled={props.disabled} min={0} max={props.data.current.length - 1} value={props.timeSliderValue} 
                onChange={(event, newValue) => setLineNum(newValue)} 
                style={{width: "calc(100% - 84px - 72px)"}}/>
            <div title="click to change format" className="timeStamp" style={{cursor: "pointer"}} onClick={() => {
                    let newTimeDisplay = props.timeDisplay === 'millis' ? 'msm' : "millis";
                    props.setTimeDisplay(newTimeDisplay);
                    window.localStorage.setItem("timeDisplay", newTimeDisplay);
                }
            }>
                { props.timeDisplay === 'millis' ?
                    props.data.current.length > 0 ? props.data.current[props.timeSliderValue][0] : "#######"
                    : props.data.current.length > 0 ? getTimeStringFromMillis(props.data.current[props.timeSliderValue][0]) : "##:##.###"
                } 
            </div>
        </div>
    )
}