import { Satellite } from '@material-ui/icons';
import { TabContext } from '@material-ui/lab';
import React from 'react';
import './WelcomeScreen.css';

export default function Welcome() {
    
  function submitButton(){  
      window.location.href="/visualizer"
  }  

  return (
    <div className="row " id="Body">
      <div className="medium-12 columns">
        <h2 id="Homepage">Welcome</h2>
        <a href="/visualizer" className="button">Play Around With Sliders</a>

        <div >
        <input type="file" name="file" id= "inputfile"/>  
        </div>
        
      <div>
      <button id = "submitButton" className="button" value="Submit" onClick = {()=>submitButton()}>Submit</button>
      </div>
      </div>
    </div>
  );
}