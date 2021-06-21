import React from 'react';
import { Button } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import { Input } from '@material-ui/core';
import { FormHelperText } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core';


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
      timeColumn: 0
    };
  }

  handleSubmit = () => {
    console.log("Submitted the form.")
    console.log(this.state.sensors);
    console.log("About to send post request.");
    const formData = new FormData();
    formData.append('file', document.getElementById('myFile').files[0]);
    formData.append('sensorData', JSON.stringify(this.state.sensors));
    formData.append('timeColumn', this.state.timeColumn);
  
    let x = new XMLHttpRequest();
    x.onload = (event => {
        console.log("POST request complete!");
        // console.log(x.response);
        // quatStorage = handleServerResponse(x.response);
        let indexList = [];
        // for (let i = 0; i < quatStorage.length; i ++) {
        //     indexList[i] = i;
        // }
        console.log("Modifying props...");
        // props.data.current = indexList;
        // console.log(props);
    });
    x.open("POST", "/api/postform");
    // TODO: Right now the response is in the default 'text' format, but it might
    // be more appropriate to use another format.
    x.send(formData);
    console.log("Post request has been sent: ");
    console.log(x);
  }


  addSensor = () => {
    this.setState({
      sensors: this.state.sensors.concat([{ dataType: "Quaternion", bone: "RUA", startColumn: "" }])
    });
  }

  printState = () => {
    console.log(this.state.sensors);
  }

  deleteSensor = (removedIndex) => () => {
    console.log(`Deleting sensor with index ${removedIndex}`);
    this.setState({
      sensors: this.state.sensors.filter((sensor, currIndex) => currIndex !== removedIndex)
    })
  }

  //Deprecated!
  handleShareholderNameChange = (index) => (event) => {
    this.setState({ sensors: listWithNewVal(this.state.sensors, index, "name", event.target.value) });
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

  render() {
    return (
      <FormControl onSubmit={this.handleSubmit}>
        <Grid>
          <Grid container xs={12} spacing={2} justify="flex-start" alignItems="center">
            <Grid item xs={6}>
              <input type="file" id="myFile"></input>
            </Grid>
            
            <Grid item xs={4}>
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
        {this.state.sensors.map((sensor, index) => (
          <Grid container item xs={12} spacing={3} justify="flex-start" alignItems="center">
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
      <Grid container xs={12} spacing={2} justify="center" alignItems="center">
        <Grid item xs={3}>
          <Button type="submit" className="button-submit">Submit</Button>
        </Grid>
      </Grid>
      <hr/>
      <Button onClick={this.printState}>(PRINT STATE)</Button>
      <Button type="button" onClick={this.handleSubmit}>(SEND HTTP REQUEST)</Button>
      {this.state.sensors.map((shareholder, index) => (
        <div>
          <p>{index}: Bone={shareholder.bone}, Data type={shareholder.dataType}, Start column={shareholder.startColumn} </p>
        </div>
      ))}
      </Grid>
      </FormControl>
      // <form onSubmit={this.handleSubmit}>
      //   <h4>Dataset file</h4>
      //   <input type="file" id="myFile"></input>
      //   <p>Which column is used to represent time?</p>
      //   <input type="number" id="timeColumn" name="timeColumn"
      //     value="0"
      //     min="0"
      //     onChange={this.handleTimecolChange}
      //     placeholder="Column number"
      //     required>
      //   </input>
      //   <h4>Sensors</h4>
      //   {this.state.sensors.map((sensor, index) => (
      //     <div>
      //       <select name="bones" id="bone" defaultValue="" onChange={this.handleBoneChange(index)} required>
      //         <option disabled value="">Choose bone...</option>
      //         {this.state.boneOptions.map((boneName) => (
      //           <option value={boneName}>{boneName}</option>
      //         ))}
      //       </select>
      //       <select name="dataType" id="dataType" defaultValue= "" onChange={this.handleDataTypeChange(index)} required>
      //         <option disabled value="">Choose data type...</option>
      //         {this.state.typeOptions.map((typeName) => (
      //           <option value={typeName}>{typeName}</option>
      //         ))}
      //       </select>
      //       <input type="number" id="startColumn" name="startColumn" 
      //         min="0"
      //         onChange={this.handleStartcolChange(index)}
      //         placeholder="Column number"
      //         required
      //       />
      //       <button
      //         type="button"
      //         onClick={this.deleteSensor(index)}
      //       >Remove</button>
      //     </div>
          
      //   ))}
      //   <button type="button" onClick={this.addSensor} className="small">
      //     Add sensor
      //   </button>
      //   <button type="button" onClick={this.printState}>(PRINT STATE)</button>
      //   <button type="button" onClick={this.handleSubmit}>(SEND HTTP REQUEST)</button>
      //   <input type="submit"/>
      //   <hr/>
      //   {this.state.sensors.map((shareholder, index) => (
      //     <div>
      //       <p>{index}: Bone={shareholder.bone}, Start column={shareholder.startColumn} </p>
      //     </div>
          
      //   ))}
      // </form>
    )
  }

}

export default MaterialCalibrationForm;
