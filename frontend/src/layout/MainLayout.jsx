import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  Folder,
  Upload,
  People,
  School,
  ExitToApp,
  Person
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout, isTeacher, isStudent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleProfileMenuClose();
  };

  const teacherMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/teacher/dashboard' },
    { text: 'Your Uploads', icon: <Upload />, path: '/teacher/uploads' },
    { text: 'Create Folder', icon: <Folder />, path: '/teacher/create-folder' },
    { text: 'Post Material', icon: <Upload />, path: '/teacher/post-material' },
    { text: 'Profile', icon: <People />, path: '/profile' }
  ];

  const studentMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/student/dashboard' },
    { text: 'Profile', icon: <People />, path: '/profile' }
  ];

  const menuItems = isTeacher ? teacherMenuItems : studentMenuItems;

  const drawer = (
    <Box sx={{ width: { xs: 280, sm: 250 } }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          EduShare
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1976d2'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              EduShare - {isTeacher ? 'Teacher' : 'Student'} Portal
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
              EduShare
            </Box>
          </Typography>
          <Button
            color="inherit"
            startIcon={<AccountCircle />}
            onClick={handleProfileMenuOpen}
            sx={{ 
              '& .MuiButton-startIcon': {
                mr: { xs: 0, sm: 1 }
              }
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Profile
            </Box>
            <Avatar 
              sx={{ 
                width: 24, 
                height: 24, 
                fontSize: '0.75rem',
                bgcolor: 'rgba(255,255,255,0.2)',
                display: { xs: 'inline-flex', sm: 'none' }
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <Avatar sx={{ mr: 2, width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                {(localStorage.getItem('name') || user?.name || 'User')?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {localStorage.getItem('name') || user?.name || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {localStorage.getItem('email') || user?.email || 'user@example.com'}
                </Typography>
                {(localStorage.getItem('branch') || user?.branch) && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {localStorage.getItem('branch') || user?.branch}
                    {(localStorage.getItem('year') || user?.year) && ` - ${localStorage.getItem('year') || user?.year}`}
                  </Typography>
                )}
              </Box>
            </MenuItem>
            <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
              <Person sx={{ mr: 2 }} />
              Edit Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: 250 }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: { xs: 280, sm: 250 },
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - 250px)` },
          mt: { xs: 7, sm: 8 }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;