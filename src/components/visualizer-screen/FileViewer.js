import React from 'react'
import { Alert } from '@material-ui/lab'
import { withRouter } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress'
import LinearProgress from '@material-ui/core/LinearProgress'

// For JSDoc
import { BasicVisualizerObject } from '../shared_visualizer_object/Visualizer';

import './FileViewer.css';

/**
 * The output section of the screen; can be used to display progress bars, error messages, and of course the Visualizer.
 * 
 * @param {Object} props 
 * @param {Object} props.selectedFile
 * @param {string} props.selectedFile.fileName.fileName
 * @param {Object} props.fileStatus
 * @param {string} props.fileStatus.status
 * @param {Number} props.fileStatus.progress
 * @param {Number} props.modelDownloadProgress
 * @param {string} props.fileStatus.message
 * @param props.sceneInfo - TODO: remove this because it is unused
 * @param {boolean} props.menuIsOpen
 * @param {BasicVisualizerObject} props.visualizer
 * @param {Array} props.windowDimensions
 * @param {boolean} props.dev
 * 
 * @component
 */
class FileViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            loaded: false,
            status: 'Contacting server',
            index: 0,
        }
    }

    componentDidMount() {
        if (this.props.verbose) console.log("Target file: ");
        if (this.props.verbose) console.log(this.props.targetFile);
    }

    LoadingMessage(props) {
        if (this.props.verbose) console.log("Loaded: " + props.loaded);
        if (props.loaded) {
            return null;
        }
        return <div style={{marginLeft: props.menuIsOpen ? "6px" : "48px" }}><Alert severity="warning">Your file is being processed...</Alert></div>;
    }

    LoadingModelMessage(props) {
        return (
            <div className='loading'>
                <LinearProgress variant="determinate" value={props.progress} style={{width: "90%", margin: "auto"}}></LinearProgress>
                <br/>
                Loading the model... ({props.progress}%)
            </div>
        )
    }

    ContactingServerMessage(props) {
        return (
            <div className='loading'>
                <CircularProgress/>
                <br/>
                Contacting the server...
            </div>
        )
    }

    ProcessingDataMessage(props) {
        return (
            <div className='loading'>
                <CircularProgress/>
                <br/>
                Processing the data file...
            </div>
        )
    }

    LoadingFileMessage(props) {
        return (
            <div className='loading'>
                <LinearProgress variant="determinate" value={props.progress} style={{width: "90%", margin: "auto"}}></LinearProgress>
                <br/>
                Loading the data file... ({props.progress}%)
            </div>
        )
    }

    ErrorMessage(props) {
        return <div style={{marginLeft: props.menuIsOpen ? "6px" : "48px" }}><Alert severity="error">An error occured while loading the data file: {props.errorMessage}</Alert></div>;
    }

    // TODO: Split this up into multiple files or use some other method to (1) separate the outer and inner choice and (2) prevent
    // importing 'library'
    /**
     * @param {Object} props 
     * @param {BasicVisualizerObject} props.visualizer 
     * @param {boolean} props.fileSelected
     * @param {string} props.status
     * @param {Number} props.fileProgress
     * @param {Number} props.modelProgress
     * @param {string} props.errorMessage
     * @param props.sceneInfo - TODO: remove this because it is unused
     * @param {boolean} props.menuIsOpen
     * @param {Array} props.windowDimensions
     * @param {boolean} props.dev
     * @param {FileViewer} props.library
     * 
     * @component
     * 
     */
    FileDisplay(props) {
        if (!props.fileSelected && !props.dev) {
            return <div style={{marginLeft: props.menuIsOpen ? "6px" : "48px" }}><Alert severity="info">Please select a file to view from the 'Choose File' section of the menu on the left. You can also click "Choose a file" above.</Alert></div>;
        } else if (props.dev) {
            return props.visualizer.component(props.windowDimensions);
        }
        switch (props.status) {
            case 'Contacting server':
                return <props.library.ContactingServerMessage />;
            case 'Processing data':
                return <props.library.ProcessingDataMessage />
            case 'Loading file':
                return <props.library.LoadingFileMessage progress={props.fileProgress}/>
            case 'Loading models':
                return <props.library.LoadingModelMessage progress={props.modelProgress}/>
            case 'Error':
                return <props.library.ErrorMessage errorMessage={props.errorMessage} />
            case 'Complete':
                return props.visualizer.component(props.windowDimensions);
            default:
                return <div style={{marginLeft: props.menuIsOpen ? "6px" : "48px" }}><Alert severity="error">Unable to determine the state "{props.status}" of this file. Try re-uploading.</Alert></div>;
        }
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
                if (this.props.verbose) console.log("Inappropriate data type: Should either be data or metadata.");
            }
            let dataReq = new XMLHttpRequest();
            dataReq.onload = (event => {
                if (this.props.verbose) console.log(dataReq);
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
            if (this.props.verbose) console.log(params.toString());
            const target = targetURL + params.toString();
            dataReq.open("GET", target);
            // TODO: Right now the response is in the default 'text' format, but it might
            // be more appropriate to use another format.
            dataReq.send();
            if (this.props.verbose) console.log("GET request has been sent: ");
        })
    }


    render() {
        if (this.props.verbose) console.log("Selected file: " + this.props.selectedFile.fileName);
        return (
            <div style={{ marginLeft: this.props.menuIsOpen ? "40vw" : "0px", width: this.props.menuIsOpen ? "calc(100% - 40vw)": "100%"}}>
                <this.FileDisplay 
                    fileSelected={this.props.selectedFile.fileName !== ''} 
                    status={this.props.fileStatus.status} 
                    fileProgress={this.props.fileStatus.progress} 
                    modelProgress={this.props.modelDownloadProgress} 
                    errorMessage={this.props.fileStatus.message} 
                    sceneInfo={this.props.sceneInfo}
                    library={this}
                    menuIsOpen={this.props.menuIsOpen}
                    visualizer={this.props.visualizer}
                    windowDimensions={this.props.windowDimensions}
                    dev={this.props.dev}
                />
            </div>
        )
    }
}

export default withRouter(FileViewer);