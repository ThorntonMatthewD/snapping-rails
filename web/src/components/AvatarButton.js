import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";

import useAuth from "../hooks/useAuth";

const AvatarButton = () => {
  const navigate = useNavigate();
  const { logoutUser, user } = useAuth();

  const settings = ["Profile", "Account", "Sign Out"];

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
      logoutUser();
    } else if (setting === "Profile") {
      navigate("/profile");
    } else if (setting === "Account") {
      navigate("/account");
    } else {
      console.log("What the heck did you even click on lol");
    }

    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Account settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            label="user-avatar"
            alt={user ? user.username : ""}
            src="/static/images/avatar/2.jpg"
          />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem
            key={setting}
            data-setting={setting}
            onClick={handleMenuSelect}
          >
            <Typography textAlign="center" sx={{ color: "white" }}>
              {setting}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default AvatarButton;
