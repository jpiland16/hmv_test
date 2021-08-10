import React from 'react';
import { Button, Container } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { Input } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import QuaternionSelectionDialog from './QuaternionSelectionDialog'
import Typography from '@material-ui/core/Typography';
import * as THREE from 'three'
import { MannequinVisualizer } from '../shared_visualizer_object/Models';
import { LensOutlined } from '@material-ui/icons';
import {CircularProgress} from '@material-ui/core';
import {withRouter} from 'react-router-dom'


const mannequinVisualizer = new MannequinVisualizer()
mannequinVisualizer.initialize((progress) => {})
mannequinVisualizer.showSliders = true

const allBoneOptions=["RUA", "RLA", "LUA", "LLA", "BACK", "ROOT"]

function listWithNewVal(list, index, key, newVal) {
  const newList = list.map((item, currIndex) => {
    if (currIndex !== index) {
      return item;
    }
    return { ...item, [key]: newVal };
  });
  return newList;
}

// https://goshakkk.name/array-form-inputs/
class MaterialCalibrationForm extends React.Component {
  
  constructor() {
    super();
    this.state = {
      name: "",
      boneOptions: ["RUA", "RLA", "LUA", "LLA", "BACK", "HIPS", "RUL", "RLL", "LUL", "LLL"],
      typeOptions: ["Quaternion", "Accel+Gyro+Magnet", "Accel+Gyro", "Euler Angles"],
      sensors: [{ dataType: "Quaternion", bone: allBoneOptions[0], startColumn: "", localTransformQuaternion: null }],
      timeColumn: 0,
      validity: {
        noSensors: false,
        maxSensors: false
      },
      boneOptions: allBoneOptions.slice(1),
      modelQuaternions: {},
      next: false,
    };
  }

  setQuaternions = (newQObj) => {
    this.setState({
      modelQuaternions: newQObj
    });
  }

  acceptNewQuaternion = (boneName, newQ) => {
    this.state.sensors.forEach((sensor) => {
      if (sensor.bone === boneName) {
        sensor.localTransformQuaternion = new THREE.Quaternion().copy(newQ)
      }
    })

    this.setState({
      sensors: this.state.sensors
    })
  }

  handleSubmit = (event) => {
    
    if (this.props.verbose) console.log("Submitted the form.")
    if (this.props.verbose) console.log(this.state.sensors);
    if (this.props.verbose) console.log("About to send post request.");
    const formData = new FormData();
    formData.append('file', document.getElementById('myFile').files[0]);
    formData.append('displayName', this.state.displayName);
    formData.append('sensorData', JSON.stringify(this.state.sensors));
    formData.append('timeColumn', this.state.timeColumn);
  
    let formPostReq = new XMLHttpRequest();
    formPostReq.onload = (event => {
      if (this.props.verbose) console.log("POST request complete!");
      let responseJSON = JSON.parse(formPostReq.response);
      if (this.props.verbose) console.log(responseJSON);
      if (responseJSON.status !== 'File received') {
        if (this.props.verbose) console.log('The server rejected the POST request. We should notify the user.');
      }
      const targetURL = ("/visualizer?");
      const params = new URLSearchParams();
      params.set('file', '/user-uploads/'+responseJSON.fileName);
      params.set('name', this.state.displayName);
      if (this.props.verbose) console.log(params.toString());
      const target = targetURL + params.toString();
      this.props.history.push(target);
    });
    formPostReq.open("POST", "/api/postform");
    formPostReq.send(formData);
    if (this.props.verbose) console.log("Post request has been sent: ");
    if (this.props.verbose) console.log(formPostReq);
  }

  handleNext = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('displayName', this.state.displayName);
    formData.append('timeColumn', this.state.timeColumn);
    this.props.setFormData(formData)
    this.props.setDisplayName(this.state.displayName)
    this.props.setSensorList(this.state.sensors)
    this.props.setActiveStep(1)
    
  }
