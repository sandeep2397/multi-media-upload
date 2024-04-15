/*
©2022 Pivotree | All rights reserved
*/
import React from 'react';

const Login = React.lazy(() => import('./Login'));
const Logout = React.lazy(() => import('./Logout'));
const ImageUpload = React.lazy(() => import('./ImageUpload'));

export { ImageUpload, Login, Logout };
