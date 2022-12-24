import { Switch, Route, Link } from "react-router-dom";

function LegacyApp() {
  return (
    <div
      style={{
        margin: 20,
        padding: 20,
        border: "4mm ridge rgb(134 17 17)",
        minHeight: 300,
      }}
    >
      <ul>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <a href="/">Modern System</a>
        </li>
        <li>
          <a href="/users/68">Modern UserDetails System</a>
        </li>
        <li>
          <Link to="/foooooo">Not found route</Link>
        </li>
      </ul>
      <hr />
      <Switch>
        <Route path="/about" exact>
          <div>
            <h2>src/legacy/About</h2>
            <h3>
              This component is rendered by the inner React-Router-Dom v5.3.4.
            </h3>
            Legacy About
          </div>
        </Route>
        <Route path="/dashboard" exact>
          <div>
            <h2>src/legacy/Dashboard</h2>
            <h3>
              This component is rendered by the inner React-Router-Dom v5.3.4.
            </h3>
            Legacy Dashboard
          </div>
        </Route>
        <Route path="*" render={() => (window.location.href = "/error")} />
      </Switch>
    </div>
  );
}

export default LegacyApp;
