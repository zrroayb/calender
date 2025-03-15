import mongoose from 'mongoose';

const MemorySchema = new mongoose.Schema({
  id: String,
  date: String,
  imageUrl: String,
  caption: String,
  author: {
    type: String,
    enum: ['Ayberk', 'Selvi'],
  },
  comments: [{
    id: String,
    text: String,
    author: {
      type: String,
      enum: ['Ayberk', 'Selvi'],
    },
    createdAt: String,
  }],
}, {
  timestamps: true,
});

export const Memory = mongoose.models.Memory || mongoose.model('Memory', MemorySchema); 