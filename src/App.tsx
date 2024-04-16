import { css, Global } from '@emotion/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FC, Suspense, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { routes } from './routes';
import Topbar from './Topbar';
import { isUserAuthenticated } from './utils/auth';
interface Props {
  theme?: any;
  Authentication?: any;
}

const loading = () => <div></div>;

const App: FC<Props> = (props: Props) => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  // const match = useMatch();
  const params: any = useParams();
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    window.onpopstate = (e) => {
      let userAuth = isUserAuthenticated();
      if (location?.pathname === '/login' && userAuth) {
        navigate('/home');
      }
    };
  });

  const gettheme = () => {
    const theme = createTheme({
      typography: {
        body1: { fontFamily: 'Arial' },
        body2: { fontFamily: 'Arial', fontWeight: 'normal' },
        fontSize: 12,
      },
      palette: {
        primary: {
          light: '#611f69',
          main: '#303f9f',
          dark: '#434343',
          contrastText: '#fff',
        },
        secondary: {
          light: '#ff7961',
          main: '#f44336',
          dark: '#a7a7a7',
          contrastText: '#000',
        },
        success: {
          light: '#008000',
          main: '#008000',
        },
        info: {
          light: '#5e35b1',
          main: '#5e35b1',
        },
        error: {
          light: '#b71c1c',
          main: '#b71c1c',
        },
        warning: {
          light: '#ff6f00',
          main: '#ff6f00',
        },
      },
    });
    return theme;
  };

  let crumbs: any = [];
  return (
    <ThemeProvider theme={gettheme()}>
      <Global styles={css``} />
      {/* <BrowserRouter basename={process.env.PUBLIC_URL}> */}
      <Routes>
        {/* <Route path={process.env.PUBLIC_URL}> */}
        {routes.map(({ path, name, exact, ...route }: any, key: any) => {
          let filtercrumbs = routes.filter(({ path }) => {
            // if (macthedRoute?.path?.indexOf(path) !== -1) {
            return true;
            // }
          });
          let crumbs = filtercrumbs.map(({ path, ...rest }) => {
            return {
              path: Object.keys(params).length
                ? Object.keys(params).reduce(
                    (path, param) => path.replace(`:${param}`, params[param]),
                    path
                  )
                : path,
              ...rest,
            };
          });
          return (
            <Route
              path={path}
              element={
                path === '/login' ? (
                  <Suspense fallback={loading()}>
                    <route.component {...props} name={name} />
                  </Suspense>
                ) : (
                  <PrivateRoute>
                    <Suspense fallback={loading()}>
                      <Topbar />
                      <route.component {...props} name={name} />
                    </Suspense>
                  </PrivateRoute>
                )
              }
            />
          );
        })}
        {/* </Route> */}
        {/* <Route
            path='/*'
            element={<Navigate to={`${process.env.PUBLIC_URL}/dashboard`} />}
          /> */}
      </Routes>
      {/* </BrowserRouter> */}
    </ThemeProvider>
  );
};

export default App;
