import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useHistory} from 'react-router-dom'



export default function UploadDialog() {
  const [open, setOpen] = React.useState(false);
  const history = useHistory() 
  let fileName

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleUpload = () => {
    
    let el = document.getElementById("myFile");
    let files = el.files;

    if(files.length>0){
      fileName=files[0].name
    }

    const formData = new FormData();
      
    for (let i = 0; i < files.length; i++) {
        formData.append('file' + i, files[i]);
        formData.append('file' + i + 'params', "some parameters");

    let x = new XMLHttpRequest();

    x.onload = () => {
        console.log("Finished");

        let x2 = new XMLHttpRequest();
        x2.open('GET', "/api/scan-all-files");
        x2.send();

    }
    x.open("POST", "/api/upload-file");
    x.send(formData);
    }
  
  };
  
  const handleOK = () => {
    setOpen(false);
    if(fileName){
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
            <Button variant="contained" color='primary' onClick={handleUpload}>Upload</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOK} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}