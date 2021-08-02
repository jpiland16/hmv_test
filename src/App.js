import Viewport from "./components/Viewport"
import Welcome from "./components/home-screen/WelcomeScreen"
import Tutorial from "./components/tutorial/TutorialScreen";
import './App.css';
import MaterialCalibrationForm from "./components/UploadScreen";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import React from 'react';
import UploadScreen from "./components/UploadScreen";

export default function App() {

    const [firstLoad, setFirstLoad]=React.useState(true)

  return (
  <BrowserRouter>
        <Switch>
            <Route exact path="/getting-started">
                <Tutorial setFirstLoad={setFirstLoad}/>
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
                <div>
                    Page not found!
                        <br />
                        <button onClick={() => window.location.href = "/"}>
                            Return to home page
                        </button>
                </div>
            </Route>
        </Switch>
    </BrowserRouter>
  );
}
