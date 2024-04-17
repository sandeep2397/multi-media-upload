import {
  Alert,
  Box,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  useTheme,
} from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import { FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa';
import { MdLogin } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { captureLoggedInUser, toggleSessionPrompt } from './redux/root_actions';
import {
  LoginButton,
  LoginDiv,
  LoginLabel,
  LoginLayoutWrapper,
  StyledForm,
  WelcomeLabel,
} from './style';

// import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import provider from './authProvider';
import { customAuth } from './firebaseConfig';
interface Props {
  children?: null;
}

const Login: FC<Props> = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [showPassword, setShowPassword] = React.useState(false);
  const [pcapsState, passscapsState] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [invalidCreds, setInvalidCreds] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  // const [invalidCreds, setInvalidCreds] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [state, setState] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    dispatch(toggleSessionPrompt(false));
  }, []);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handlekeypress = (e: KeyboardEvent) => {
    if (e.getModifierState('CapsLock')) {
      passscapsState(true);
    } else {
      passscapsState(false);
    }
  };

  const handleChange = (event: any): void => {
    let name = event?.target.name;
    let value = event?.target.value;
    event.target.setCustomValidity('');
    setInvalidCreds(false);
    setState({
      ...state,
      [name]: value,
    });
  };

  const onFormSubmit = async (event: any) => {
    event.preventDefault();
    const cookies = new Cookies();
    setLoginLoading(true);
    try {
      // const auth = getAuth();
      // await firebase.auth().signInWithEmailAndPassword(state.username, state.password);
      const loginResp: any = await signInWithEmailAndPassword(
        customAuth,
        state.username,
        state.password
      );
      let cookieData = {
        jwtToken: loginResp?.user?.accessToken,
      };
      let tempdata = JSON.stringify(cookieData);
      cookies.set('multimedia', tempdata, {
        path: '/',
      });
      navigate('/imageupload');
      setLoginLoading(false);
      dispatch(captureLoggedInUser(loginResp));
    } catch (error) {
      setLoginLoading(false);
      setInvalidCreds(true);
    }
  };

  const handleGoogleSignIn = async () => {
    const cookies = new Cookies();
    try {
      // const auth = getAuth();
      // await firebase.auth().signInWithEmailAndPassword(state.username, state.password);
      const signInRes: any = await signInWithPopup(customAuth, provider);
      const credential: any =
        GoogleAuthProvider.credentialFromResult(signInRes);
      const token = credential?.accessToken;
      const user = signInRes.user;
      let cookieData = {
        jwtToken: token,
      };
      let tempdata = JSON.stringify(cookieData);
      cookies.set('multimedia', tempdata, {
        path: '/',
      });
      navigate('/imageupload');
      setLoginLoading(false);
      dispatch(captureLoggedInUser(signInRes));
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error('Sign In err===>', credential);
      setLoginLoading(false);

      if (error.code === 'auth/popup-blocked') {
        setPopupBlocked(true);
      } else {
        setInvalidCreds(true);
      }
    }
  };

  return (
    <Box style={{ alignContent: 'center', textAlign: 'center' }}>
      {loginLoading && (
        <CircularProgress
          color='primary'
          style={{ margin: '160px', zIndex: 5 }}
        />
      )}
      <Card
        style={{
          maxWidth: 345,
          opacity: loginLoading ? 0.3 : 1,
          pointerEvents: loginLoading ? 'none' : 'auto',
        }}
      >
        <LoginLayoutWrapper style={{ margin: 'auto' }}>
          <Container
            fixed
            style={{ textAlign: 'center', marginBottom: '16px' }}
          >
            <img
              src={require('./assets/Logo.png')}
              height='80px'
              width={'210px'}
              alt='Logo'
            />
          </Container>
          <Container fixed>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                margin: '0px 8px',
                borderTop: 'solid 1px #a7a7a7',
              }}
            >
              <LoginLabel>{'Login To Multi Media App'} </LoginLabel>{' '}
            </div>
            {invalidCreds && (
              <Alert style={{ marginTop: '8px' }} severity='error'>
                {' '}
                {'Invalid Credentials or'}
              </Alert>
            )}

            {popupBlocked && (
              <Alert style={{ marginTop: '8px' }} severity='info'>
                {' '}
                {'Enable popup blocker from your url'}
              </Alert>
            )}

            <LoginDiv>
              {pcapsState && (
                <Typography
                  fontSize={'14px'}
                  fontWeight={500}
                  color='#1565c0'
                  style={{ margin: '0px 10px' }}
                >
                  {'Caps Lock is on'}
                </Typography>
              )}
              <StyledForm onSubmit={onFormSubmit}>
                <FormControl fullWidth sx={{ m: 1 }} variant='outlined'>
                  <InputLabel htmlFor='outlined-adornment-username'>
                    User Name
                  </InputLabel>
                  <OutlinedInput
                    id='outlined-adornment-username'
                    type={'text'}
                    name='username'
                    value={state.username}
                    required={state.username ? false : true}
                    onKeyPress={(event: any) => handlekeypress(event)}
                    onInvalid={(event: any) => {
                      if (state.username) {
                        //do nothing
                      } else {
                        event.target.setCustomValidity('Username is required');
                      }
                    }}
                    onChange={(event: any) => handleChange(event)}
                    startAdornment={
                      <InputAdornment position='start'>
                        <FaUser color='primary' />
                      </InputAdornment>
                    }
                    placeholder='Enter user name'
                    label='User Name'
                    autoFocus
                  />
                </FormControl>

                <FormControl fullWidth sx={{ m: 1 }} variant='outlined'>
                  <InputLabel
                    color='primary'
                    htmlFor='outlined-adornment-password'
                  >
                    {'Password'}
                  </InputLabel>
                  <OutlinedInput
                    id='outlined-adornment-password'
                    type={showPassword ? 'text' : 'password'}
                    value={state.password}
                    name='password'
                    // ref={register({ required: true, maxLength: 80 })}
                    required={state.password ? false : true}
                    onKeyPress={(event: any) => handlekeypress(event)}
                    onChange={(event: any) => handleChange(event)}
                    onInvalid={(event: any) => {
                      if (state.password) {
                        //do nothing
                      } else {
                        event.target.setCustomValidity('Password is required');
                      }
                    }}
                    placeholder='Enter password'
                    startAdornment={
                      <InputAdornment position='start'>
                        <FaLock color='primary' />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge='end'
                        >
                          {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label='Password'
                  />
                </FormControl>

                <FormControl fullWidth sx={{ m: 1 }} variant='outlined'>
                  <LoginButton
                    onClick={() => {}}
                    variant='contained'
                    type='submit'
                    startIcon={<MdLogin />}
                    // disabled={state?.username === '' || state?.password === ''}
                  >
                    <WelcomeLabel color={theme?.palette?.primary?.contrastText}>
                      {'Login'}
                    </WelcomeLabel>
                  </LoginButton>
                </FormControl>
              </StyledForm>
              <Divider>
                <Chip label='OR' size='small' />
              </Divider>
              <FormControl fullWidth sx={{ m: 1 }} variant='outlined'>
                <LoginButton
                  onClick={() => handleGoogleSignIn()}
                  variant='contained'
                  type='submit'
                  style={{ background: '#fff' }}
                  startIcon={
                    <img
                      src={require('./assets/google.png')}
                      height='25px'
                      width={'25px'}
                      alt='Logo'
                    />
                  }
                  // disabled={state?.username === '' || state?.password === ''}
                >
                  <WelcomeLabel
                    style={{
                      color: theme?.palette?.primary?.main,
                      fontWeight: 'bold',
                    }}
                    color={theme?.palette?.primary?.main}
                  >
                    {'Sign In with Google'}
                  </WelcomeLabel>
                </LoginButton>
              </FormControl>
            </LoginDiv>
          </Container>
        </LoginLayoutWrapper>
      </Card>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginLeft: '24px',
          position: 'fixed',
          bottom: '20px',
        }}
      >
        {/* <FooterLabel>
          {<FaRegCopyright  color='primary' fontSize={'small'} />}{' '}
        </FooterLabel>
        <FooterLabel>{'2023 All rights reserved by Pivotree'} </FooterLabel> */}
      </div>
    </Box>
  );
};

export default Login;
