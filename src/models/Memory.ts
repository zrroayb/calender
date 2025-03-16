import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  id: String,
  text: String,
  author: {
    type: String,
    enum: ['Ayberk', 'Selvi'],
    required: true
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  }
});

const MemorySchema = new mongoose.Schema({
  id: String,
  date: String,
  imageUrl: String,
  caption: String,
  author: {
    type: String,
    enum: ['Ayberk', 'Selvi'],
    required: true
  },
  comments: {
    type: [CommentSchema],
    default: []
  }
}, {
  timestamps: true,
});

export const Memory = mongoose.models.Memory || mongoose.model('Memory', MemorySchema); 