import Quiz from "../Quiz/quiz";
import { GUARDS } from "../../routes/guards";
import { lazy } from "react";
const ErrorPage = lazy(() => import("../ErrorPage/ErrorPage"));
const AdminCourses = lazy(() => import("../AdminCourses/AdminCourses"));
const AdminUserLayout = lazy(() => import("../AdminUsers/AdminUserLayout"));
const UserProfile = lazy(() => import("../UserProfile/UserProfile"));
import { Navigate } from "react-router-dom";
import UnEnrolled from "../UnEnrolledUsers/UnEnrolledUser";
import Enrolled from "../EnrolledUsers/EnrolledUsers";
import Certified from "../Certified/Certified";
import Nominated from "../NominatedUsers/NominatedUsers";

type Predicate = (...args: any[]) => boolean;
const canActivate = (
  Component: React.ComponentType<any>,
  guards: Predicate[]
) => {
  return () => {
    if (guards.some((guard) => guard())) {
      return <Component />;
    } else {
      return <Navigate to="/" replace />;
    }
  };
};

export const adminRoutes = [
  {
    path: "courses/*",
    Component: canActivate(AdminCourses, [GUARDS.isAdmin]),
    errorElement: <ErrorPage />,
  },
  {
    path: ":moduleId/quiz",
    Component: canActivate(Quiz, [GUARDS.isAdmin]),
    errorElement: <ErrorPage />,
  },
  {
    path: "users/*",
    Component: canActivate(AdminUserLayout, [GUARDS.isAdmin]),
    errorElement: <ErrorPage />,
    children: [
      { path: "enrolled", Component: canActivate(Enrolled, [GUARDS.isAdmin]) },
      {
        path: "unenrolled",
        Component: canActivate(UnEnrolled, [GUARDS.isAdmin]),
      },
      {
        path: "certified",
        Component: canActivate(Certified, [GUARDS.isAdmin]),
      },
      {
        path: "nominated",
        Component: canActivate(Nominated, [GUARDS.isAdmin]),
      },
    ],
  },
];

export const userRoutes = [
  {
    path: "courses/*",
    Component: canActivate(AdminCourses, [GUARDS.isUser]),
    errorElement: <ErrorPage />,
  },
  {
    path: "profile",
    Component: canActivate(UserProfile, [GUARDS.isUser]),
  },
  {
    path: ":moduleId/quiz",
    Component: canActivate(Quiz, [GUARDS.isUser]),
  },
];
