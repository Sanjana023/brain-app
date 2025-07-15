import mongoose, { model } from 'mongoose';

const contentSchema = new mongoose.Schema({
  link: { type: String, required: true },

  contentType: { type: String, enum: ['pdf', 'link'], required: true },

  title: { type: String, required: true , trim:true},

  tags:  [{type:mongoose.Types.ObjectId , ref:'Tag'}],

  userId: { type: mongoose.Types.ObjectId, ref: 'user', required: true },

  fileName: { type: String },//only for pdfs

  fileSize: { type: Number },//only for pdfs

  uploadedAt: { type: Date, default: Date.now },
});

export const contentModel = model("Content",contentSchema);
