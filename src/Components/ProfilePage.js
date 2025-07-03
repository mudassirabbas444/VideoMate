import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { Edit, Play, Heart, MessageCircle } from 'lucide-react';
import { CircularProgress, Alert, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const API_BASE = 'http://localhost:5000';

const ProfilePage = () => {
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not logged in');
        const resUser = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resUser.ok) throw new Error('Failed to fetch user');
        const userData = await resUser.json();
        setUser(userData);
        // Fetch user's videos
        const resVideos = await fetch(`${API_BASE}/api/videos?uploader=${userData._id}`);
        if (!resVideos.ok) throw new Error('Failed to fetch videos');
        const videoData = await resVideos.json();
        setVideos(videoData);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    setDeletingId(videoId);
    setDeleteError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/videos/${videoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete video');
      setVideos(videos => videos.filter(v => v._id !== videoId));
    } catch (err) {
      setDeleteError('Could not delete video.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed'
    }}>
      <Box sx={{ p: 4, mt: 2 }}>
        <Paper 
          elevation={12} 
          sx={{ 
            maxWidth: 900, 
            mx: 'auto', 
            borderRadius: 4, 
            p: 4,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}
        >
          <Box sx={{ 
            background: theme.palette.mode === 'dark' 
              ? 'rgba(30,30,30,0.95)' 
              : 'rgba(255,255,255,0.95)', 
            borderRadius: 3, 
            p: 4, 
            backdropFilter: 'blur(10px)' 
          }}>
            {loading && <Box sx={{ textAlign: 'center', my: 8 }}><CircularProgress /></Box>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
            {user && (
              <>
                <Stack direction="row" spacing={3} alignItems="center" mb={4}>
                  <Avatar 
                    src={user.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                    sx={{ 
                      width: 100, 
                      height: 100,
                      border: '4px solid #FF6B6B',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1) rotate(5deg)',
                        borderColor: '#4ECDC4',
                        boxShadow: '0 8px 25px rgba(255,107,107,0.3)'
                      }
                    }} 
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h3" 
                      fontWeight="bold"
                      sx={{ 
                        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1
                      }}
                    >
                      {user.username || user.name}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" mb={2}>{user.bio || 'No bio yet.'}</Typography>
                    <Stack direction="row" spacing={4}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Heart size={20} color="#FF6B6B" />
                        <Typography variant="body1" fontWeight="bold">
                          {user.followers?.toLocaleString() || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Followers</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <MessageCircle size={20} color="#4ECDC4" />
                        <Typography variant="body1" fontWeight="bold">
                          {user.following?.toLocaleString() || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Following</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Play size={20} color="#45B7D1" />
                        <Typography variant="body1" fontWeight="bold">
                          {videos.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Videos</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                  <Button 
                    variant="outlined" 
                    startIcon={<Edit size={20} />}
                    sx={{ 
                      borderColor: '#FF6B6B',
                      color: '#FF6B6B',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
                        borderColor: 'transparent',
                        color: '#fff',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(255,107,107,0.3)'
                      }
                    }}
                  >
                    Edit Profile
                  </Button>
                </Stack>
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  mb={3}
                  sx={{ 
                    background: 'linear-gradient(45deg, #4ECDC4, #45B7D1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  My Videos
                </Typography>
                <Grid container spacing={3}>
                  {videos.map((video, idx) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                      <Box 
                        sx={{ 
                          borderRadius: 3, 
                          overflow: 'hidden', 
                          boxShadow: 4,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          '&:hover': {
                            transform: 'scale(1.05) translateY(-5px)',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.3)'
                          }
                        }}
                      >
                        <img 
                          src={video.thumbnailUrl ? `${API_BASE}${video.thumbnailUrl}` : '/logo192.png'} 
                          alt={video.title} 
                          style={{ 
                            width: '100%', 
                            height: 150, 
                            objectFit: 'cover',
                            transition: 'all 0.3s ease'
                          }} 
                        />
                        <Box sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 2,
                          bgcolor: 'rgba(255,255,255,0.85)',
                          borderRadius: '50%',
                          boxShadow: 2
                        }}>
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={e => { e.stopPropagation(); handleDelete(video._id); }}
                            disabled={deletingId === video._id}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '&:hover': { opacity: 1 }
                        }}>
                          <Play size={40} color="#fff" />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProfilePage; 