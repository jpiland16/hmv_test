import React from 'react';
import { Button } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import { FormHelperText } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core';
import { Input } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { withRouter } from "react-router-dom";


function listWithNewVal(list, index, key, newVal) {
  const newList = list.map((item, currIndex) => {
    if (currIndex !== index) {
      return item;
    }
    return { ...item, [key]: newVal };
  });
  return newList;
}

const useStyles = {
  fontSize: '15px',
  textAlign: 'center'
}

// https://goshakkk.name/array-form-inputs/
class MaterialCalibrationForm extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      boneOptions: ["RUA", "RLA", "LUA", "LLA", "BACK", "ROOT"],
      typeOptions: ["Quaternion", "Accel+Gyro+Magnet"],
      sensors: [{ dataType: "Quaternion", bone: "RUA", startColumn: "" }],
      timeColumn: 0,
      validity: {
        noSensors: false
      }
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted the form.")
    console.log(this.state.sensors);
    console.log("About to send post request.");
    const formData = new FormData();
    formData.append('file', document.getElementById('myFile').files[0]);
    formData.append('displayName', this.state.displayName);
    formData.append('sensorData', JSON.stringify(this.state.sensors));
    formData.append('timeColumn', this.state.timeColumn);
  
    let formPostReq = new XMLHttpRequest();
    formPostReq.onload = (event => {
      console.log("POST request complete!");
      let responseJSON = JSON.parse(formPostReq.response);
      console.log(responseJSON);
      if (responseJSON.status !== 'File received') {
        console.log('The server rejected the POST request. We should notify the user.');
      }
      const targetURL = ("/visualizer?");
      const params = new URLSearchParams();
      params.set('file', './files/user-uploads/'+responseJSON.fileName); // Another place that will change based on the way file addresses are encoded
      console.log(params.toString());
      const target = targetURL + params.toString();
      this.props.history.push(target);
    });
    formPostReq.open("POST", "/api/postform");
    // TODO: Right now the response is in the default 'text' format, but it might
    // be more appropriate to use another format.
    formPostReq.send(formData);
    console.log("Post request has been sent: ");
    console.log(formPostReq);
  }


  addSensor = () => {
    this.setState({
      displayName: "",
      sensors: this.state.sensors.concat([{ dataType: "Quaternion", bone: "RUA", startColumn: "" }]),
      validity: {
        noSensors: (this.state.sensors.length+1 < 1)
      }
    });
  }

  printState = () => {
    console.log(this.state.sensors);
  }

  deleteSensor = (removedIndex) => () => {
    console.log(`Deleting sensor with index ${removedIndex}`);
    this.setState({
      sensors: this.state.sensors.filter((sensor, currIndex) => currIndex !== removedIndex),
      validity: {
        noSensors: (this.state.sensors.length-1 < 1)
      }
    })
  }

  handleTimecolChange = (event) => {
    this.setState({
      timeColumn: event.target.value
    });
  }

  handleBoneChange = (index) => (event) => {
    this.setState({ sensors: listWithNewVal(this.state.sensors, index, "bone", event.target.value) });
    // this.setState({
    //   boneOptions: this.state.boneOptions.filter((sensor, currIndex) => currIndex !== index)
    // })
  }

  handleStartcolChange = (index) => (event) => {
    this.setState({ sensors: listWithNewVal(this.state.sensors, index, "startColumn", event.target.value) });
  }

  handleDataTypeChange = (index) => (event) => {
    this.setState({ sensors: listWithNewVal(this.state.sensors, index, "dataType", event.target.value) });
  }

  customValidityFunction = (event) => {
    event.preventDefault();
    console.log("Invalid thingy detected!!!");
  }

  handleNameChange = (event) => {
    this.setState({ displayName: event.target.value });
  }

  NoSensorsError(props) {
    console.log(props.noSensors);
    if (props.noSensors) {
      return <Alert severity="warning" hidden={true}>Please add specifications for one or more sensors.</Alert>;
    }
    return null;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Grid>
          <Grid container spacing={2} justify="flex-start" alignItems="center">
            <Grid item xs={4}>
              <Input type="file" id="myFile" required></Input>
            </Grid>
            <Grid item xs={3}>
              <TextField label="Display name" required onChange={this.handleNameChange}/>
            </Grid>
            <Grid item xs={2}>
              <TextField
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
                required>
            </TextField>
          </Grid>
        </Grid>
        <hr/>
        <p>Sensors</p>
        <Grid container spacing={1}>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item xs={12}>
            <this.NoSensorsError noSensors={this.state.validity.noSensors}></this.NoSensorsError>
          </Grid>
        </Grid>
        {this.state.sensors.map((sensor, index) => (
          <Grid container item xs={8} spacing={3} justify="flex-start" alignItems="center">
            <Grid item xs={2}>
              <TextField
                id="bone_select"
                select
                label="Bone"
                value={sensor.bone}
                onChange={this.handleBoneChange(index)}
              >
                {this.state.boneOptions.map((boneName) => (
                  <MenuItem key={boneName} value={boneName}>{boneName}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
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
            <Grid item xs={4}>
              <TextField 
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
            <Grid item xs={2}>
              <Button
                onClick={this.deleteSensor(index)}
              >
                Remove
              </Button>
            </Grid>
          </Grid>
      ))}
        <Grid container justify="center">
          <Grid item xs={3}>
            <Button
              onClick={this.addSensor}
            >
              Add sensor
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <hr/>
      <Grid container spacing={2} justify="center" alignItems="center">
        <Grid item xs={3}>
          <Button type="submit" className="button-submit" disabled={this.state.validity.noSensors}>Submit</Button>
        </Grid>
      </Grid>
      <hr/>
      </Grid>
      </form>
    )
  }

}

export default withRouter(MaterialCalibrationForm);
