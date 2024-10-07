import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Navigate} from "react-router-dom";
import { lazy } from "react";
const Login = lazy(() => import("../pages/Login/Login"));
const ErrorPage = lazy(() => import("../pages/ErrorPage/ErrorPage"));
import HeaderFooterContainer from "../components/HeaderFooterContainer/HeaderFooterContainer"
import { GUARDS } from "./guards";
import Layout from "../components/HeaderFooterContainer/HeaderFooterContainer";
import { adminRoutes, userRoutes } from "../pages/AdminCourses/AdminCourse.router";

type Predicate = (...args: any[]) => boolean;

const Router = () => {
  const canActivate = (Component: React.ComponentType<any>, guards: Predicate[]) => {
    return () => {
      if (guards.some(guard => guard())) {
        return <Component />;
      } else {
        return <Navigate to="/" replace />;
      }
    };
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/admin/*",
      Component: canActivate(Layout, [GUARDS.isAdmin]),
      children: adminRoutes,
      errorElement: <ErrorPage />,
    },
    {
      path: "/user/*",
      Component: canActivate(HeaderFooterContainer, [GUARDS.isUser]),
      children: userRoutes
    },
  ]);

  return <RouterProvider router={router} />;
};
export default Router;
