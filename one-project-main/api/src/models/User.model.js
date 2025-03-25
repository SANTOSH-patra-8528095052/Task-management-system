import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    aura_points: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "teacher"], // Ensure valid roles
      default: "student",
    },
    section:{
      type:String,
    },
    semester:{
      type:String,
    },
    Achievements:{
      type:String,
      enum:["Task Initiator","On the Move","Punctual performer","Task Master","Rising Star","Master Coordinator","Efficiency Guru"]
    },
    branch:{
      type:String,
      enum:["CSE","ECE","CHEM_ENG","PIE","ME","CE","EE","IT","None"],
      default:"None"
    },
    Assignments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
      },
    ],
    // Teacher-specific fields
    createdAssignments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assignment", // Assignments created by a teacher
      },
    ],
    // Student-specific fields
    completedAssignments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Assignment", // Assignments completed by a student
      },
    ],
  },
  { timestamps: true }
);

// Ensure default empty arrays for relevant fields
userSchema.path("Assignments").default(() => []);
userSchema.path("createdAssignments").default(() => []);
userSchema.path("completedAssignments").default(() => []);

export const User = mongoose.model("User", userSchema);
