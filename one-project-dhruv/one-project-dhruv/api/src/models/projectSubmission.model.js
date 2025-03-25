import mongoose from 'mongoose';

const projectSubmissionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    submitter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model for authentication
      required: [true, 'Submitter is required'],
    },
    files: [
      {
        url: {
          type: String,
          required: [true, 'File URL is required'],
        },
        fileType: {
          type: String,
          enum: ['pdf', 'doc', 'docx', 'zip', 'other'],
          default: 'other',
        },
      },
    ],
    teacherFiles: [
      {
        url: {
          type: String,
          required: [true, 'File URL is required'],
        },
        fileType: {
          type: String,
          enum: ['pdf', 'doc', 'docx', 'zip', 'other'],
          default: 'other',
        },
      },
    ],
    tags: {
      type: [String], // Optional tags for categorization
      default: [],
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'resubmission'],
      default: 'pending',
    },
    feedback: {
      type: String, // Admin feedback or comments
      maxlength: [300, 'Feedback cannot exceed 300 characters'],
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const ProjectSubmission = mongoose.model('ProjectSubmission', projectSubmissionSchema);

export default ProjectSubmission;
