import React from 'react';
import { Button } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { Input } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { withRouter } from "react-router-dom";
import { FormControl } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { FormLabel } from '@material-ui/core';
import { RadioGroup, Radio, FormControlLabel } from '@material-ui/core';



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
      boneOptions: ["RUA", "RLA", "LUA", "LLA", "BACK", "ROOT"],
      typeOptions: ["Quaternion", "Accel+Gyro+Magnet"],
      sensors: [{ dataType: "Quaternion", bone: "RUA", startColumn: "" }],
      timeColumn: 0,
      validity: {
        noSensors: false
      },
      timeInfo: {
        type: "timeColumn",
        columnNum: 0,
        sampleRate: 25,
      }
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.props.verbose) console.log("Submitted the form.")
    if (this.props.verbose) console.log(this.state.sensors);
    if (this.props.verbose) console.log("About to send post request.");
    const formData = new FormData();
    formData.append('file', document.getElementById('myFile').files[0]);
    formData.append('displayName', this.state.displayName);
    formData.append('sensorData', JSON.stringify(this.state.sensors));
    formData.append('timeColumn', this.state.timeColumn);
    formData.append('timeType', this.state.timeInfo.type);
    formData.append('timeValue', 
      (this.state.timeInfo.type === 'timeColumn')? 
        this.state.timeInfo.timeColumn : 
        this.state.timeInfo.sampleRate
    );
  
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
    if (this.props.verbose) console.log(this.state.sensors);
  }

  deleteSensor = (removedIndex) => () => {
    if (this.props.verbose) console.log(`Deleting sensor with index ${removedIndex}`);
    this.setState({
      sensors: this.state.sensors.filter((sensor, currIndex) => currIndex !== removedIndex),
      validity: {
        noSensors: (this.state.sensors.length-1 < 1)
      }
    })
  }

  handleTimecolChange = (event) => {
    const key = (this.state.timeInfo.type === "timeColumn")? "columnNum" : "sampleRate";
    this.setState({
      timeColumn: event.target.value,
      timeInfo: {
        ...this.state.timeInfo,
        [key]: event.target.value,
      }
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

  handleTimeChange = ({ target: { value }}) => {
    this.setState({timeInfo: {...this.state.timeInfo, type: value } });
  }

  render() {
    return (<div>
          <Typography component="h1" variant="h4" align="center">
            Upload Files
          </Typography>
          <Grid item xs={4} justify="center">
              <Input type="file" id="myFile" required></Input>
            </Grid>
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
          <FormControl>
            <FormLabel component="legend">Time measurement</FormLabel>
            <RadioGroup aria-label="time" 
              value={this.state.timeInfo.type}
              onChange={this.handleTimeChange}
            >
              <FormControlLabel value="timeColumn" control={<Radio/>} 
                label="Column" 
              />
              <FormControlLabel value="sampleRate" control={<Radio/>} 
                label="Sample rate" 
              />
            </RadioGroup>
            <TextField
              fullWidth
              type="number"
              label={(this.state.timeInfo.type === "timeColumn")? "Time column" : "Sample rate (Hz)"}
              onChange={this.handleTimecolChange}
              value = {(this.state.timeInfo.type === "timeColumn")? this.state.timeInfo.columnNum : this.state.timeInfo.sampleRate}
                InputProps={{
                  inputProps: {
                    id: "timeColumn",
                    name: "timeColumn",
                    defaultValue: "0",
                    min: (this.state.timeInfo.type === "timeColumn")? "0" : "1",
                    placeholder: "Column number"
                  }
                }}
              required
            />
          </FormControl>

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
                onClick={this.deleteSensor(index)}
              >
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
            >
              Add sensor
            </Button>
          </Grid>
      </Grid>
      </Grid>
      
    </React.Fragment>
    <div>
      <Button onClick={this.handleSubmit} color="primary" variant="contained" className="button-submit" disabled={this.state.validity.noSensors}>Submit</Button>
    </div>
    </div>
     
  );
  }

}

export default withRouter(MaterialCalibrationForm);
