/*
©2022 Pivotree | All rights reserved
*/

import { FaFileUpload } from "react-icons/fa";
import { Navigate, Route } from "react-router-dom";
import EventDetails from "./EventDetails";
import { PrivateRoute } from "./PrivateRoute";
import { HomeComponent, Login, Logout } from "./routesJson";

let routes = [
  {
    path: "/login",
    id: "login",
    component: Login,
    isAllowed: true,
    route: PrivateRoute,
  },
  {
    path: "/logout",
    id: "logout",
    component: Logout,
    isAllowed: true,
    route: PrivateRoute,
  },

  {
    path: "/eventshuffle",
    label: "eventshuffle",
    id: "eventshuffle",
    component: HomeComponent,
    isAllowed: true,
    route: Route,
    icon: FaFileUpload,
  },

  {
    path: "/eventshuffle",
    label: "eventshuffle",
    id: "eventshuffle",
    component: EventDetails,
    isAllowed: true,
    route: Route,
    icon: FaFileUpload,
  },

  {
    path: "/home",
    label: "home",
    id: "home",
    component: HomeComponent,
    isAllowed: true,
    route: Route,
  },

  {
    path: "/",
    label: "default",
    id: "default",
    component: () => <Navigate to="/eventshuffle" />,
    isAllowed: true,
    route: Route,
  },
];

export { routes };