/**
 * @description Sets the options in the bone dropdown lists to an array of the unpicked bones (prevents user from selecting the same bone twice)
 */
  updateBoneOptions = () => {
    let boneOptions=[]
    let selectedBones = this.state.sensors.map((sensor) => (sensor.bone))
    allBoneOptions.forEach((boneOption) => { 
      if(selectedBones.indexOf(boneOption)==-1) {
        boneOptions.push(boneOption)
      }
    })
    this.setState({
      boneOptions: boneOptions
    })
  }


  /**
   * @description Adds sensor to form and updates the bone selection dropdown lists
   */
  addSensor = async() => {
    await this.setState({
      displayName: "",
      sensors: this.state.sensors.concat([{ dataType: "Quaternion", bone: this.state.boneOptions[0], startColumn: "", localTransformQuaternion: null }]),
      validity: {
        noSensors: false,
        maxSensors: (this.state.sensors.length+1 == allBoneOptions.length)
      }
    });
    this.updateBoneOptions()
  }

  printState = () => {
    if (this.props.verbose) console.log(this.state.sensors);
  }

  /**
   * @description Removes sensor from form and updates the bone selection dropdown lists
   */
  deleteSensor = (removedIndex) => async() => {
    if (this.props.verbose) console.log(`Deleting sensor with index ${removedIndex}`);
    await this.setState({
      sensors: this.state.sensors.filter((sensor, currIndex) => currIndex !== removedIndex),
      validity: {
        noSensors: (this.state.sensors.length-1 < 1),
        maxSensors: false
      }
    })
    this.updateBoneOptions()
  }

  handleTimecolChange = (event) => {
    this.setState({
      timeColumn: event.target.value
    });
  }

  handleBoneChange = (index) => async(event) => {
    await this.setState({ sensors: listWithNewVal(this.state.sensors, index, "bone", event.target.value) });
    this.updateBoneOptions()
  }

  handleStartcolChange = (index) => (event) => {
    this.setState({ sensors: listWithNewVal(this.state.sensors, index, "startColumn", event.target.value) });
  }

  handleDataTypeChange = (index) => (event) => {
    this.setState({ sensors: listWithNewVal(this.state.sensors, index, "dataType", event.target.value) });
  }

  customValidityFunction = (event) => {
    event.preventDefault();
    if (this.props.verbose) console.log("Invalid thingy detected!!!");
  }

  handleNameChange = (event) => {
    this.setState({ displayName: event.target.value });
  }

  NoSensorsError(props) {
    if (props.noSensors) {
      return <Alert severity="warning" hidden={true}>Please add specifications for one or more sensors.</Alert>;
    }
    return null;
  }

  render() {
    return (<div>
    <React.Fragment>
      <Typography variant="h6" gutterBottom style={{marginTop:20}}>
        File Info
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="Display name"
            fullWidth
            onChange={this.handleNameChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Time column"
            onChange={this.handleTimecolChange}
              InputProps={{
                inputProps: {
                  id: "timeColumn",
                  name: "timeColumn",
                  defaultValue: "0",
                  min: "0",
                  placeholder: "Column number"
                }
              }}
           required
          />
        </Grid>
        </Grid>
        <Typography variant="h6" gutterBottom style={{marginTop:20}}>
         Sensor Info
      </Typography>
        <Grid container spacing={3}>
        <Grid item xs={12}>
          <this.NoSensorsError noSensors={this.state.validity.noSensors}></this.NoSensorsError>
        </Grid>
        {this.state.sensors.map((sensor, index) => (
            <Grid container item xs={12} spacing={3} justify="flex-start" alignItems="center">
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  id="bone_select"
                  select
                  label="Bone"
                  value={sensor.bone}
                  onChange={this.handleBoneChange(index)}
                >
                  <MenuItem key={sensor.bone} value={sensor.bone}>{sensor.bone}</MenuItem>
                  {this.state.boneOptions.map((boneName) => (
                    <MenuItem key={boneName} value={boneName}>{boneName}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  id="datatype_select"
                  select
                  label="Data type"
                  value={sensor.dataType}
                  onChange={this.handleDataTypeChange(index)}
                >
                  {this.state.typeOptions.map((typeName) => (
                    <MenuItem key={typeName} value={typeName}>{typeName}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField 
                fullWidth
                  type="number"
                  label="Start column"
                  onChange={this.handleStartcolChange(index)}
                  value={sensor.startColumn}
                  InputProps={{
                    inputProps: {
                      id: "startColumn"+index,
                      name: "startColumn",
                      min: "0",
                      placeholder: "Start column"
                    }
                  }}
                  required>
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <Button
                  color='primary'
                  onClick={this.deleteSensor(index)}>
                  Remove sensor
                </Button>
              </Grid>
            </Grid>
      ))}
      <Grid container justify="center">
          <Grid item xs={3}>
            <Button
              onClick={this.addSensor}
              color='primary'
              disabled={this.state.validity.maxSensors}>
              Add sensor
            </Button>
          </Grid>
      </Grid>
      </Grid>
      
    </React.Fragment>
    <div style={{display:"flex", justifyContent: "flex-end"}}>
      <Button type="submit" color="primary" variant="contained" className="button-submit" onClick={this.handleNext} disabled={this.state.validity.noSensors}>Next</Button>
    </div>
    </div>
  );
  }
}

export default withRouter(MaterialCalibrationForm);
