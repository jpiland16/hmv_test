import React from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import Slider from '@material-ui/core/Slider'
import IconButton from '@material-ui/core/IconButton';
import { Tooltip } from '@material-ui/core';
import './PlayBar.css'

/**
 * Convert milliseconds into a string of minutes, seconds, and milliseconds.
 * The output is of the format MM:SS.mmm.
 * 
 * @param {Number} time - time in milliseconds
 * 
 * @category Client-side functions
 */
function getTimeStringFromMillis(time) {
    let millis = time % 1000;
    let allSeconds = (time - millis) / 1000;
    let displaySeconds = allSeconds % 60;
    let displayMinutes = (allSeconds - displaySeconds) / 60;
    return `${displayMinutes}:${displaySeconds < 10 ? "0" : ""}${displaySeconds}.${millis < 100 ? "0" : ""}${millis < 10 ? "0" : ""}${millis}`;
}

/**
 * 
 * The slider at the bottom of the screen.
 * 
 * @component
 * 
 * @param {object} props
 * @param {object} props.lineNumberRef - the lineNumber stored as a mutable
 *  React ref
 * @param {Number} props.lineNumberRef.current - the current line number
 * @param {Number} props.timeSliderValue - the line number as stored in state
 * @param {function} props.setTimeSliderValue - method to change the state of the line number
 * 
 * @param {string} props.timeSliderValue - either "millis" or "msm"
 * @param {function} props.setTimeSliderValue - a method to change the time display state
 * 
 * @param {Object} props.repeat - Whether to repeat once reaching the end of the file (React ref)
 * @param {boolean} props.repeat.current
 * 
 * @param {Object} props.playTimerId - React ref containing current ID of a window interval, or -1
 * @param {Number} props.playTimerId.current
 * @param {boolean} props.playing - whether the PlayBar is moving, stored in state
 * @param {function} props.setPlaying - function to set whether the PlayBar is moving or not
 * 
 * @param {Object} props.data - mutable React ref containing current data
 * @param {Array} props.data.current - the downloaded data from the server 
 * (used here only to know number of lines)
 * 
 * @param {boolean} props.disabled - whether the PlayBar should be disabled
 * @param {boolean} props.toolTipOpen - whether the "Select a file" tooltip is showing
 * @param {function} props.setTipOpen - a function to set whether the tooltip is showing 
 * 
 */
function PlayBar(props) {

    /**
     * Whenever the user's mouse leaves the PlayBar.
     */
    const handleToolTipClose = () => {
      props.setTipOpen(false);
    };
    
    /**
     * Whenever the user's mouse comes over the PlayBar.
     */
    const handleToolTipOpen = () => {
        if (props.disabled){
            props.setTipOpen(true);
       };
      
    };

    /**
     * Function that is called repeatedly using setInterval.
     */
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

    /**
     * Helper method to set line numbers, both as refs and in state.
     */
    const setLineNum = (n) => {
        if (props.verbose) console.log("Setting time slider value to " + n);
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
                            // IF PLAYING
                            // playTimerId is nonzero whenever the PlayBar is moving (whenever there is an active window.setInterval)
                            setLineNum(props.lineNumberRef.current);
                            window.clearInterval(props.playTimerId.current);
                            props.playTimerId.current = 0;
                            props.setPlaying(false);
                        } else {
                            // IF PAUSED
                            if (props.lineNumberRef.current === props.data.current.length - 1) {
                                // If paused at the end of the file, restart from the beginning when the user clicks the play button
                                setLineNum(0);
                            } else setLineNum(props.lineNumberRef.current);
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

export default PlayBar