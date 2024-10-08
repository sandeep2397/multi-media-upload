/*
©2022 Pivotree | All rights reserved
*/

import { FaFileUpload } from 'react-icons/fa';
import { Navigate, Route } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { ImageUpload, Login, Logout } from './routesJson';

let routes = [
  {
    path: '/login',
    id: 'login',
    component: Login,
    isAllowed: true,
    route: PrivateRoute,
  },
  {
    path: '/logout',
    id: 'logout',
    component: Logout,
    isAllowed: true,
    route: PrivateRoute,
  },

  {
    path: '/imageupload',
    label: 'imageupload',
    id: 'imageupload',
    component: ImageUpload,
    isAllowed: true,
    route: Route,
    icon: FaFileUpload,
  },

  {
    path: '/home',
    label: 'home',
    id: 'home',
    component: ImageUpload,
    isAllowed: true,
    route: Route,
  },

  {
    path: '/',
    label: 'default',
    id: 'default',
    component: () => <Navigate to='/imageupload' />,
    isAllowed: true,
    route: Route,
  },
];

export { routes };
