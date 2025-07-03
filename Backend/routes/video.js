const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const videoController = require('../controller/videoController');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

router.post('/upload', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), videoController.uploadVideo);

router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideo);

router.post('/:id/like', auth, videoController.likeVideo);
router.post('/:id/unlike', auth, videoController.unlikeVideo);
router.post('/:id/bookmark', auth, videoController.bookmarkVideo);
router.post('/:id/unbookmark', auth, videoController.unbookmarkVideo);

router.get('/:id/comments', videoController.getComments);
router.post('/:id/comments', auth, videoController.addComment);

router.delete('/:id', auth, videoController.deleteVideo);

module.exports = router; 