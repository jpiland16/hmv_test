import Viewport from "./components/Viewport"
import Welcome from "./components/WelcomeScreen"
import './App.css';
import MaterialCalibrationForm from "./components/MaterialCalibrationForm";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import React from 'react';

export default function App() {

    const [firstLoad, setFirstLoad]=React.useState(true)

  return (
  <BrowserRouter>
        <Switch>
            <Route path="/visualizer">
                <Viewport dev={false} firstLoad={firstLoad} setFirstLoad={setFirstLoad}/>
            </Route>
            <Route exact path="/visualizer/dev">
                <Viewport dev={true} firstLoad={firstLoad} setFirstLoad={setFirstLoad}/>
            </Route>
            <Route exact path="/">
                <Welcome setFirstLoad={setFirstLoad}/>
            </Route>
            <Route exact path="/upload">
                <MaterialCalibrationForm/>
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
