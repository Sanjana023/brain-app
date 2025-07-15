import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const TagModel = mongoose.model('Tag', tagSchema);
