import { useState } from 'react';

import { Link } from "react-router-dom";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AvatarButton from './AvatarButton';
import logo from '../assets/images/logo-white.png';

import useAuth from '../hooks/useAuth';


const pages = [
        {name: 'Home', url: "/"},
        {name: 'About', url: "/about"},
        {name: 'Contact', url: "/contact"}
    ]


const Navbar = () => {
    const { auth } = useAuth();

    const [anchorElNav, setAnchorElNav] = useState(null);

    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };

    
    return (
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
                component="img"
                sx={{
                  height: 70,
                  width: 125,
                  maxHeight: { xs: 233, md: 167 },
                  maxWidth: { xs: 350, md: 250 },
                  mr: 2, 
                  display: { xs: 'none', md: 'flex' }
                }}
                alt="Snapping Rails logo"
                src={logo}
            />
  
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color='inherit'
              >
                <MenuIcon sx={{ fill: 'white' }}/>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                    <Link to={page.url}>
                        <Typography 
                        textAlign="center"
                        sx={{ color: 'white' }}
                        >
                            {page.name}
                        </Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none', color: 'white' } }}
          >
            Snapping Rails
          </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                  <Link to={page.url} key={page.name}>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                    {page.name}
                    </Button>
                </Link>
              ))}
            </Box>
            
            {!(Object.keys(auth).length === 0) ? <AvatarButton /> : <Button href="/login">Log In</Button>}

          </Toolbar>
        </Container>
      </AppBar>
    );
  };

export default Navbar;