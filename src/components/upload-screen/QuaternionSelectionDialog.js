import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// For JSdoc
import { BasicVisualizerObject } from '../shared_visualizer_object/Visualizer';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

/**
 * @param {Object} props
 * @param {BasicVisualizerObject} props.visualizer
 */
export default function DialogSelect(props) {

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const [subValue, setSubValue] = React.useState('S1');
  const [triValue, setTriValue]= React.useState('Drill');

  const [ windowDimensions, setWindowDimensions ] = React.useState(getWindowDimensions());

  const elementRef = React.useRef(null)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOK = () => {
    props.onAccept(props.boneName, thisSlider().props.quaternionTarget.current)
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return [
        width,
        height
    ];
  }  

  const thisSlider = () => (props.visualizer.getSliders(props.quaternions, props.setQuaternions).filter((element) => element.props.quaternionTarget.shortName === props.boneName))[0]

  React.useEffect(() => {
    
    function handleResize() {
        setWindowDimensions(getWindowDimensions());
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);


}, []); // No dependencies, so it runs only once at first render.

    function quaternionToString(q) {
        return ("(" + Math.round(q.x * 1000) / 1000 + ", " + 
        Math.round(q.y * 1000) / 1000 + ", " + 
        Math.round(q.z * 1000) / 1000 + ", " + 
        Math.round(q.w * 1000) / 1000 + ")")
    }

  return (
    <div>
      
      <TextField 
            fullWidth
            required
            label="Local transform quaternion (X, Y, Z, W)"
            value={props.localTransformQuaternion ? quaternionToString(props.localTransformQuaternion) : "click here to select"}
            onClick={handleClickOpen}
            InputProps={{
            inputProps: {
                id: "quaternion",
                name: "quaternion"
            }
            }}
        />

        <Dialog disableBackdropClick disableEscapeKeyDown open={open} fullWidth maxWidth="lg">
        <DialogTitle>Edit local transform quaternion</DialogTitle>
        <DialogContent>
            <div style={{height: "50vh", paddingRight: "20px", width: "calc(50% - 20px)", float: "left"}} ref={elementRef}>
                <div style={{width: "100%"}}>
                    {props.visualizer.modelLoaded && thisSlider()}
                </div>
                {props.visualizer.getTools()}
            </div>
            <div style={{height: "50vh", width: "50%", float: "left", position: "relative"}} ref={elementRef}>
                {props.visualizer.component(windowDimensions)}
            </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOK} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}