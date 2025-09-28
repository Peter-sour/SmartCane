import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Dasboard from "./dasboard";
import DetailSecurityPage from "./log";
import MapTracker from "./MapTracker";
import Test from "./test";

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
        <Route path="/test" component={Test}/>
      </Switch>
    </Router>
  );
}

export default App;