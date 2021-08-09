import './WelcomeScreen.css';
import {useHistory} from 'react-router-dom'
import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DialogSelect from './DatasetDialog'
import HomeAnimation from './HomeAnimation'
import Grid from '@material-ui/core/Grid';
import TitleBar from '../TitleBar'



export default function Welcome(props) {

  props.setFirstLoad(true)
  const history = useHistory()
  const pattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let current=0;

  const keyHandler = function (event) {
    if(event.Handled)
    return;
    if (pattern.indexOf(event.key) < 0 || event.key !== pattern[current]) {
      current = 0;
      return;
    }
    current++;
    if (pattern.length === current) {
      current = 0;
      window.alert('One day this easter egg will be a shrine to Claudia in all of her glory');
    }
    event.Handled = true;
  };
  window.addEventListener('keydown', keyHandler, false);

  return (
    
    <div>
      <TitleBar/>
      <Container>
        <HomeAnimation/>
        <div className="toplayer">
          <Grid container spacing={2}>
            <Grid item>
              <Button color='primary' variant= 'contained' id = "submitButton" onClick={()=>history.push('/visualizer?menu')}>Launch Visualizer</Button>
            </Grid>
            <Grid item>
              <DialogSelect/>
            </Grid>
            <Grid item>
              <Button color='primary' variant= 'contained' id = "submitButton" onClick={()=>history.push('/upload')}>Upload Dataset</Button>
            </Grid>
          </Grid> 
        </div>
      </Container>
    </div>
  );
}

