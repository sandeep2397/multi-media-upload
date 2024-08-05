/*
©2022 Pivotree | All rights reserved
*/
import React from "react";

const Login = React.lazy(() => import("./Login"));
const Logout = React.lazy(() => import("./Logout"));
const HomeComponent = React.lazy(() => import("./HomeComponent"));

export { HomeComponent, Login, Logout };
