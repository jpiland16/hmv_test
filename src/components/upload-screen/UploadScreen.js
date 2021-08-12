import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FileInfoForm from './FileInfoForm';
import QuaternionCalibrationForm from './QuaternionCalibrationForm'
import TitleBar from "../TitleBar"
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {useHistory} from 'react-router-dom'


export default function UploadScreen(props) {

  const useStyles = makeStyles((theme) => ({
    appBar: {
      position: 'relative',
    },
    layout: {
      width: 'auto',
      height: 'auto',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
        width: 750,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
        padding: theme.spacing(3),
      },
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    button: {
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(1),
    },
  })); 

  const classes = useStyles();

  const history = useHistory()

  const steps = ['Enter File Information', 'Calibrate Model'];

  const [activeStep, setActiveStep] = React.useState(0);

  const [sensorList, setSensorList] = React.useState([]);

  const [displayName, setDisplayName]= React.useState('')

  const [formData, setFormData] = React.useState(null)

  const [submit, setSubmit] = React.useState(false)

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <FileInfoForm setSensorList={setSensorList} setActiveStep={setActiveStep} formData={formData} setFormData={setFormData} setDisplayName={setDisplayName}/>;
      case 1:
        return <QuaternionCalibrationForm sensorList={sensorList} setSensorList={setSensorList} setSubmit={setSubmit}/>;
    }
  }

  React.useEffect(() => {
    if(submit){
      if (props.verbose) console.log("Submitted the form.")
      if (props.verbose) console.log(sensorList);
      if (props.verbose) console.log("About to send post request.");
      formData.append('sensorData', JSON.stringify(sensorList));
    
      let formPostReq = new XMLHttpRequest();
      formPostReq.onload = (() => {
        if (props.verbose) console.log("POST request complete!");
        let responseJSON = JSON.parse(formPostReq.response);
        if (props.verbose) console.log(responseJSON);
        if (responseJSON.status !== 'File received') {
          if (props.verbose) console.log('The server rejected the POST request. We should notify the user.');
        }
        const targetURL = ("/visualizer?");
        const params = new URLSearchParams();
        params.set('file', '/user-uploads/'+responseJSON.fileName);
        params.set('name', displayName);
        if (props.verbose) console.log(params.toString());
        const target = targetURL + params.toString();
        history.push(target); 
      });
      formPostReq.open("POST", "/api/postform");
      formPostReq.send(formData);
      if (props.verbose) console.log("Post request has been sent: ");
      if (props.verbose) console.log(formPostReq);
    }
  
  }, [submit]);

  return (
    <div style={{overflowY: 'auto', height: '100vh', width: '100vw', backgroundColor: 'lightskyblue'}}>
      <TitleBar />
      <main className={classes.layout} >
        <Paper className={classes.paper} >
        <Typography component="h1" variant="h4" align="center">
            Upload File
        </Typography>
        <Stepper activeStep={activeStep} className={classes.stepper} >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment >
                {getStepContent(activeStep)}
              </React.Fragment>
        </Paper>
      </main>
    </div>
  );
}