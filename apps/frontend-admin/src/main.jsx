import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

import Login from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import NewPost from "./pages/NewPost.jsx";
import UpdatePost from "./pages/UpdatePost.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import AuthRedirect from "./pages/AuthRedirect.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthRedirect>
        <App />
      </AuthRedirect>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: (
      <AuthRedirect>
        <Login />
      </AuthRedirect>
    ),
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
    path: "/new",
    element: (
      <ProtectedRoute>
        <NewPost />
      </ProtectedRoute>
    ),
  },
  {
    path: "/update",
    element: (
      <ProtectedRoute>
        <UpdatePost />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
