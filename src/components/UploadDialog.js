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
import {useHistory} from 'react-router-dom'

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

export default function UploadDialog() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const history = useHistory() 

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleUpload = () => {
    setOpen(false);
    let el = document.getElementById("myFile");
    let files = el.files;

    if(files.length>0){
      const formData = new FormData();
      let fileName=files[0].name;
      for (let i = 0; i < files.length; i++) {
        formData.append('file' + i, files[i]);
        formData.append('file' + i + 'params', "some parameters");
    }

    let x = new XMLHttpRequest();
    x.onload = () => {
        console.log("Finished");

        let x2 = new XMLHttpRequest();
        x2.open('GET', "/api/scan-all-files");
        x2.send();

    }
    x.open("POST", "/api/upload-file");
    x.send(formData);
      history.push(`/visualizer?file=/user-uploads/${fileName}`) 
      }
  
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      
      <Button color='primary' variant='contained' onClick={handleClickOpen}>Upload Dataset</Button>
      <Dialog disableBackdropClick disableEscapeKeyDown open={open} >
        <DialogTitle>Upload Dataset:</DialogTitle>
        <DialogContent>
            <input type="file" id="myFile" multiple/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}