import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { deepOrange } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { signOut } from 'firebase/auth';
import React from 'react';
import { MdLogout } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { customAuth } from './firebaseConfig';
import { UserLabel } from './style';
import { removeSession } from './utils/auth';
import { useGetUserId } from './utils/customHooks';
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<any>(({ theme, open, customTheme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  height: '60px!important',
  marginTop: '-8px',
  // background: `${rgba(customTheme?.palette?.primary?.main, 0.1)}`,
  background:
    'var(--ds-border, linear-gradient(to right,rgba(27,125,86,0.1) 0px, rgba(27,125,86,0.1) 1px, rgba(27,125,86,0.1) 1px, rgba(0, 0, 0, 0) 100% ))',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Topbar() {
  const navigate = useNavigate();
  const userId = useGetUserId();
  const userRegex = /^\d+$/;
  const settings = [{ label: 'Logout', icon: MdLogout, id: 'logout' }];

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <img
            src={require('./assets/Logo.png')}
            width={'150px'}
            height={'50px'}
            alt={'logo'}
            loading='lazy'
            style={{
              aspectRatio: 3 / 2,
              objectFit: 'contain',
              mixBlendMode: 'color-burn',
            }}
          />

          <Box sx={{ flexGrow: 0, minWidth: '100px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: 'solid 1px #c9c9c9',
                  padding: '0px 8px',
                  margin: '0px 8px',
                }}
              >
                <UserLabel color='#fff'> {'Logged In As'} </UserLabel>
                <Typography
                  sx={{
                    lineHeight: '1.6',
                    color: '#434343',
                  }}
                  fontWeight={'600'}
                  variant='subtitle2'
                  noWrap
                  component='div'
                >
                  {userId}
                </Typography>
              </div>
              <Tooltip arrow title={'Profile'}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={!userRegex.test(userId) && userId?.toUpperCase()}
                    sx={{ bgcolor: deepOrange[500], width: 32, height: 32 }}
                    src='/static/images/avatar/2.jpg'
                  />
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: '45px', zIndex: 99999 }}
                id='menu-appbar'
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting: any) => (
                  <MenuItem
                    onClick={async () => {
                      setAnchorElUser(null);
                      // dispatch(toggleUserLogin(false));
                      try {
                        await signOut(customAuth);
                        removeSession();
                        navigate('/login');
                      } catch (err) {
                        console.error('Err===>', err);
                      }
                    }}
                    key={setting}
                  >
                    <Typography
                      textAlign='center'
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '4px',
                      }}
                    >
                      <IconButton color={'primary'} size='small'>
                        {' '}
                        <MdLogout color={'primary'} />
                      </IconButton>

                      <Typography color={'primary'} textAlign='center'>
                        {/* <Link
                            variant='body1'
                            style={{ fontWeight: 500 }}
                            underline='hover'
                            color={theme.palette.primary.main}
                            href={cognitoLogoutUrl}
                          > */}
                        {setting?.label}
                        {/* </Link> */}
                      </Typography>
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
              {/* <div style={{ display: 'flex' }}>
                  <Typography sx={{ color: '#fff', margin: '6px 0px 0px 4px' }}>
                    {(i18n?.language || 'en').toUpperCase()}
                  </Typography>
                </div> */}
            </div>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
