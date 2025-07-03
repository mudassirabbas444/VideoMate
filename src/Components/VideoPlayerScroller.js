import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import { Play, Pause, Heart, Bookmark, Share, MessageCircle, User } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import moment from 'moment';

const UPLOADS_BASE = 'http://localhost:5000';
const API_BASE = 'http://localhost:5000/api/videos';

const VideoPlayerScroller = ({ videos, startIndex = 0, onClose, fetchMoreVideos, hasMore }) => {
  const [current, setCurrent] = useState(startIndex);
  const [likeState, setLikeState] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loadingMore, setLoadingMore] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef([]);
  const theme = useTheme();
  const containerRef = useRef();
  const token = localStorage.getItem('token');
  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);

  // Fetch like/bookmark state for all videos on mount
  useEffect(() => {
    const fetchStates = async () => {
      const newState = {};
      for (const v of videos) {
        newState[v._id] = {
          liked: v.likes?.includes(getUserId()),
          likes: v.likes?.length || 0,
          bookmarked: v.bookmarks?.includes(getUserId()),
          bookmarks: v.bookmarks?.length || 0
        };
      }
      setLikeState(newState);
    };
    fetchStates();
    // eslint-disable-next-line
  }, [videos]);

  // Scroll to current video on mount or change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: current * window.innerHeight,
        behavior: 'smooth'
      });
    }
    // Pause all videos except current
    videoRefs.current.forEach((ref, idx) => {
      if (ref) {
        if (idx === current && isPlaying) {
          ref.play();
        } else {
          ref.pause();
        }
      }
    });
  }, [current, isPlaying]);

  // Handle wheel/keyboard for navigation
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY > 0 && current < videos.length - 1) setCurrent(c => c + 1);
      else if (e.deltaY < 0 && current > 0) setCurrent(c => c - 1);
    };
    const handleKey = (e) => {
      if (e.key === 'ArrowDown' && current < videos.length - 1) setCurrent(c => c + 1);
      else if (e.key === 'ArrowUp' && current > 0) setCurrent(c => c - 1);
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKey);
    };
  }, [current, videos.length, onClose]);

  // Infinite scroll: fetch more when at last video
  useEffect(() => {
    if (current === videos.length - 1 && hasMore && fetchMoreVideos) {
      setLoadingMore(true);
      fetchMoreVideos().finally(() => setLoadingMore(false));
    }
    // eslint-disable-next-line
  }, [current, videos.length, hasMore]);

  function getUserId() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.id || user?._id;
    } catch {
      return null;
    }
  }

  const handleLike = async (video) => {
    if (!token) return setSnackbar({ open: true, message: 'Login required', severity: 'error' });
    const liked = likeState[video._id]?.liked;
    const url = `${API_BASE}/${video._id}/${liked ? 'unlike' : 'like'}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setLikeState(s => ({
      ...s,
      [video._id]: {
        ...s[video._id],
        liked: !liked,
        likes: data.likes
      }
    }));
  };

  const handleBookmark = async (video) => {
    if (!token) return setSnackbar({ open: true, message: 'Login required', severity: 'error' });
    const bookmarked = likeState[video._id]?.bookmarked;
    const url = `${API_BASE}/${video._id}/${bookmarked ? 'unbookmark' : 'bookmark'}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setLikeState(s => ({
      ...s,
      [video._id]: {
        ...s[video._id],
        bookmarked: !bookmarked,
        bookmarks: data.bookmarks
      }
    }));
  };

  const handleShare = (video) => {
    const url = `${window.location.origin}/video/${video._id}`;
    navigator.clipboard.writeText(url);
    setSnackbar({ open: true, message: 'Link copied to clipboard!', severity: 'success' });
  };

  const handlePlayPause = (idx) => {
    setIsPlaying((playing) => {
      if (playing) {
        videoRefs.current[idx]?.pause();
      } else {
        videoRefs.current[idx]?.play();
      }
      return !playing;
    });
  };

  const currentVideo = videos[current];

  const fetchComments = async () => {
    setCommentsLoading(true);
    setCommentsError('');
    try {
      const res = await fetch(`${API_BASE}/${currentVideo._id}/comments`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data);
    } catch (err) {
      setCommentsError('Could not load comments.');
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleOpenComments = () => {
    setCommentOpen(true);
    fetchComments();
  };

  const handleCloseComments = () => {
    setCommentOpen(false);
    setNewComment('');
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`${API_BASE}/${currentVideo._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: newComment })
      });
      if (!res.ok) throw new Error('Failed to post comment');
      const data = await res.json();
      setComments(c => [data, ...c]);
      setNewComment('');
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to post comment', severity: 'error' });
    } finally {
      setPosting(false);
    }
  };

  return (
    <Box ref={containerRef} sx={{
      height: '100vh',
      width: '100vw',
      overflowY: 'auto',
      scrollSnapType: 'y mandatory',
      bgcolor: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative',
    }}>
      {/* Top bar: video count and close */}
      <Box sx={{ position: 'fixed', top: 24, left: 32, zIndex: 20, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600, px: 2, py: 1, borderRadius: 2, background: 'rgba(0,0,0,0.4)', boxShadow: 2 }}>
          {current + 1} / {videos.length}
        </Typography>
      </Box>
      <IconButton onClick={onClose} sx={{ position: 'fixed', top: 24, right: 32, zIndex: 20, color: '#fff', bgcolor: 'rgba(0,0,0,0.4)', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}>
        <CloseIcon />
      </IconButton>
      <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <MuiAlert elevation={6} variant="filled" severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
      {videos.map((video, idx) => (
        <Box
          key={video._id}
          sx={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            scrollSnapAlign: 'start',
            position: 'relative',
            background: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)',
            overflow: 'hidden',
          }}
        >
          {/* Centered video with shadow and rounded corners */}
          <Box sx={{
            width: { xs: '100vw', sm: 400, md: 480 },
            height: { xs: '60vh', sm: 600, md: 700 },
            position: 'relative',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            borderRadius: 6,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000',
            mb: 2
          }}>
            <video
              ref={el => videoRefs.current[idx] = el}
              src={video.videoUrl ? `${UPLOADS_BASE}${video.videoUrl}` : ''}
              poster={video.thumbnailUrl ? `${UPLOADS_BASE}${video.thumbnailUrl}` : ''}
              autoPlay={idx === current}
              loop
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000', cursor: 'pointer' }}
              onClick={() => handlePlayPause(idx)}
            />
            {/* Play/Pause overlay */}
            {!isPlaying && idx === current && (
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'rgba(0,0,0,0.4)',
                borderRadius: '50%',
                p: 2,
                zIndex: 10
              }}>
                <Play size={48} color="#fff" />
              </Box>
            )}
          </Box>
          {/* Action bar (right) */}
          <Box sx={{
            position: 'absolute',
            right: { xs: 16, sm: 48 },
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            alignItems: 'center',
            background: 'rgba(0,0,0,0.15)',
            borderRadius: 4,
            p: 1
          }}>
            <IconButton onClick={() => handleLike(video)} sx={{
              color: likeState[video._id]?.liked ? '#FF6B6B' : '#fff',
              background: likeState[video._id]?.liked ? 'rgba(255,107,107,0.15)' : 'rgba(0,0,0,0.15)',
              boxShadow: likeState[video._id]?.liked ? '0 4px 16px #FF6B6B44' : 'none',
              transition: 'all 0.2s',
              '&:hover': { background: 'rgba(255,107,107,0.25)', transform: 'scale(1.15)' }
            }}>
              <Heart size={32} fill={likeState[video._id]?.liked ? '#FF6B6B' : 'none'} />
            </IconButton>
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, textAlign: 'center' }}>{likeState[video._id]?.likes || 0}</Typography>
            <IconButton onClick={() => handleBookmark(video)} sx={{
              color: likeState[video._id]?.bookmarked ? '#4ECDC4' : '#fff',
              background: likeState[video._id]?.bookmarked ? 'rgba(78,205,196,0.15)' : 'rgba(0,0,0,0.15)',
              boxShadow: likeState[video._id]?.bookmarked ? '0 4px 16px #4ECDC444' : 'none',
              transition: 'all 0.2s',
              '&:hover': { background: 'rgba(78,205,196,0.25)', transform: 'scale(1.15)' }
            }}>
              <Bookmark size={32} fill={likeState[video._id]?.bookmarked ? '#4ECDC4' : 'none'} />
            </IconButton>
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, textAlign: 'center' }}>{likeState[video._id]?.bookmarks || 0}</Typography>
            <IconButton onClick={() => handleShare(video)} sx={{
              color: '#FFD700',
              background: 'rgba(255,215,0,0.12)',
              transition: 'all 0.2s',
              '&:hover': { background: 'rgba(255,215,0,0.25)', transform: 'scale(1.15)' }
            }}>
              <Share size={32} />
            </IconButton>
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, textAlign: 'center' }}>Share</Typography>
            <IconButton onClick={handleOpenComments} sx={{ color: '#fff', background: 'rgba(0,0,0,0.15)', transition: 'all 0.2s', '&:hover': { background: 'rgba(0,0,0,0.25)', transform: 'scale(1.15)' } }}>
              <MessageCircle size={32} />
            </IconButton>
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, textAlign: 'center' }}>{comments.length || 'Comment'}</Typography>
          </Box>
          {/* Video info (bottom left) */}
          <Box sx={{
            position: 'absolute',
            left: { xs: 8, sm: 48 },
            bottom: { xs: 24, sm: 48 },
            zIndex: 10,
            color: '#fff',
            maxWidth: { xs: '90vw', sm: 400 },
            p: 2,
            background: 'rgba(0,0,0,0.35)',
            borderRadius: 4,
            boxShadow: 2
          }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
              <Avatar src={video.uploader?.avatar || ''} sx={{ width: 48, height: 48, bgcolor: '#FF6B6B' }}>
                <User size={24} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', lineHeight: 1.1 }}>
                  {video.uploader?.username || video.uploader?.name || 'Unknown User'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#FFD700' }}>{video.category}</Typography>
              </Box>
            </Stack>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff', mb: 1, lineHeight: 1.2 }}>{video.title}</Typography>
            <Typography variant="body2" sx={{ color: '#fff', opacity: 0.85 }}>{video.description}</Typography>
          </Box>
        </Box>
      ))}
      {loadingMore && <Box sx={{ textAlign: 'center', my: 4 }}><CircularProgress /></Box>}
      {!hasMore && <Typography align="center" color="text.secondary" sx={{ my: 4 }}>No more videos</Typography>}
      <Dialog open={commentOpen} onClose={handleCloseComments} fullWidth maxWidth="sm">
        <DialogTitle>Comments</DialogTitle>
        <DialogContent dividers sx={{ minHeight: 200 }}>
          {commentsLoading ? (
            <Box sx={{ textAlign: 'center', my: 4 }}><CircularProgress /></Box>
          ) : commentsError ? (
            <Typography color="error">{commentsError}</Typography>
          ) : comments.length === 0 ? (
            <Typography color="text.secondary">No comments yet. Be the first!</Typography>
          ) : (
            comments.map((c) => (
              <Stack direction="row" spacing={2} alignItems="flex-start" key={c._id} sx={{ mb: 2 }}>
                <Avatar src={c.user?.avatar || ''} sx={{ bgcolor: '#FF6B6B', width: 40, height: 40 }}>
                  <User size={18} />
                </Avatar>
                <Box>
                  <Typography fontWeight="bold">{c.user?.username || c.user?.name || 'User'}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{moment(c.createdAt).fromNow()}</Typography>
                  <Typography variant="body1">{c.text}</Typography>
                </Box>
              </Stack>
            ))
          )}
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, p: 2 }}>
          {token ? (
            <Stack direction="row" spacing={2} alignItems="center" width="100%">
              <TextField
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                fullWidth
                size="small"
                disabled={posting}
                onKeyDown={e => { if (e.key === 'Enter') handlePostComment(); }}
              />
              <Button onClick={handlePostComment} disabled={posting || !newComment.trim()} variant="contained">Post</Button>
            </Stack>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', width: '100%' }}>Login to comment.</Typography>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoPlayerScroller; 