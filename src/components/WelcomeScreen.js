import './WelcomeScreen.css';
import {useHistory} from 'react-router-dom'
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import DialogSelect from './DatasetDialog'
import HomeAnimation from './HomeAnimation'
import Grid from '@material-ui/core/Grid';
import UploadDialog from './UploadDialog';

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

  function launchVisualizer(){
    history.push('/visualizer')
  }
  return (
    
    <div>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Human Activity Visualizer
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <HomeAnimation/>
        <div className="toplayer">
          <Grid container spacing={2}>
            <Grid item>
              <Button color='primary' variant= 'contained' id = "submitButton" onClick={()=>launchVisualizer()}>Launch Visualizer</Button>
            </Grid>
            <Grid item>
              <DialogSelect/>
            </Grid>
            <Grid item>
              <UploadDialog/>
            </Grid>
          </Grid> 
        </div>
      </Container>
    </div>
  );
}

