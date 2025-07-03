import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { styled, alpha, useTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DiamondIcon from '@mui/icons-material/Diamond';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// Fallback lucide-react icons
import { Sparkles, Crown, Target, Play, Heart, Bookmark, Share, Trophy, Music, ChefHat, Zap, MessageCircle, Award, Camera, Video, Mic, User, TrendingUp, Users, Rocket, Diamond, Star, Settings } from 'lucide-react';
import { CircularProgress, Alert } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import VideoPlayerScroller from './VideoPlayerScroller';

const API_BASE = 'http://localhost:5000/api/videos';
const UPLOADS_BASE = 'http://localhost:5000';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1.5, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

const StreamrInterface = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerIndex, setPlayerIndex] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}`);
        if (!res.ok) throw new Error('Failed to fetch videos');
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        setError('Could not load videos.');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleCardClick = (idx) => {
    setPlayerIndex(idx);
    setPlayerOpen(true);
  };

  const ContentCard = ({ video, idx }) => (
    <Card onClick={() => handleCardClick(idx)} sx={{
      cursor: 'pointer',
      borderRadius: 4,
      boxShadow: 6,
      position: 'relative',
      overflow: 'hidden',
      minHeight: 350,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: 12
      }
    }}>
      <CardMedia
        component="img"
        height="200"
        image={video.thumbnailUrl ? `${UPLOADS_BASE}${video.thumbnailUrl}` : '/logo192.png'}
        alt={video.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ bgcolor: 'background.paper', minHeight: 120 }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
          <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200', borderRadius: '50%', p: 1, display: 'flex', alignItems: 'center' }}>
            <Play size={24} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">{video.title}</Typography>
            <Typography variant="body2" color="text.secondary">{video.category}</Typography>
          </Box>
        </Stack>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {video.description?.slice(0, 80)}{video.description && video.description.length > 80 ? '...' : ''}
        </Typography>
        <Stack direction="row" spacing={3} mt={2}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Heart size={16} />
            <Typography variant="caption">0</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <MessageCircle size={16} />
            <Typography variant="caption">0</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Bookmark size={16} />
            <Typography variant="caption">0</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed'
    }}>
      {/* Main Content */}
      <Box sx={{ px: 4, py: 6 }}>
        {/* Hero Search */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            fontWeight="bold" 
            sx={{ 
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 4,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Discover Amazing Content
          </Typography>
          <Box sx={{ maxWidth: 800, mx: 'auto', position: 'relative' }}>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: theme.palette.text.secondary }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search for trending videos, creators, challenges..."
              sx={{ 
                width: '100%', 
                bgcolor: 'background.paper', 
                borderRadius: 4, 
                pl: 6, 
                pr: 10, 
                py: 2, 
                boxShadow: 3,
                border: `1px solid ${theme.palette.divider}`
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
            <Box sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 1 }}>
              <IconButton color="primary">
                <Camera size={20} />
              </IconButton>
              <IconButton color="primary">
                <Video size={20} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Stats Bar */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ 
              p: 3, 
              borderRadius: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(255,107,107,0.1), rgba(255,142,142,0.1))'
                : 'linear-gradient(135deg, rgba(255,107,107,0.05), rgba(255,142,142,0.05))',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,107,107,0.2)' : 'rgba(255,107,107,0.1)'}`
            }}>
              <Box sx={{ bgcolor: 'secondary.main', borderRadius: 2, p: 1 }}>
                <TrendingUpIcon sx={{ color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold">2.5M</Typography>
                <Typography variant="body2" color="text.secondary">Trending Now</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ 
              p: 3, 
              borderRadius: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(78,205,196,0.1), rgba(110,221,214,0.1))'
                : 'linear-gradient(135deg, rgba(78,205,196,0.05), rgba(110,221,214,0.05))',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(78,205,196,0.2)' : 'rgba(78,205,196,0.1)'}`
            }}>
              <Box sx={{ bgcolor: 'info.main', borderRadius: 2, p: 1 }}>
                <GroupIcon sx={{ color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold">850K</Typography>
                <Typography variant="body2" color="text.secondary">Active Users</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ 
              p: 3, 
              borderRadius: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(69,183,209,0.1), rgba(107,197,216,0.1))'
                : 'linear-gradient(135deg, rgba(69,183,209,0.05), rgba(107,197,216,0.05))',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(69,183,209,0.2)' : 'rgba(69,183,209,0.1)'}`
            }}>
              <Box sx={{ bgcolor: 'success.main', borderRadius: 2, p: 1 }}>
                <RocketLaunchIcon sx={{ color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold">15K</Typography>
                <Typography variant="body2" color="text.secondary">New Today</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ 
              p: 3, 
              borderRadius: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,229,92,0.1))'
                : 'linear-gradient(135deg, rgba(255,215,0,0.05), rgba(255,229,92,0.05))',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,215,0,0.2)' : 'rgba(255,215,0,0.1)'}`
            }}>
              <Box sx={{ bgcolor: 'warning.main', borderRadius: 2, p: 1 }}>
                <DiamondIcon sx={{ color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold">99%</Typography>
                <Typography variant="body2" color="text.secondary">Satisfaction</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* For You Section */}
        <Box sx={{ mb: 8 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                sx={{ 
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                For You
              </Typography>
              <Sparkles size={24} color="#FF6B6B" />
            </Stack>
            <Button 
              variant="contained" 
              color="secondary" 
              endIcon={<Target size={18} />}
              sx={{
                background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF8E8E, #FF6B6B)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              View All
            </Button>
          </Stack>
          {loading ? (
            <Box sx={{ textAlign: 'center', my: 8 }}><CircularProgress /></Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : videos.length === 0 ? (
            <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', my: 8 }}>
              No videos found. Be the first to upload!
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {videos.map((video, idx) => (
                <Grid item xs={12} sm={6} md={3} key={video._id}>
                  <ContentCard video={video} idx={idx} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Following Section */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                sx={{ 
                  background: 'linear-gradient(45deg, #4ECDC4, #45B7D1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Following
              </Typography>
              <StarIcon sx={{ color: '#4ECDC4', animation: 'spin 2s linear infinite' }} />
            </Stack>
            <Button 
              variant="contained" 
              color="info" 
              endIcon={<SettingsIcon />}
              sx={{
                background: 'linear-gradient(45deg, #4ECDC4, #6EDDD6)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #6EDDD6, #4ECDC4)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Manage
            </Button>
          </Stack>
          <Grid container spacing={3}>
            {/* Following content demo */}
          </Grid>
        </Box>
      </Box>
      <Dialog fullScreen open={playerOpen} onClose={() => setPlayerOpen(false)}>
        <VideoPlayerScroller videos={videos} startIndex={playerIndex} onClose={() => setPlayerOpen(false)} />
      </Dialog>
    </Box>
  );
};

export default StreamrInterface;