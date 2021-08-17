import './TutorialScreen.css';
import TitleBar from '../TitleBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import example1 from './example1.PNG'
import example2 from './example2.PNG'
import example3 from './example3.PNG'
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

  function upload(){
    history.push('/upload')
  }
 
  return (
    
    <div style={{
      backgroundColor: 'lightskyblue',
      }} >
        <div style={{overflowY: 'auto', height: '100vh'}}> 
      <TitleBar classes={classes} />
      <Box mx='20%' mb='20px'>    
        <h1 style={{textAlign: 'center'}}>Getting Started</h1>
        <p>The Human Activity Visualizer is a free visualization tool that reads wearable sensor measurements from a file and displays the activities of the sensor wearer via a virtual 3D model. To try out the visualization tool on a sample dataset, click <a href="/visualizer?file=/opportunity-dataset/dataset/S4-ADL4.dat">here</a>. To view your own uploaded dataset, the guide below will explain step-by-step how to get started.</p>
        <h2>Sensor Requirements</h2>
        <p>The Human Activity Visualizer requires standardized sensor positions and orientations to ensure that your dataset is portrayed correctly. Check that each sensor corresponds with one of the following placement options: </p>
        <center>
        <table>
          <tbody>
          <tr>
              <td><b>Sensor Location</b></td>
              <td><b>Abbreviation</b></td>
            </tr>
            <tr>
            <td>Right Upper Arm</td>
              <td>RUA</td>
             
            </tr>
            <tr>
              
            <td>Right Lower Arm (forearm)</td>
              <td>RLA</td>
            </tr>
            <tr>
              
            <td>Left Upper Arm</td>
              <td>LUA</td>
            </tr>
            <tr>
              
            <td>Left Lower Arm (forearm)</td>
              <td>LLA</td>
            </tr>
            <tr>
              
            <td>Upper Back</td>
              <td>BACK</td>
            </tr>
            <tr>
              
            <td>Global Orientation of Model (typically given same data as BACK)</td>
              <td>ROOT</td>
            </tr>
          </tbody>
        </table>
        </center>
       
        <h2>File and Data Requirements</h2>
        <p>The Human Activity Visualizer requires a specific file format and only interprets certain types of sensor data. Before uploading your file, ensure that it meets the following format and data specifications. </p>
        <p>Your file must: </p>
        <ul>
          <li>be a .dat file</li>
          <li>be sorted into space-separated columns</li>
          <li>not contain headers</li>
        </ul>
        <p>The data in your file must:</p>
        <ul>
          <li>include time values in milliseconds</li>
          <li>include global quaternions, euler angles, or acc+mag+gyro values taken over time<ul>
              <li>Note: other measurement types can be included in the uploaded file but will be ignored</li>
            </ul>
          </li>
          <li>be multiplied by 1000</li>
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

           
        <h2>Uploading and Viewing Your Own Datasets</h2>
        <p>When the file has been correctly formatted, click the 'Upload File' button on the main page, select your file(s), and enter the necessary calibration information. For each sensor, select the sensor location, data type, and start column of each data type (indexed at zero).</p>
        
        <center>
        <p>For Example 1, you would input the following:</p>
        <img src={example1} width='50%'/>
        </center>
        
        <center>
        <p>For Example 2, you would input the following:</p>
        <img src={example2} width='50%'/> 
        </center>
        <p>Check that all of the information has been entered correctly, and click the 'Next' button at the bottom of the form and you will be taken the Quaternion Calibration screen. Here there will be a slider for each bone 
          you selected in the last screen. </p>
          <center>
        <img src={example3} width='50%'/> 
        </center>
          <p>Use these sliders to set the identity or 'no rotation' position of the model. In terms of sensors, the 'no rotation' 
          position is where the local coordinate system of each sensor is aligned with the global coordinate system. For example, if the
          x-axis of the sensor points down a person's arm, the model must be transformed so its arm is pointing down the global x-axis. In this program, the positive x-axis points right, the y-axis points up, and the z-axis points out of the screen.
        </p>
        <p> When the 'identity' position of the model is set, click the 'Submit' button and your file will begin to process. This may take a few minutes. You will then be taken to the Visualizer Screen where you can view your dataset.</p>
        <p>To view a different upload file, click on the hamburger icon in the top left corner and you will see the file directory. In the user-uploads folder, you will be able to access any additional files that you uploaded.</p>
        <Button color='primary' variant= 'contained' id = "submitButton" onClick={()=>returnHome()}>Return Home to Get Started</Button>

      
        </Box> 
        <Button style={{position: 'absolute', right: '30px', bottom: '20px'}} color='primary' variant= 'contained' id = "submitButton" onClick={()=>upload()}>+ Upload File</Button>

 </div>
      
    </div>  

  );
}
