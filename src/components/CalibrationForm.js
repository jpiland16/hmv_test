import React from 'react';
import { Button } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import { Input } from '@material-ui/core';
import { FormHelperText } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';


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
class CalibrationForm extends React.Component {

  constructor() {
    super();
    this.state = {
      name: "",
      boneOptions: ["RUA", "RLA", "LUA", "LLA", "BACK", "ROOT"],
      typeOptions: ["Quaternion", "Accel+Gyro+Magnet"],
      sensors: [{ dataType: "", bone: "", startColumn: 0 }],
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
      sensors: this.state.sensors.concat([{ bone: "", startColumn: 0 }])
    });
  }

  printState = () => {
    console.log(this.state.sensors);
  }

  deleteSensor = (removedIndex) => () => {
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
      <form onSubmit={this.handleSubmit}>
        <h4>Dataset file</h4>
        <input type="file" id="myFile"></input>
        <p>Which column is used to represent time?</p>
        <input type="number" id="timeColumn" name="timeColumn"
          value="0"
          min="0"
          onChange={this.handleTimecolChange}
          placeholder="Column number"
          required>
        </input>
        <h4>Sensors</h4>
        {this.state.sensors.map((sensor, index) => (
          <div>
            <select name="bones" id="bone" defaultValue="" onChange={this.handleBoneChange(index)} required>
              <option disabled value="">Choose bone...</option>
              {this.state.boneOptions.map((boneName) => (
                <option value={boneName}>{boneName}</option>
              ))}
            </select>
            <select name="dataType" id="dataType" defaultValue= "" onChange={this.handleDataTypeChange(index)} required>
              <option disabled value="">Choose data type...</option>
              {this.state.typeOptions.map((typeName) => (
                <option value={typeName}>{typeName}</option>
              ))}
            </select>
            <input type="number" id="startColumn" name="startColumn" 
              min="0"
              onChange={this.handleStartcolChange(index)}
              placeholder="Column number"
              required
            />
            <button
              type="button"
              onClick={this.deleteSensor(index)}
            >Remove</button>
          </div>
          
        ))}
        <button type="button" onClick={this.addSensor} className="small">
          Add sensor
        </button>
        <button type="button" onClick={this.printState}>(PRINT STATE)</button>
        <button type="button" onClick={this.handleSubmit}>(SEND HTTP REQUEST)</button>
        <input type="submit"/>
        <hr/>
        {this.state.sensors.map((shareholder, index) => (
          <div>
            <p>{index}: Bone={shareholder.bone}, Start column={shareholder.startColumn} </p>
          </div>
          
        ))}
      </form>
    )
  }

}

export default CalibrationForm;
