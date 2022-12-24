import { Suspense } from "react";
import { Await, Link, defer, useLoaderData } from "react-router-dom";

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
async function fakeApi(id) {
  await delay(1000);
  return { id, name: "x0s3" };
}

export async function userLoader(id) {
  const user = fakeApi(id).then((x) => x);
  return defer({ user });
}

function UserDetails() {
  const { user } = useLoaderData();

  return (
    <>
      <h2>src/modern/UserDetails.js 🚀</h2>
      <h3>This component is rendered by the outer React-Router-Dom v6.6.1.</h3>
      <b>
        <Link to="/">Go to modern system</Link>
      </b>
      <Suspense fallback={<h3>Loading user...</h3>}>
        <Await resolve={user}>
          {(currentUser) => (
            <div style={{ border: "1px solid red", marginTop: 5 }}>
              <code style={{ fontSize: 24 }}>
                {JSON.stringify(currentUser)}
              </code>
            </div>
          )}
        </Await>
      </Suspense>
    </>
  );
}

export { UserDetails };
