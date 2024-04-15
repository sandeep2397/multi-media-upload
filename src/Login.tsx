import {
  Alert,
  Card,
  Container,
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
import { FaEye, FaEyeSlash, FaLock, FaPersonBooth } from 'react-icons/fa';
import { MdLogin } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleSessionPrompt } from './redux/root_actions';
import {
  LoginButton,
  LoginDiv,
  LoginLabel,
  LoginLayoutWrapper,
  StyledForm,
  WelcomeLabel,
} from './style';

import { isEmpty } from 'lodash';
import { userData } from './stubbedData';

interface Props {
  children?: null;
}

const Login: FC<Props> = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [showPassword, setShowPassword] = React.useState(false);
  const [pcapsState, passscapsState] = useState(false);
  const [invalidCreds, setInvalidCreds] = useState(false);
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

  const onFormSubmit = (event: any): void => {
    event.preventDefault();
    const cookies = new Cookies();

    const userDataExists: any = userData?.find((data) => {
      if (
        data?.userName === state.username &&
        data?.password === state.password
      ) {
        return data;
      }
    });

    if (userDataExists && !isEmpty(userDataExists)) {
      let cookieData =
        {
          // username: userDataExists.username,
          jwtToken: userDataExists?.token?.jwt,
        } || {};
      let tempdata = JSON.stringify(cookieData);
      cookies.set('multimedia', tempdata, {
        path: '/',
      });
      navigate('/imageupload');
    } else {
      setInvalidCreds(true);
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <LoginLayoutWrapper>
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
              <LoginLabel>{'Login To Product Adoption Tool (PAT)'} </LoginLabel>{' '}
            </div>
            {invalidCreds && (
              <Alert style={{ marginTop: '8px' }} severity='error'>
                {' '}
                {'Invalid Credentials'}
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
                        <FaPersonBooth color='primary' />
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
    </>
  );
};

export default Login;
