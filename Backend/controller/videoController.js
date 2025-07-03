const Video = require('../models/Video');
const Comment = require('../models/Comment');
const User = require('../models/User');

// POST /api/videos/upload
exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, category, tags, privacy, monetization, ageRestriction } = req.body;
    if (!req.files || !req.files.video) {
      return res.status(400).json({ message: 'Video file is required.' });
    }
    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;
    const videoUrl = `/uploads/${videoFile.filename}`;
    const thumbnailUrl = thumbnailFile ? `/uploads/${thumbnailFile.filename}` : '';
    const video = new Video({
      title,
      description,
      category,
      tags: tags ? JSON.parse(tags) : [],
      privacy,
      monetization: monetization === 'true',
      ageRestriction: ageRestriction === 'true',
      videoUrl,
      thumbnailUrl,
      // uploader: req.user.id // (if using auth)
    });
    await video.save();
    res.status(201).json({ message: 'Video uploaded!', video });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/videos
exports.getAllVideos = async (req, res) => {
  try {
    const filter = {};
    if (req.query.uploader) {
      filter.uploader = req.query.uploader;
    }
    const skip = parseInt(req.query.skip) || 0;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const videos = await Video.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/videos/:id
exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found.' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/videos/:id/like
exports.likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found.' });
    if (!video.likes.includes(req.user.id)) {
      video.likes.push(req.user.id);
      await video.save();
    }
    res.json({ likes: video.likes.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/videos/:id/unlike
exports.unlikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found.' });
    video.likes = video.likes.filter(uid => uid.toString() !== req.user.id);
    await video.save();
    res.json({ likes: video.likes.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/videos/:id/bookmark
exports.bookmarkVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found.' });
    if (!video.bookmarks.includes(req.user.id)) {
      video.bookmarks.push(req.user.id);
      await video.save();
    }
    res.json({ bookmarks: video.bookmarks.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/videos/:id/unbookmark
exports.unbookmarkVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found.' });
    video.bookmarks = video.bookmarks.filter(uid => uid.toString() !== req.user.id);
    await video.save();
    res.json({ bookmarks: video.bookmarks.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all comments for a video
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.id })
      .populate('user', 'username avatar name')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

// Add a comment to a video
exports.addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text required' });
    const comment = await Comment.create({
      video: req.params.id,
      user: userId,
      text
    });
    await comment.populate('user', 'username avatar name');
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

// Delete a video
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this video' });
    }
    await video.deleteOne();
    res.json({ message: 'Video deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete video' });
  }
}; 