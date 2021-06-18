import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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

export default function DialogSelect() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [subValue, setSubValue] = React.useState('S1');
  const [triValue, setTriValue]= React.useState('Drill');

  const handleSubjectChange = (event) => {
    setSubValue(event.target.value || '');
  };

  const handleTrialChange = (event) => {
    setTriValue(event.target.value || '');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOK = () => {
    setOpen(false);
    window.location.href = (`/visualizer?file=/opportunity-dataset/dataset/${subValue}-${triValue}.dat`) 
  
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      
      <Button color='primary' variant='contained' onClick={handleClickOpen}>Use OPPORTUNITY dataset</Button>
      <Dialog disableBackdropClick disableEscapeKeyDown open={open} >
        <DialogTitle>Select a trial:</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="demo-dialog-native">Subject</InputLabel>
              <Select
                value={subValue}
                native
                onChange={handleSubjectChange}
                input={<Input id="demo-dialog-native" />}
              >
                <option value={'S1'}>S1</option>
                <option value={'S2'}>S2</option>
                <option value={'S3'}>S3</option>
                <option value={'S4'}>S4</option>
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="demo-dialog-native">Trial</InputLabel>
              <Select
                value={triValue}
                native
                onChange={handleTrialChange}
                input={<Input id="demo-dialog-native" />}
              >
                <option value={'Drill'}>Drill</option>
                <option value={'ADL1'}>1</option>
                <option value={'ADL2'}>2</option>
                <option value={'ADL3'}>3</option>
                <option value={'ADL4'}>4</option>
                <option value={'ADL5'}>5</option>

              </Select>
            </FormControl>
          </form>
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