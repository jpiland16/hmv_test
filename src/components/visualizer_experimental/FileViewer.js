import React from 'react'
import { useEffect, useCallback } from 'react';
import { Alert } from '@material-ui/lab'
import { Button } from '@material-ui/core'
import io from 'socket.io-client'
import { withRouter } from "react-router-dom";
import Visualizer from './Visualizer';
import { initializeScene } from './SceneInitializer';


let boneNames = {
    LUA: "upperarm_l",
    LLA: "lowerarm_l",
    RUA: "upperarm_r",
    RLA: "lowerarm_r",
    BACK: "spine_02", /** IMPORTANT */
    LSHOE: "foot_l",
    RSHOE: "foot_r",
    ROOT: "_rootJoint",
    RUL: "right_upper_leg",
    LUL: "left_upper_leg",
    RLL: "right_lower_leg",
    LLL: "left_lower_leg"
}

class FileViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            loaded: false,
            status: 'Contacting server'
        }
    }

    componentDidMount() {
        console.log("Target file: ");
        console.log(this.props.targetFile);
        // this.props.onSelectFileChange(this.props.targetFile); // This should not trigger every time the component re-renders.
    }

    LoadingMessage(props) {
        console.log("Loaded: " + props.loaded);
        if (props.loaded) {
            return null;
        }
        return <Alert severity="warning">Your file is being processed...</Alert>;
    }

    LoadingModelMessage(props) {
        return <Alert severity="warning">Loading the model...</Alert>;
    }

    ContactingServerMessage(props) {
        return <Alert severity="warning">Contacting the server...</Alert>;
    }

    ProcessingDataMessage(props) {
        return <Alert severity="warning">Your file is being processed...</Alert>;
    }

    LoadingFileMessage(props) {
        return <Alert severity="warning">Loading the data file...</Alert>;
    }

    ErrorMessage(props) {
        return <Alert severity="error">An error occured while loading the data file: {props.errorMessage}</Alert>;
    }

    CompleteMessage(props) {
        return <Alert severity="success">Your file is fully loaded and ready. Data: {props.data} Metadata: {props.metadata} </Alert>;
    }

    MainDisplay(props) {
        switch (props.status) {
            case 'Contacting server':
                return <props.library.ContactingServerMessage />;
            case 'Processing data':
                return <props.library.ProcessingDataMessage />
            case 'Loading file':
                return <props.library.LoadingFileMessage />
            case 'Loading models':
                return <props.library.LoadingModelMessage />
            case 'Error':
                return <props.library.ErrorMessage errorMessage={props.errorMessage} />
            case 'Complete':
                //If complete, load the files needed for the 3d scene.
                //Once that's done, we can finally display our scene.
                // return <props.library.CompleteMessage data={props.library.state.data} metadata={props.library.state.metadata}/>
                return <Visualizer sceneInfo={props.library.props.sceneInfo} />
        }
        return <Alert severity="error">Unable to determine the state "{props.status}" of this file. Try re-uploading.</Alert>
    }

    // Why do we need the double arrow? Because using a function in JSX for onClick will evaluate whatever you pass in.
    // This evaluates to a function of what was passed in as newStatus.
    changeStatus = (newStatus) => () => {
        this.setState({
            status: newStatus
        });
    }

    //Purely for debugging, to ensure that the server can mess with client state
    makeServerSendStatus = (newStatus, newParams) => () => {
        this.state.socket.emit('Debug request',
            {
                messageType: newStatus,
                params: newParams
            });
    }

    // Uses HTTP to get both the data and metadata files from the server, and returns a 
    // Promise that completes when both are received OR when an error occurs.
    getFile = () => {
        let dataPromise = this.getFilePart('data');
        let metadataPromise = this.getFilePart('metadata');
        return Promise.all([dataPromise, metadataPromise]);
    }



    getFilePart = (type) => {
        return new Promise((resolve, reject) => {
            if (type !== 'data' && type !== 'metadata') {
                console.log("Inappropriate data type: Should either be data or metadata.");
            }
            let dataReq = new XMLHttpRequest();
            dataReq.onload = (event => {
                console.log(dataReq);
                switch (dataReq.status) {
                    case (200):
                        resolve(dataReq.responseText);
                        break;
                    case (400):
                        reject("Invalid data type request!");
                        break;
                    case (404):
                        reject("The target file was not found.");
                        break;
                }
            });
            dataReq.onerror = (() => {
                reject();
            })
            const targetURL = ("/api/uploadedfiles?")
            const params = new URLSearchParams();
            params.set('file', this.fileName);
            params.set('type', type);
            params.set('accessCode', 'password_wrong');
            console.log(params.toString());
            const target = targetURL + params.toString();
            dataReq.open("GET", target);
            // TODO: Right now the response is in the default 'text' format, but it might
            // be more appropriate to use another format.
            dataReq.send();
            console.log("GET request has been sent: ");
        })
    }

    render() {
        return (
            <div>
                <this.MainDisplay status={this.props.fileStatus.status} errorMessage={this.props.fileStatus.message} library={this}></this.MainDisplay>
                {/* <Button onClick={this.getFile}>Send GET request</Button> */}
            </div>
        )
    }
}

export default withRouter(FileViewer);