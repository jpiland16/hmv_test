import Viewport from "./components/Viewport"
import Welcome from "./components/WelcomeScreen"
import CalibrationForm from "./components/CalibrationForm"
import './App.css';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import MaterialCalibrationForm from "./components/MaterialCalibrationForm";
import FileViewer from "./components/FileViewer";

export default function App() {
  return (
  <BrowserRouter>
        <Switch>
            <Route exact path="/visualizer">
                <Viewport dev={false}/>
            </Route>
            <Route exact path="/visualizer/dev">
                <Viewport dev={true}/>
            </Route>
            <Route exact path="/">
                <Welcome/>
            </Route>
            <Route exact path="/uploadformtest">
                <CalibrationForm/>
            </Route>
            <Route exact path="/uploadformtest/material">
                <MaterialCalibrationForm/>
            </Route>
            <Route exact path="/uploadformtest/landingpage">
                <FileViewer/>
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
