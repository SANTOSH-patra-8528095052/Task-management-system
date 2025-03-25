import mongoose from "mongoose";

const { Schema } = mongoose;

const questionSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    enum: ['Yes', 'No'],
    required: true
  }
});

const chapterSchema = new Schema({
  description: {
    type: String,
    required: true,
    maxlength: 400 // 400 characters limit
  },
  questions: [questionSchema]
});

const challengeSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  chapters: [chapterSchema],
  rewardAura: {
    type: Number,
    required: true,
    min: 0 // Ensure non-negative values
  },
  rewardCredit: {
    type: Number,
    required: true,
    min: 0 // Ensure non-negative values
  },
  submitter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User schema
    required: true
  }
}, { timestamps: true });

export const Challenge = mongoose.model('Challenge', challengeSchema);

