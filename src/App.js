import Viewport from "./components/Viewport"
import './App.css';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";

export default function App() {
  return (
  <BrowserRouter>
        <Switch>
            <Route exact path="/visualizer">
                <Viewport />
            </Route>
            <Route exact path="/">
                <div>Homepage</div>
                <button onClick={() => window.location.href = "/visualizer"}>
                  Go to visualizer
                </button>
            </Route>
        </Switch>
    </BrowserRouter>
  );
}
