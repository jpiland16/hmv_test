import Viewport from "./components/visualizer-screen/Viewport"
import Welcome from "./components/home-screen/WelcomeScreen"
import Tutorial from "./components/getting-started-screen/TutorialScreen";
import './App.css';
import NotFound from "./components/NotFoundScreen"
import { BrowserRouter, Route, Switch } from "react-router-dom";
import React from 'react';
import UploadScreen from "./components/upload-screen/UploadScreen";
import DatasetInfoScreen from "./components/dataset-info-screen/DatasetInfoScreen";
import MetadataTinkerer from "./components/MetadataTinkerer"

export default function App() {


    const [firstLoad, setFirstLoad]=React.useState(true)

  return (
  <BrowserRouter>
        <Switch>
            <Route exact path="/getting-started">
                <Tutorial setFirstLoad={setFirstLoad}/>
            </Route>
            <Route exact path="/dataset-info">
                <DatasetInfoScreen setFirstLoad={setFirstLoad}/>
            </Route>
            <Route exact path="/visualizer/dev">
                <Viewport dev={true} firstLoad={firstLoad} setFirstLoad={setFirstLoad}/>
            </Route>
            <Route path="/visualizer">
                <Viewport dev={false} firstLoad={firstLoad} setFirstLoad={setFirstLoad}/>
            </Route>
            <Route exact path="/">
                <Welcome setFirstLoad={setFirstLoad}/>
            </Route>
            <Route exact path="/upload">
                <UploadScreen/>
            </Route>
            <Route exact path="/tinker">
                <MetadataTinkerer/>
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    </BrowserRouter>
  );
}
