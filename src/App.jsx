import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Dasboard from "./dasboard";
import DetailSecurityPage from "./log";
import MapTracker from "./MapTracker";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/Dasboard" />
        </Route>
        <Route path="/Dasboard" component={Dasboard} />
        <Route path="/log" component={DetailSecurityPage} />
        <Route path="/map" component={MapTracker}/>
      </Switch>
    </Router>
  );
}

export default App;