import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      <h2>src/modern/HomePage.js 🚀</h2>
      <h3>This component is rendered by the outer React-Router-Dom v6.6.1.</h3>
      <b>
        <ul>
          <li>
            <Link to="/about">Go to Legacy system</Link>
          </li>
          <li>
            <Link to="/users/1">Go to UserDetails Modern system</Link>
          </li>
        </ul>
      </b>
    </>
  );
}

export { HomePage };
