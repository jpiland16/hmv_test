import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default function Settings(props) {
  
    const handleChange = (event) => {
        props.setCardsPos(event.target.value);
    };

    return (
        <div style={{display: props.display}}>
            <FormControl component="fieldset">
                <FormLabel component="legend">Cards position</FormLabel>
                <RadioGroup aria-label="cards position" value={props.cardsPos} onChange={handleChange}>
                    <FormControlLabel value="bottom" control={<Radio />} label="Bottom" />
                    <FormControlLabel value="right" control={<Radio />} label="Right" />
                    <FormControlLabel value="hidden" control={<Radio />} label="Hidden" />
                </RadioGroup>
            </FormControl>
        </div>
    );
}