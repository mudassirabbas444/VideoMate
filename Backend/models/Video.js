const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  tags: [{ type: String }],
  thumbnailUrl: { type: String },
  videoUrl: { type: String, required: true },
  privacy: { type: String, enum: ['public', 'unlisted', 'private'], default: 'public' },
  monetization: { type: Boolean, default: false },
  ageRestriction: { type: Boolean, default: false },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

videoSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'video',
  count: true
});

module.exports = mongoose.model('Video', videoSchema); 