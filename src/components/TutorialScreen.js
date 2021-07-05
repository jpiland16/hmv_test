import './TutorialScreen.css';
import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import {useHistory} from 'react-router-dom'


export default function Tutorial() {
  

  const useStyles = makeStyles(() => ({
    title: {
      flexGrow: 1,
    },
  }));

  const classes = useStyles();

  const history = useHistory()

  function returnHome(){
    history.push('/')
  }
 
  return (
    
    <div style={{
      backgroundColor: 'lightskyblue',
      }} >
        <div style={{overflowY: 'auto', height: window.innerHeight}}> 
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap className={classes.title}>
            Human Activity Visualizer
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box mx={30} mb={5}>    
        <h1 style={{textAlign: 'center'}}>Getting Started</h1>
        <p>The Human Activity Visualizer is a free visualization tool that reads wearable sensor measurements from a file and displays the activities of the sensor wearer via a virtual 3D model. To try out the visualization tool on a sample dataset, click <a href="/visualizer?file=/opportunity-dataset/dataset/S4-ADL4.dat">here</a>. To view your own uploaded dataset, the guide below will explain step-by-step how to get started.</p>
        <h2>Uploading and Viewing Your Own Datasets</h2>
        <p>The Human Activity Visualizer requires a specific file format and only interprets certain types of sensor data. Before uploading your file, ensure that it meets the following format and data specifications. </p>
        <p>Your file must: </p>
        <ul>
          <li>be a .dat file</li>
          <li>be sorted into columns</li>
          <li>not contain headers</li>
        </ul>
        <p>The data in your file must:</p>
        <ul>
          <li>include time values in milliseconds</li>
          <li>include global quaternions and/or acc+mag+gyro values taken over time<ul>
              <li>Note: other measurement types can be included in the uploaded file but will be ignored</li>
            </ul>
          </li>
          <li>be ordered so that columns for any quaternion values are in WXYZ order for each sensor</li>
          <li>be ordered so that columns for any acc+mag+gyro values are in XYZ order for each sensor</li>
        </ul>
        <p>For example, the column order for a dataset containing quaternion measurements for the back and upper left arm (ULA) would be:</p>
        <table >
        <caption> Example 1</caption>
          <tbody>
            <tr >
              <td >Time (ms)</td>
              <td>BACK Quat. W</td>
              <td>BACK Quat. X</td>
              <td>BACK Quat. Y</td>
              <td>BACK Quat. Z</td>
              <td>ULA Quat. W</td>
              <td>ULA Quat. X</td>
              <td>ULA Quat. Y</td>
              <td>ULA Quat. Z</td>
            </tr>
          </tbody>
        </table>
        <p>The column order for a dataset containing acc+mag+gyro measurements for the back would be:</p>
        <table>
          <caption> Example 2</caption>
          <tbody>
            <tr>
              <td>Time (ms)</td>
              <td>BACK Acc. X</td>
              <td>BACK Acc. Y</td>
              <td>BACK Acc. Z</td>
              <td>BACK Mag. X</td>
              <td>BACK Mag. Y</td>
              <td>BACK Mag. Z</td>
              <td>BACK Gyro. X</td>
              <td>BACK Gyro. Y</td>
              <td>BACK Gyro. Z</td>
            </tr>
          </tbody>
        </table>
        <p>When the file has been correctly formatted, click the 'Upload File' button on the main page, select your file(s), and enter the necessary calibration information. For each sensor, select the sensor location, data type, and start column of each data type (indexed at zero).</p>
        <p>For Example 1, you would input:</p>
        <ul>
          <li>Time Start Column: 0</li>
          <li>Sensor Type: BACK<ul>
              <li>Data Type: Quaternion</li>
              <li>Start Column: 1</li>
            </ul>
          </li>
          <li>Sensor Type: ULA<ul>
              <li>Data Type: Quaternion</li>
              <li>Start Column: 5</li>
            </ul>
          </li>
        </ul>
        <p>For Example 2, you would input:</p>
        <ul>
          <li>Time Start Column: 0</li>
          <li>Sensor Type: BACK<ul>
              <li>Data Type: Acc+Mag+Gyro</li>
              <li>Start Column: 1</li>
            </ul>
          </li>
        </ul>
        <p>Check that all of the information has been entered correctly, and click the 'Submit" button at the bottom of the form. A landing screen will appear when the file has been successfully submitted. Select the file you want to view first and continue to the visualizer page. Once the file has downloaded, press the play button the in bottom left corner of your screen to begin the animation.</p>
        <p>To view a different upload file, click on the hamburger icon in the top left corner and you will see the file directory. In the user-uploads folder, you will be able to access any additional files you uploaded. These files are only accessible by you but will be deleted from the server after two days.</p>
        <Button color='primary' variant= 'contained' id = "submitButton" onClick={()=>returnHome()}>Return Home to Get Started</Button>

      
        </Box> 
 </div>
      
    </div>  

  );
}
