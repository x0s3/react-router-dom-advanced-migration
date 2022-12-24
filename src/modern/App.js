import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { HomePage } from "./routes/Home";
import { UserDetails, userLoader } from "./routes/UserDetails";
import { ErrorPage } from "./routes/Error";
import { LegacyApp } from "./LegacyApp";

function RootLayout() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div
        style={{
          margin: 20,
          padding: 20,
          border: "1px solid black",
          minHeight: 300,
        }}
      >
        <br />
        <Outlet />
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // we can use all the new features offered by RRD v6 :D
      {
        path: "/users/:id",
        element: <UserDetails />,
        loader: async ({ params }) => userLoader(params.id),
      },
      // handle non-existent routes
      {
        path: "/error",
        element: <ErrorPage />,
      },
      // here we tell to RRD that if it does not find the path in the modern system, to look for it in the legacy one
      {
        path: "*",
        element: <LegacyApp />,
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
