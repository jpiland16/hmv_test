import Viewport from "./components/Viewport"
import Welcome from "./components/WelcomeScreen"
import './App.css';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";

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
