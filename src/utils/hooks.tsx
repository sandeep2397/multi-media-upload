/*
©2022 Pivotree | All rights reserved
*/
import { useSelector } from 'react-redux';
import { matchPath } from 'react-router';
import { useLocation } from 'react-router-dom';
import { routes } from '../routes';

export const useGetUserId = () => {
  const loggedInData =
    useSelector((state: any) => state.Common.loggedInData) || {};
  return loggedInData?.userId || '';
};

export function useMatchedRoute() {
  const { pathname } = useLocation();
  for (const route of routes) {
    if (matchPath({ path: route.path }, pathname)) {
      return route;
    }
  }
}
