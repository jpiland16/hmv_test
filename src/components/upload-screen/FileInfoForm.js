import React from 'react';
import { Button } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Typography from '@material-ui/core/Typography';
import { Input } from '@material-ui/core';

const allBoneOptions=["BACK", "RUA", "RLA", "LUA", "LLA", "RUL", "RLL","LUL","LLL"]

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
class FileInfoForm extends React.Component {
  
  constructor() {
    super();
    this.state = {
      name: "",
      typeOptions: ["Quaternion", "Accel+Gyro+Magnet", "Accel+Gyro", "Euler Angles"],
      sensors: [{ dataType: "Quaternion", bone: allBoneOptions[0], startColumn: "", localTransformQuaternion: null }],
      timeColumn: 0,
      validity: {
        noDisplayName: true,
        noSensors: false,
        noTimeColumn: false,
        maxSensors: false,
      },
      boneOptions: allBoneOptions.slice(1),
      next: false,
    };
  }

  handleNext = () => {
    const formData = new FormData();
    formData.append('file', document.getElementById('myFile').files[0]);
    formData.append('displayName', this.state.name);
    formData.append('timeColumn', this.state.timeColumn);
    this.props.setFormData(formData)
    this.props.setDisplayName(this.state.name)
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
  addSensor = () => {
    this.setState({
      sensors: this.state.sensors.concat([{ dataType: "Quaternion", bone: this.state.boneOptions[0], startColumn: "", localTransformQuaternion: null }]),
      validity: {
        noSensors: false,
        maxSensors: (this.state.sensors.length+1 == allBoneOptions.length)
      }
    }, ()=>{this.updateBoneOptions()});
    
  }

  printState = () => {
    if (this.props.verbose) console.log(this.state.sensors);
  }

  /**
   * @description Removes sensor from form and updates the bone selection dropdown lists
   */
  deleteSensor = (removedIndex) => () => {
    if (this.props.verbose) console.log(`Deleting sensor with index ${removedIndex}`);
    this.setState({
      sensors: this.state.sensors.filter((sensor, currIndex) => currIndex !== removedIndex),
      validity: {
        noSensors: (this.state.sensors.length-1 < 1),
        maxSensors: false
      }
    }, ()=>{this.updateBoneOptions()})
  }

  handleTimecolChange = (event) => {
    this.setState({
      timeColumn: event.target.value
    }, ()=> {
      if(this.state.timeColumn != '') {
        this.setState({validity: {noTimeColumn: false}})
      } else {
        this.setState({validity: {noTimeColumn: true}})
      }
    });
  }

  handleBoneChange = (index) => (event) => {
    this.setState({ sensors: listWithNewVal(this.state.sensors, index, "bone", event.target.value) }, () => {this.updateBoneOptions()});
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
    this.setState({ name: event.target.value }, ()=>{
      if(this.state.name != '') {
        this.setState({validity: {noDisplayName: false}})
      } else {
        this.setState({validity: {noDisplayName: true}})
      }
    })
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
    <Grid item xs={4} justify="center" marginBottom="2%">
              <Input type="file" id="myFile" required></Input>
      </Grid>
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
      <Button type="submit" color="primary" variant="contained" className="button-submit" onClick={this.handleNext} disabled={this.state.validity.noSensors || this.state.validity.noDisplayName || this.state.validity.noTimeColumn}>Next</Button>
    </div>
    </div>
  );
  }
}

export default FileInfoForm;
