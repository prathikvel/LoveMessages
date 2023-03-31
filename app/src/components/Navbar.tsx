import { useState } from "react";
import { NavLink } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MenuIcon from "@mui/icons-material/Menu";

import { useAuth } from "../features/auth";

const pages = [
  { name: "Authored", to: "/loveMessages/authored" },
  { name: "Received", to: "/loveMessages/received" },
];

const Navbar = () => {
  // nav dropdown
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const handleOpenNavMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(e.currentTarget);
  };
  const handleCloseNavMenu = () => setAnchorElNav(null);

  // user dropdown
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(e.currentTarget);
  };
  const handleCloseUserClose = () => setAnchorElUser(null);

  // logout
  const auth = useAuth();
  const handleLogout = () => {
    handleCloseUserClose();
    auth.onLogout();
  };

  const Navbar = auth.user ? (
    <Toolbar>
      {/* MOBILE LEFT */}
      <Box sx={{ display: { xs: "flex", md: "none" }, flexGrow: 1 }}>
        <IconButton color="inherit" size="large" onClick={handleOpenNavMenu}>
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorElNav}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          keepMounted
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
        >
          {pages.map(({ name, to }) => (
            <MenuItem key={to} component={NavLink} to={to}>
              {name}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* MOBILE CENTER / DESKTOP LEFT */}
      <FavoriteIcon sx={{ mr: 1 }} />
      <Typography
        component={NavLink}
        to="/"
        noWrap
        variant="h6"
        sx={{
          mr: 2,
          color: "inherit",
          textDecoration: "none",
          flexGrow: { xs: 1, md: 0 },
        }}
      >
        Project Meghna
      </Typography>

      {/* DESKTOP LEFT */}
      <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}>
        {pages.map(({ name, to }) => (
          <Button key={to} component={NavLink} to={to} color="inherit">
            {name}
          </Button>
        ))}
      </Box>

      {/* RIGHT */}
      <Box>
        <IconButton color="inherit" size="large" onClick={handleOpenUserMenu}>
          <AccountCircleIcon />
        </IconButton>
        <Menu
          anchorEl={anchorElUser}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </Toolbar>
  ) : (
    <Toolbar>
      {/* LEFT */}
      <FavoriteIcon sx={{ mr: 1 }} />
      <Typography
        component={NavLink}
        to="/"
        noWrap
        variant="h6"
        sx={{ color: "inherit", textDecoration: "none", flexGrow: 1 }}
      >
        Project Meghna
      </Typography>

      {/* RIGHT */}
      <Button component={NavLink} to="/login" color="inherit">
        Login
      </Button>
    </Toolbar>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">{Navbar}</AppBar>
    </Box>
  );
};

export default Navbar;
