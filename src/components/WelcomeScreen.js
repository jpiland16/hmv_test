import './WelcomeScreen.css';
import {useHistory} from 'react-router-dom'
import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DialogSelect from './DatasetDialog'
import HomeAnimation from './HomeAnimation'
import Grid from '@material-ui/core/Grid';
import TitleBar from './TitleBar'



export default function Welcome(props) {
  
  const [ showEgg, setShowEgg ] = React.useState(false);
  const useStyles = makeStyles(() => ({
    title: {
      flexGrow: 1,
    },
  }));
  
  const classes = useStyles();

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
      console.log('correct')
      setShowEgg(true)
      console.log(showEgg)
    }
    event.Handled = true;
  };
  window.addEventListener('keydown', keyHandler, false);

  function launchVisualizer(){
    history.push('/visualizer')
  }

  function launchUploadForm(){
    history.push('/upload');
  }

  

  return (
    
    <div>
      <TitleBar classes={classes}/>
      <Container>
      <HomeAnimation/>
      {showEgg ?  <iframe className="toptoptop" width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      : null}
       <div className="toplayer">
          <Grid container spacing={2}>
            <Grid item>
              <Button color='primary' variant= 'contained' id = "submitButton" onClick={()=>launchVisualizer()}>Launch Visualizer</Button>
            </Grid>
            <Grid item>
              <DialogSelect/>
            </Grid>
            <Grid item>
              <Button color='primary' variant= 'contained' id = "submitButton" onClick={()=>launchUploadForm()}>Upload Dataset</Button>
            </Grid>
          </Grid> 
        </div>
      </Container>
    </div>
  );
}

