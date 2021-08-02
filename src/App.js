import Viewport from "./components/Viewport"
import Welcome from "./components/home-screen/WelcomeScreen"
import Tutorial from "./components/tutorial/TutorialScreen";
import './App.css';
import NotFound from "./components/NotFound"
import { BrowserRouter, Route, Switch } from "react-router-dom";
import React from 'react';
import UploadScreen from "./components/UploadScreen";
import DatasetInfoScreen from "./components/dataset-info-screen/DatasetInfoScreen";

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
            <Route>
                <NotFound />
            </Route>
        </Switch>
    </BrowserRouter>
  );
}
