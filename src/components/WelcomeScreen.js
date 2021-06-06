import { Satellite } from '@material-ui/icons';
import { TabContext } from '@material-ui/lab';
import React from 'react';
import './WelcomeScreen.css';
import {useHistory} from 'react-router-dom'
import useStore from '../fileStore'

export default function Welcome(props) {
   const history = useHistory() 

   const {setSource} = useStore()

  // function submitButton(props){
  //   props.setSource("https://raw.githubusercontent.com/jpiland16/hmv_test/master/files/demo/S4-ADL4.dat")
  //   history.push("/visualizer/dev") 
  // }   

  function submitButton(props){
    setSource("https://raw.githubusercontent.com/jpiland16/hmv_test/master/files/demo/S4-ADL4.dat")
    history.push("/visualizer/dev") 
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
        <button id = "submitButton" className="button" onClick = {()=>submitButton(props)}>Submit</button>
        </div>
      </div>
    </div>
  );
}
