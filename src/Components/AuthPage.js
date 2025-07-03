import React, { useState } from 'react';
import { Box, Paper, Tabs, Tab, Typography, TextField, Button, Stack, InputAdornment, IconButton, Fade, Divider, Alert, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Visibility, VisibilityOff, Google, Facebook } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api/auth';

const AuthPage = () => {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [signup, setSignup] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    setErrors({});
    setServerError('');
    setSuccess('');
  };

  const handleInput = (type, field, value) => {
    if (type === 'login') setLogin({ ...login, [field]: value });
    else setSignup({ ...signup, [field]: value });
  };

  const validate = (type) => {
    let err = {};
    if (type === 'login') {
      if (!login.email) err.email = 'Email is required';
      if (!login.password) err.password = 'Password is required';
    } else {
      if (!signup.username) err.username = 'Username is required';
      if (!signup.email) err.email = 'Email is required';
      if (!signup.password) err.password = 'Password is required';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    if (!validate('login')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login)
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.message || 'Login failed');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess('Login successful!');
        setServerError('');
        navigate('/');
      }
    } catch (err) {
      setServerError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    if (!validate('signup')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signup)
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.message || 'Signup failed');
      } else {
        setSuccess('Signup successful! You can now log in.');
        setServerError('');
        setTab(0);
      }
    } catch (err) {
      setServerError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed'
    }}>
      <Fade in>
        <Paper elevation={16} sx={{
          maxWidth: 400,
          width: '100%',
          borderRadius: 4,
          p: 4,
          background: theme.palette.mode === 'dark'
            ? 'rgba(30,30,30,0.98)'
            : 'rgba(255,255,255,0.98)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
          transition: 'background 0.5s',
        }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 3 }}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Fade in={tab === 0} unmountOnExit>
            <Box component="form" onSubmit={handleLogin} sx={{ display: tab === 0 ? 'block' : 'none' }}>
              <Stack spacing={3}>
                <Typography variant="h4" fontWeight="bold" align="center" sx={{
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>Welcome Back</Typography>
                <TextField
                  label="Email"
                  type="email"
                  value={login.email}
                  onChange={e => handleInput('login', 'email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  autoComplete="email"
                />
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={login.password}
                  onChange={e => handleInput('login', 'password', e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  fullWidth
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(v => !v)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                    fontWeight: 'bold',
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #4ECDC4, #FF6B6B)'
                    }
                  }}
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={22} color="inherit" /> : null}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                <Divider>or</Divider>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button variant="outlined" startIcon={<Google />} sx={{ flex: 1 }}>Google</Button>
                  <Button variant="outlined" startIcon={<Facebook />} sx={{ flex: 1 }}>Facebook</Button>
                </Stack>
              </Stack>
            </Box>
          </Fade>

          <Fade in={tab === 1} unmountOnExit>
            <Box component="form" onSubmit={handleSignup} sx={{ display: tab === 1 ? 'block' : 'none' }}>
              <Stack spacing={3}>
                <Typography variant="h4" fontWeight="bold" align="center" sx={{
                  background: 'linear-gradient(45deg, #4ECDC4, #FF6B6B)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>Create Account</Typography>
                <TextField
                  label="Username"
                  value={signup.username}
                  onChange={e => handleInput('signup', 'username', e.target.value)}
                  error={!!errors.username}
                  helperText={errors.username}
                  fullWidth
                  autoComplete="username"
                />
                <TextField
                  label="Email"
                  type="email"
                  value={signup.email}
                  onChange={e => handleInput('signup', 'email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  autoComplete="email"
                />
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={signup.password}
                  onChange={e => handleInput('signup', 'password', e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  fullWidth
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(v => !v)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(45deg, #4ECDC4, #FF6B6B)',
                    fontWeight: 'bold',
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)'
                    }
                  }}
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={22} color="inherit" /> : null}
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </Button>
                <Divider>or</Divider>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button variant="outlined" startIcon={<Google />} sx={{ flex: 1 }}>Google</Button>
                  <Button variant="outlined" startIcon={<Facebook />} sx={{ flex: 1 }}>Facebook</Button>
                </Stack>
              </Stack>
            </Box>
          </Fade>
        </Paper>
      </Fade>
    </Box>
  );
};

export default AuthPage; 