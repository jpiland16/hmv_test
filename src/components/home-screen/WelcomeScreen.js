import './WelcomeScreen.css';
import {useHistory} from 'react-router-dom'
import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import DialogSelect from './DatasetDialog'
import HomeAnimation from './HomeAnimation'
import Grid from '@material-ui/core/Grid';
import TitleBar from '../TitleBar'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';


export default function Welcome(props) {

  props.setFirstLoad(true)
  const history = useHistory()
  const [open, setOpen]=React.useState(false)
  const pattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let current=0;

  const keyHandler = event => {
    if(event.Handled)
    return;
    if (pattern.indexOf(event.key) < 0 || event.key !== pattern[current]) {
      current = 0;
      return;
    }
    current++;
    if (pattern.length === current) {
      current = 0;
      setOpen(true)
    }
    event.Handled = true;
  }

  useEffect(()=> {
    window.addEventListener('keydown', keyHandler)
    return () => {
      window.removeEventListener('keydown', keyHandler)
    }
  })

  const handleOK = () => {
    setOpen(false);
  
  };

  return (
    
    <div>
      <TitleBar/>
      <Container>
        <HomeAnimation/>
        <div className="toplayer">
        <Dialog disableBackdropClick disableEscapeKeyDown open={open} >
        <DialogContent>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOK} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
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

