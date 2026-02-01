import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Box,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import navigation from '../routes/navigation';
import { AuthContext } from '../context/AuthContext';
import AppHeaderDropdown from './AppHeaderDropdown'; // import the dropdown
import logo from "./../assets/images/logo.png"; // replace with your logo

const AppHeader = ({ mode, toggleTheme }) => {
  const { user } = useContext(AuthContext);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUsers, setAnchorElUsers] = useState(null);
  const [anchorElReports, setAnchorElReports] = useState(null);
  const [anchorElFlights, setAnchorElFlights] = useState(null);
  const [anchorElHolidays, setAnchorElHolidays] = useState(null);
  const navigate = useNavigate();
  const userRole = user?.role;

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUsersMenu = (event) => setAnchorElUsers(event.currentTarget);
  const handleCloseUsersMenu = () => setAnchorElUsers(null);

  const handleOpenReportsMenu = (event) => setAnchorElReports(event.currentTarget);
  const handleCloseReportsMenu = () => setAnchorElReports(null);

  const handleOpenFlightsMenu = (event) => setAnchorElFlights(event.currentTarget);
  const handleCloseFlightsMenu = () => setAnchorElFlights(null);

  const handleOpenHolidaysMenu = (event) => setAnchorElHolidays(event.currentTarget);
  const handleCloseHolidaysMenu = () => setAnchorElHolidays(null);

  return (
    <AppBar position="sticky" elevation={1} style={{ backgroundColor: "rgba(0, 60, 100, 0.96)" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Box to="/" sx={{ display: "flex", alignItems: "center", height: 65, }}>
            <Box component="img" src={logo} alt="DiaPredict" sx={{ height: 40, mr: 1 }} />
            <Typography variant="h5" fontWeight="bold" sx={{ mr: 10, color: 'inherit', textDecoration: 'none' }}>
              SkyGuard
            </Typography>
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" color="inherit" onClick={handleOpenNavMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
              {navigation.map((route) => {
                if (route.items) {
                  return (
                    <div key={route.name}>
                      <MenuItem disabled>{route.name}</MenuItem>
                      {route.items.map((item) => (
                        <MenuItem
                          key={item.name}
                          sx={{ pl: 4 }}
                          onClick={() => {
                            navigate(item.to);
                            handleCloseNavMenu();
                          }}
                        >
                          {item.name}
                        </MenuItem>
                      ))}
                    </div>
                  );
                }
                return (
                  <MenuItem
                    key={route.name}
                    onClick={() => {
                      navigate(route.to);
                      handleCloseNavMenu();
                    }}
                  >
                    {route.name}
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {navigation.map((route) => {
              // role check
              if (route.roles && !route.roles.includes(userRole)) return null;
              // Check if this is the Users menu
              if (route.name === 'Users' && route.items) {
                return (
                  <div key={route.name}>
                    <Button onClick={handleOpenUsersMenu} sx={{ color: 'white', mx: 1 }}>
                      {route.name}
                    </Button>
                    <Menu
                      anchorEl={anchorElUsers}
                      open={Boolean(anchorElUsers)}
                      onClose={handleCloseUsersMenu}
                    >
                      {route.items
                        .filter(item => !item.roles || item.roles.includes(userRole))
                        .map((item) => (
                          <MenuItem
                            key={item.name}
                            onClick={() => {
                              navigate(item.to);
                              handleCloseUsersMenu();
                            }}
                          >
                            {item.name}
                          </MenuItem>
                        ))}
                    </Menu>
                  </div>
                );
              }

              // ✅ REPORTS submenu (NEW — SAME AS USERS)
              if (route.name === 'Reports' && route.items) {
                return (
                  <div key={route.name}>
                    <Button onClick={handleOpenReportsMenu} sx={{ color: 'white', mx: 1 }}>
                      {route.name}
                    </Button>
                    <Menu
                      anchorEl={anchorElReports}
                      open={Boolean(anchorElReports)}
                      onClose={handleCloseReportsMenu}
                    >
                      {route.items
                        .filter(item => !item.roles || item.roles.includes(userRole))
                        .map((item) => (
                          <MenuItem
                            key={item.name}
                            onClick={() => {
                              navigate(item.to);
                              handleCloseReportsMenu();
                            }}
                          >
                            {item.name}
                          </MenuItem>
                        ))}
                    </Menu>
                  </div>
                );
              }
              if (route.name === 'Flights' && route.items) {
                return (
                  <div key={route.name}>
                    <Button onClick={handleOpenFlightsMenu} sx={{ color: 'white', mx: 1 }}>
                      {route.name}
                    </Button>
                    <Menu
                      anchorEl={anchorElFlights}
                      open={Boolean(anchorElFlights)}
                      onClose={handleCloseFlightsMenu}
                    >
                      {route.items
                        .filter(item => !item.roles || item.roles.includes(userRole))
                        .map((item) => (
                          <MenuItem
                            key={item.name}
                            onClick={() => {
                              navigate(item.to);
                              handleCloseFlightsMenu();
                            }}
                          >
                            {item.name}
                          </MenuItem>
                        ))}
                    </Menu>
                  </div>
                );
              }
              if (route.name === 'Holidays' && route.items) {
                return (
                  <div key={route.name}>
                    <Button onClick={handleOpenHolidaysMenu} sx={{ color: 'white', mx: 1 }}>
                      {route.name}
                    </Button>
                    <Menu
                      anchorEl={anchorElHolidays}
                      open={Boolean(anchorElHolidays)}
                      onClose={handleCloseHolidaysMenu}
                    >
                      {route.items
                        .filter(item => !item.roles || item.roles.includes(userRole))
                        .map((item) => (
                          <MenuItem
                            key={item.name}
                            onClick={() => {
                              navigate(item.to);
                              handleCloseHolidaysMenu();
                            }}
                          >
                            {item.name}
                          </MenuItem>
                        ))}
                    </Menu>
                  </div>
                );
              }

              // normal menu
              return (
                <Button
                  key={route.name}
                  component={NavLink}
                  to={route.to}
                  sx={{
                    color: 'white',
                    mx: 1,
                    '&.active': { borderBottom: '2px solid white' },
                  }}
                >
                  {route.name}
                </Button>
              );
            })}
          </Box>

          {/* Right Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={toggleTheme}>
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
          <AppHeaderDropdown />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppHeader;
