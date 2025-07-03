import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import { Upload, Tag, Eye, EyeOff, DollarSign, Lock, Globe, Users } from 'lucide-react';
import { Alert, CircularProgress, LinearProgress } from '@mui/material';

const API_BASE = 'http://localhost:5000/api/videos';

const VideoUploadPage = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailURL, setThumbnailURL] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [monetization, setMonetization] = useState(false);
  const [ageRestriction, setAgeRestriction] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const theme = useTheme();

  const categories = [
    'Entertainment', 'Music', 'Gaming', 'Education', 'Sports', 
    'Technology', 'Cooking', 'Travel', 'Fashion', 'Comedy'
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    if (file) {
      setVideoURL(URL.createObjectURL(file));
    } else {
      setVideoURL('');
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) {
      setThumbnailURL(URL.createObjectURL(file));
    } else {
      setThumbnailURL('');
    }
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setProgress(0);
    if (!videoFile || !title) {
      setError('Video file and title are required.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      if (thumbnail) formData.append('thumbnail', thumbnail);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('tags', JSON.stringify(tags));
      formData.append('privacy', privacy);
      formData.append('monetization', monetization);
      formData.append('ageRestriction', ageRestriction);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/upload`);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      xhr.onload = () => {
        setLoading(false);
        if (xhr.status === 201) {
          setSuccess('Video uploaded successfully!');
          setError('');
          setTitle('');
          setDescription('');
          setCategory('');
          setTags([]);
          setVideoFile(null);
          setVideoURL('');
          setThumbnail(null);
          setThumbnailURL('');
          setPrivacy('public');
          setMonetization(false);
          setAgeRestriction(false);
        } else {
          setError(JSON.parse(xhr.responseText).message || 'Upload failed.');
        }
      };
      xhr.onerror = () => {
        setLoading(false);
        setError('Network error.');
      };
      xhr.send(formData);
    } catch (err) {
      setLoading(false);
      setError('Upload failed.');
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
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, mt: 2 }}>
        <Paper 
          elevation={12} 
          sx={{ 
            maxWidth: 800, 
            width: '100%', 
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
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              mb={4}
              sx={{ 
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center'
              }}
            >
              Upload Video
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            {loading && <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />}
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                {/* Video Upload Section */}
                <Box sx={{ 
                  border: '2px dashed #FF6B6B', 
                  borderRadius: 3, 
                  p: 4, 
                  textAlign: 'center',
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(255,107,107,0.1)' 
                    : 'rgba(255,107,107,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#4ECDC4',
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(78,205,196,0.1)' 
                      : 'rgba(78,205,196,0.05)',
                    transform: 'scale(1.02)'
                  }
                }}>
                  <Upload size={48} color="#FF6B6B" style={{ marginBottom: 16 }} />
                  <Button 
                    variant="contained" 
                    component="label"
                    sx={{
                      background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(255,107,107,0.3)'
                      }
                    }}
                  >
                    Select Video File
                    <input type="file" accept="video/*" hidden onChange={handleFileChange} />
                  </Button>
                  {videoFile && (
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Selected: {videoFile.name}
                    </Typography>
                  )}
                </Box>

                {videoURL && (
                  <Box sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
                    <video 
                      src={videoURL} 
                      controls 
                      style={{ width: '100%', borderRadius: 8 }} 
                    />
                  </Box>
                )}

                {/* Basic Info */}
                <Stack spacing={3}>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#FF6B6B' }}>
                    Basic Information
                  </Typography>
                  
                  <TextField
                    label="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#FF6B6B' },
                        '&.Mui-focused fieldset': { borderColor: '#4ECDC4' }
                      }
                    }}
                  />
                  
                  <TextField
                    label="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#FF6B6B' },
                        '&.Mui-focused fieldset': { borderColor: '#4ECDC4' }
                      }
                    }}
                  />

                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={category}
                      label="Category"
                      onChange={e => setCategory(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          '&:hover': { borderColor: '#FF6B6B' }
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4ECDC4'
                        }
                      }}
                    >
                      {categories.map(cat => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>

                <Divider sx={{ borderColor: theme.palette.divider }} />

                {/* Tags Section */}
                <Stack spacing={2}>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#4ECDC4' }}>
                    Tags
                  </Typography>
                  
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                      label="Add Tag"
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleAddTag()}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button 
                      onClick={handleAddTag}
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(45deg, #4ECDC4, #6EDDD6)',
                        '&:hover': { transform: 'scale(1.05)' }
                      }}
                    >
                      <Tag size={20} />
                    </Button>
                  </Stack>
                  
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {tags.map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        sx={{
                          background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
                          color: '#fff',
                          '&:hover': { transform: 'scale(1.05)' }
                        }}
                      />
                    ))}
                  </Stack>
                </Stack>

                <Divider sx={{ borderColor: theme.palette.divider }} />

                {/* Thumbnail Section */}
                <Stack spacing={2}>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#45B7D1' }}>
                    Thumbnail
                  </Typography>
                  
                  <Button 
                    variant="outlined" 
                    component="label"
                    sx={{ 
                      borderColor: '#45B7D1', 
                      color: '#45B7D1',
                      '&:hover': { 
                        borderColor: '#6BC5D8',
                        background: theme.palette.mode === 'dark' 
                          ? 'rgba(69,183,209,0.1)' 
                          : 'rgba(69,183,209,0.1)'
                      }
                    }}
                  >
                    Select Thumbnail
                    <input type="file" accept="image/*" hidden onChange={handleThumbnailChange} />
                  </Button>
                  
                  {thumbnailURL && (
                    <Box sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
                      <img 
                        src={thumbnailURL} 
                        alt="Thumbnail" 
                        style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} 
                      />
                    </Box>
                  )}
                </Stack>

                <Divider sx={{ borderColor: theme.palette.divider }} />

                {/* Settings Section */}
                <Stack spacing={3}>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#FFD700' }}>
                    Settings
                  </Typography>
                  
                  <FormControl fullWidth>
                    <InputLabel>Privacy</InputLabel>
                    <Select
                      value={privacy}
                      label="Privacy"
                      onChange={e => setPrivacy(e.target.value)}
                      startAdornment={
                        privacy === 'public' ? <Globe size={20} /> : 
                        privacy === 'unlisted' ? <Eye size={20} /> : 
                        <Lock size={20} />
                      }
                    >
                      <MenuItem value="public">Public</MenuItem>
                      <MenuItem value="unlisted">Unlisted</MenuItem>
                      <MenuItem value="private">Private</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={monetization} 
                        onChange={e => setMonetization(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#FFD700',
                            '&:hover': { backgroundColor: 'rgba(255,215,0,0.1)' }
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#FFD700'
                          }
                        }}
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <DollarSign size={20} color="#FFD700" />
                        <Typography>Enable Monetization</Typography>
                      </Stack>
                    }
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={ageRestriction} 
                        onChange={e => setAgeRestriction(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#FF6B6B',
                            '&:hover': { backgroundColor: 'rgba(255,107,107,0.1)' }
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#FF6B6B'
                          }
                        }}
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Users size={20} color="#FF6B6B" />
                        <Typography>Age Restriction (18+)</Typography>
                      </Stack>
                    }
                  />
                </Stack>

                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  disabled={!videoFile || !title || loading}
                  sx={{
                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 30px rgba(255,107,107,0.4)'
                    },
                    '&:disabled': {
                      background: '#ccc',
                      transform: 'none',
                      boxShadow: 'none'
                    }
                  }}
                >
                  {loading ? <><CircularProgress size={22} color="inherit" sx={{ mr: 1 }} />Uploading...</> : 'Upload Video'}
                </Button>
              </Stack>
            </form>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default VideoUploadPage; 