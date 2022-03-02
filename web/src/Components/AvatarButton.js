import { useState } from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import useAuth from '../Hooks/useAuth';


const AvatarButton = () => {
    const { setAuth } = useAuth();
    const settings = ['Profile', 'Account', 'Posts', 'Sign Out'];

    const [anchorElUser, setAnchorElUser] = useState(null);


    const handleOpenUserMenu = (e) => {
        setAnchorElUser(e.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleMenuSelect = (e) => {
      const { setting } = e.currentTarget.dataset;
      if (setting === "Sign Out") {
        setAuth({});
      }
      setAnchorElUser(null);
    }

    return (
        <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Account settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar alt="Matt Thornton" src="/static/images/avatar/2.jpg" />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
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
          {settings.map((setting) => (
            <MenuItem key={setting} data-setting={setting} onClick={handleMenuSelect}>
              <Typography
                textAlign="center"
                sx={{ color: 'white' }}
              >
                {setting}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
}

export default AvatarButton;
