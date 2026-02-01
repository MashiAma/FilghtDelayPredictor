import React, { useContext, useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Typography,
  ListItemIcon,
  Box,
} from "@mui/material";
import { Logout, Lock, Email, LoginOutlined, LoginRounded, AppRegistrationRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import VerifyPasswordDialog from "../pages/Users/VerifyPasswordDialog";
import SetNewPasswordDialog from "../pages/Users/SetNewPasswordDialog";

const AppHeaderDropdown = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small" sx={{ p: 0 }}>
        <Avatar>{user.fullName ? user.fullName[0] : "U"}</Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          '& .MuiMenuItem-root': {
            py: 0.5,
            minHeight: 35,
          },
        }}
      >
        <Box sx={{
          background: "rgba(0, 23, 65, 0.62)",
        }}>
          <Typography sx={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}>Account</Typography>
        </Box>
        <Typography fontWeight="bold" sx={{ fontSize: "14px", ml: 1, mt: 1.5 }}>
          {user.fullName || "Not Logged In"}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "11px", ml: 1, mt: 0.8, mb: 1.5 }}>
          {user.email ? `${user.email} (${user.role})` : ""}
        </Typography>

        <Divider sx={{ border: "0.5px solid black" }} />

        {/* <MenuItem onClick={() => { navigate("/register"); handleClose(); }}>
          <ListItemIcon>
            <AppRegistrationRounded fontSize="small" />
          </ListItemIcon>
          Register
        </MenuItem>

        <MenuItem onClick={() => { navigate("/login"); handleClose(); }}>
          <ListItemIcon>
            <LoginRounded fontSize="small" />
          </ListItemIcon>
          Login
        </MenuItem> */}

        {/* <Divider sx={{ border: "0.5px solid black" }} /> */}

        <MenuItem
          onClick={() => {
            setVerifyOpen(true);
            handleClose();
          }}
        >
          <ListItemIcon>
            <Lock fontSize="small" />
          </ListItemIcon>
          Change Password
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Password Dialogs */}
      <VerifyPasswordDialog
        open={verifyOpen}
        onClose={() => setVerifyOpen(false)}
        onVerified={() => {
          setVerifyOpen(false);
          setChangeOpen(true);
        }}
      />

      <SetNewPasswordDialog
        open={changeOpen}
        onClose={() => setChangeOpen(false)}
      />
    </>
  );
};

export default AppHeaderDropdown;
