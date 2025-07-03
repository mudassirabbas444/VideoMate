import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { styled, alpha } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Sparkles, User } from 'lucide-react';
import { useTheme } from './ThemeContext';

const Navbar = ({ minimal = false }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon />, path: '/' },
    { id: 'upload', label: 'Upload', icon: <AddCircleOutlineIcon />, path: '/upload' },
    { id: 'profile', label: 'Profile', icon: <PersonIcon />, path: '/profile' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="static"
      sx={{
        background: isDarkMode
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
          : 'white',
        color: isDarkMode ? '#fff' : '#222',
        boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.06)',
        borderBottom: isDarkMode ? '2px solid rgba(255,255,255,0.1)' : '1px solid #eee',
        zIndex: 1200
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={4} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => navigate('/') }>
            <Box sx={{
              animation: 'spin 3s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}>
              <Sparkles size={32} color={isDarkMode ? '#fff' : '#FF6B6B'} />
            </Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                background: isDarkMode
                  ? 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1)'
                  : 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #FFD700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradient 3s ease infinite',
                '@keyframes gradient': {
                  '0%, 100%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' }
                }
              }}
            >
              Streamr
            </Typography>
          </Stack>
          {!minimal && (
            <Stack direction="row" spacing={1}>
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: isActive(item.path)
                      ? (isDarkMode ? '#fff' : '#FF6B6B')
                      : (isDarkMode ? 'rgba(255,255,255,0.8)' : '#444'),
                    background: isActive(item.path)
                      ? (isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,107,107,0.08)')
                      : 'transparent',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: isDarkMode
                        ? 'rgba(255,255,255,0.15)'
                        : 'rgba(255,107,107,0.12)',
                      transform: 'translateY(-2px)',
                      boxShadow: isDarkMode
                        ? '0 4px 12px rgba(0,0,0,0.2)'
                        : '0 2px 8px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          )}
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            onClick={toggleTheme}
            sx={{
              color: isDarkMode ? 'rgba(255,255,255,0.9)' : '#FFD700',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1) rotate(180deg)',
                color: '#FFD700'
              }
            }}
          >
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {!minimal && (
            token ? (
              <Button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/auth';
                }}
                sx={{ color: isDarkMode ? '#fff' : '#FF6B6B', fontWeight: 600 }}
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                sx={{ color: isDarkMode ? '#fff' : '#FF6B6B', fontWeight: 600 }}
              >
                Login / Signup
              </Button>
            )
          )}
          {!minimal && (
            <Avatar
              sx={{
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                width: 40,
                height: 40,
                ml: 1,
                '&:hover': {
                  transform: 'scale(1.1) rotate(10deg)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                }
              }}
              onClick={() => navigate('/profile')}
            >
              <User size={20} />
            </Avatar>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 