import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute";
import App from "./App";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";
import AuthRedirect from "./pages/AuthRedirect";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthRedirect>
        <App />{" "}
      </AuthRedirect>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Blog />
      </ProtectedRoute>
    ),
  },
  {
    path: "/post",
    element: (
      <ProtectedRoute>
        <BlogPost />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <AuthRedirect>
        <Login />
      </AuthRedirect>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
