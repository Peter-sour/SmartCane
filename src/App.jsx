import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Dashboard from "./dasboard";
import DetailSecurityPage from "./log";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/Dasboard" />
        </Route>
        <Route path="/Dasboard" component={Dashboard} />
        <Route path="/log" component={DetailSecurityPage} />
      </Switch>
    </Router>
  );
}

export default App;