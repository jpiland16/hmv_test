import React from 'react'
import { Alert } from '@material-ui/lab'
import { Button } from '@material-ui/core'
import io from 'socket.io-client'
import { withRouter } from "react-router-dom";

// I expect this to have pretty much the same contents as Viewport.js. I just want to sandbox with this before I port it over.

class FileViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            loaded: false,
            status: 'Contacting server'
        }
    }

    componentDidMount() {

        // This should be extracted out to whatever JSX contains this component, but
        // right now it's on its own, so it has full exclusive access to the URL.
        console.log(this.props.history);
        console.log(this.props.history.location.search);
        let query = new URLSearchParams(this.props.history.location.search);
        for(var key of query.keys()) {
            console.log(key);
        }
        if (!query.get('filename')) {
            console.log("No filename was specified! We should abort and notify the user.");
        }
        //This is asynchronous, so we cannot rely on it. How should we ensure that we can always access state? Maybe an instance variable.
        this.fileName = query.get('filename');
        console.log(this.fileName);
        
        const URL = "http://localhost:3000";
        const socket = io(URL, { 
            autoConnect: false,
            auth: {
                username: "placeholder_username"
            },
            query: {
                "file": this.fileName
                // "file": "badfilebutfile"
            },
        });

        socket.on("Processing data", () => {
            console.log("Received processing data message");
            this.changeStatus("Processing data")();
        })

        socket.on("File ready", () => {
            this.changeStatus("Loading file")();
            this.getFile()
            .then((responses) => {
                console.log(responses[0]);
                console.log(responses[1]);
                this.setState({
                    data: responses[0],
                    metadata: responses[1],
                })
                this.changeStatus("Complete")();
                this.state.socket.disconnect();
            })
            .catch((error) => {
                this.setState({
                    errorMessage: "Encountered an error retrieving the file from the server. Try reloading or resubmitting."
                });
                this.changeStatus("Error")();
                this.state.socket.disconnect();
            });
        })

        socket.on("File missing", () => {
            console.log("File doesn't exist.");
            // It might be better to add parameters to this.changeStatus instead of passing through state.
            this.setState({
                errorMessage: "The requested file doesn't exist on the server. Try resubmitting."
            });
            this.changeStatus("Error")();
            socket.disconnect();
        })

        socket.onAny((event, ...args) => {
            console.log("Received data through socket.");
            console.log(event, args);
        });

        // establish socket connection with server
        socket.connect();
        console.log("Connected with socket.");
        this.state.socket = socket;
        //  if update is received, page status is based on current state.
        //  possible status:
        //      waiting for response from server
        //      server is processing file
        //      server encountered an error, your file isn't coming
        //      server is sending the file right now
        //      the actual data, visualized.
        //  state needs to be reassigned (new pointer obj) so that re-rendering happens
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
        switch(props.status) {      
            case 'Contacting server':    
                return <props.library.ContactingServerMessage/>;
            case 'Processing data':
                return <props.library.ProcessingDataMessage/>
            case 'Loading file':
                return <props.library.LoadingFileMessage/>
            case 'Loading model':
                return <props.library.LoadingModelMessage/>
            case 'Error':      
                return <props.library.ErrorMessage errorMessage={props.library.state.errorMessage}/>
            case 'Complete':
                return <props.library.CompleteMessage data={props.library.state.data} metadata={props.library.state.metadata}/>
        }
        return <Alert severity="error">Unable to parse the state of this file. Try re-uploading.</Alert>
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
                switch(dataReq.status) {
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
            const targetURL = ("/api/uploadedfiles?") // TODO: Use a different API URL than 'uploadedfiles' since this is for accessing any files
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
                <this.MainDisplay status={this.state.status} errorMessage="Bad sensor data or something?" library={this}></this.MainDisplay>
                <Button onClick={this.changeStatus("Contacting server")}>Status: Contacting server</Button>
                <Button onClick={this.makeServerSendStatus("Processing data", "")}>Status: Processing data</Button>
                <Button onClick={this.changeStatus("Loading file")}>Status: Loading file</Button>
                <Button onClick={this.changeStatus("Loading model")}>Status: Loading model</Button>
                <Button onClick={this.changeStatus("Error")}>Status: Error</Button>
                <Button onClick={this.changeStatus("Complete")}>Status: Complete</Button>
                {/* <Button onClick={this.getFile}>Send GET request</Button> */}
            </div>
        )
    }
}

export default withRouter(FileViewer);