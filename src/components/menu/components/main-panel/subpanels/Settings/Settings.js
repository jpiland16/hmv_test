import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography'
import './Settings.css'

export default function Settings(props) {
  
    const handleCardChange = (event) => {
        props.setCardsPos(event.target.value);
        window.localStorage.setItem("cardsPos", event.target.value);
    };

    const handleTimeChange = (event) => {
        props.setTimeDisplay(event.target.value);
        window.localStorage.setItem("timeDisplay", event.target.value);
    };

    return (
        <div style={{display: props.display}} className="settingsDiv">
            <FormControl component="fieldset">
                <Typography variant="h6">Cards position</Typography>
                <Typography variant="caption" style={{ 
                    opacity: 0.7, 
                    display: "block", 
                    lineHeight: "1.1em", 
                    fontStyle: "italic"
                }}>
                    Cards show informational text about the dataset to the side of 
                    the model or at the bottom of the screen, if selected.
                </Typography>
                <RadioGroup aria-label="cards position" style={{ paddingLeft: "6px"}} value={props.cardsPos} onChange={handleCardChange}>
                    <FormControlLabel value="right" control={<Radio />} label="Right" />
                    <FormControlLabel value="bottom" control={<Radio />} label="Bottom" />
                    <FormControlLabel value="hidden" control={<Radio />} label="Hidden" />
                </RadioGroup>
            </FormControl>

            
            <FormControl component="fieldset" style={{marginTop: "12px"}}>
                <Typography variant="h6">Time display format</Typography>
                <Typography variant="caption" style={{ 
                    opacity: 0.7, 
                    display: "block", 
                    lineHeight: "1.1em", 
                    fontStyle: "italic"
                }}>
                    This is the format for the time display at the bottom right of the screen.
                </Typography>
                <RadioGroup aria-label="cards position" style={{ paddingLeft: "6px"}} value={props.timeDisplay} onChange={handleTimeChange}>
                    <FormControlLabel value="msm" control={<Radio />} label="M:SS.mmm (ex: 1:01.000)" />
                    <FormControlLabel value="millis" control={<Radio />} label="Milliseconds (ex: 61000)" />
                </RadioGroup>
            </FormControl>
        </div>
    );
}