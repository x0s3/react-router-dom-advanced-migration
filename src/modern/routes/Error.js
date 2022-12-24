import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <>
      <h2>src/modern/ErrorPage.js 🥲</h2>
      <h3>This component is rendered by the outer React-Router-Dom v6.6.1.</h3>
      <b>
        <ul>
          <li>
            <Link to="/">Go to Modern system</Link>
          </li>
        </ul>
      </b>
    </>
  );
}

export { ErrorPage };
