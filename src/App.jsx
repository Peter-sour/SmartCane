import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Dasboard from "./dasboard";
import DetailSecurityPage from "./log";
import MapTracker from "./MapTracker";
import Test from "./test";
import Login from "./Login/Login";
import Register from "./Login/Register";
import UserLogin from "./Login/UserLogin";
import RegisterUser from "./Login/RegisterUser";

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
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/user/login" component={UserLogin} />
        <Route path="/user/register" component={RegisterUser} />
      </Switch>
    </Router>
  );
}
export default App;