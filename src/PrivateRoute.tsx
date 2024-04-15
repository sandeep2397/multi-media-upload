/*
©2022 Pivotree | All rights reserved
*/
import { Navigate, useLocation } from 'react-router';
import { isUserAuthenticated } from './utils/auth';

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const isAuthTokenValid = isUserAuthenticated();
  if (!isAuthTokenValid) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
