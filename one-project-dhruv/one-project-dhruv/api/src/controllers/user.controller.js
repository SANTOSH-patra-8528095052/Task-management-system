import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { Assignment } from "../models/Assignment.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import ProjectSubmission from "../models/projectSubmission.model.js";
import { uploadMultipleFiles } from "../utils/cloudinary.js";

const salt = bcrypt.genSaltSync(10);
const secret = "jn4k5n6n5nnn6oi4n";



const registerUser = asyncHandler(async (req, res) => {
  // console.log(req.body);

  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    return res.json(userDoc);
  } catch (error) {
    return res.status(400).json(error);
  }
});

const header = asyncHandler(async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    return res.json(info);
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json("User not found");
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      // User is authenticated, generate JWT
      jwt.sign({ username, id: userDoc._id }, secret, (err, token) => {
        if (err) throw err;

        // Set token in a secure, HTTP-only cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // Always false (cookies will be sent even in non-HTTPS requests)
        });

        return res.json({
          id: userDoc._id,
          username,
        });
      });
    } else {
      return res.status(400).json("Wrong credentials");
    }
  } catch (error){
    return res.status(500).json(error);
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    // Clear the token cookie
    return res
      .cookie("token", "", {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .json({ message: "Successfully logged out" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
});

const postAssignment = asyncHandler(async (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { title, description, dueDate, aura_point } = req.body;

    try {
      // Fetch the user by ID and check their role
      const user = await User.findById(info.id);
      if (!user || user.role !== "teacher") {
        return res
          .status(403)
          .json({ message: "Only teachers can create assignments." });
      }

      // Create the assignment
      const assignmentDoc = await Assignment.create({
        title,
        description,
        dueDate,
        aura_point,
        author: info.id,
      });

      // Push the assignment ID into the teacher's createdAssignments
      user.createdAssignments.push(assignmentDoc._id);
      await user.save();

      res.status(201).json(assignmentDoc);
    } catch (error) {
      res.status(500).json({ message: "Failed to create assignment", error });
    }
  });
});

const getAssignment = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(10);
  return res.json(assignments);
});

const getAssignmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const assignmentDoc = await Assignment.findById(id).populate("author", [
    "username",
  ]);
  res.json(assignmentDoc);
});

const editAssignment = asyncHandler(async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, description, dueDate, aura_point } = req.body;
    const assignmentDoc = await Assignment.findById(id);
    const isAuthor =
      JSON.stringify(assignmentDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    await assignmentDoc.updateOne({ title, description, dueDate, aura_point });

    res.json(assignmentDoc);
  });
});

// GET /api/user/profile
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using authentication middleware
    
    const user = await User.findById(userId)
      .select("-password") // Exclude password field
      .populate([
        { path: "Assignments", select: "title" },
        { path: "completedAssignments", select: "title" },
        { path: "createdAssignments", select: "title" },
        { path: "createdProjects", select: "title" },
        { path: "submittedProjects", select: "title" },
      ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(user);
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/user/update
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using authentication middleware
    const { username, password, role, semester, section, branch } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, password, role, semester, section, branch },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/assignments/created
const getCreatedAssignments = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using authentication middleware
    const assignments = await Assignment.find({ author: userId });

    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching created assignments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/assignments/completed
const getCompletedAssignments = async (req, res) => {
  try {
    const userId = req.user.id; // Current student's ID

    // Fetch completed assignments by their IDs
    const completedAssignments = await Assignment.find({
      _id: { $in: req.user.completedAssignments },
    });

    res.status(200).json(completedAssignments);
  } catch (error) {
    console.error("Error fetching completed assignments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/assignments/uncompleted
const getUncompletedAssignments = async (req, res) => {
  try {
    const userId = req.user.id; // Current student's ID
    const { section, branch, completedAssignments } = req.user;

    // Fetch teachers from the same section and branch
    const teachers = await User.find({
      role: "teacher",
      section: section,
      branch: branch,
    });

    const teacherIds = teachers.map((teacher) => teacher._id);

    // Fetch assignments created by these teachers that are not completed by the student
    const uncompletedAssignments = await Assignment.find({
      author: { $in: teacherIds },
      _id: { $nin: completedAssignments },
    });

    res.status(200).json(uncompletedAssignments);
  } catch (error) {
    console.error("Error fetching uncompleted assignments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//updating the assignment to complete
const updateCompletedAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    const userId = req.user.id; // Assuming you have middleware that adds the user's ID to `req.user`

    // Validate input
    if (!assignmentId) {
      return res.status(400).json({ error: "Assignment ID is required" });
    }

    // Find the assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Ensure the user is a student
    const user = await User.findById(userId);
    if (!user || user.role !== "student") {
      return res
        .status(403)
        .json({
          error: "Unauthorized: Only students can complete assignments",
        });
    }

    // Check if the assignment is already marked as complete
    if (user.completedAssignments.includes(assignmentId)) {
      return res
        .status(400)
        .json({ error: "Assignment already marked as completed" });
    }

    // Add assignment to completedAssignments and update aura points
    user.completedAssignments.push(assignmentId);
    user.aura_points += assignment.aura_point;

    // Mark the assignment as complete
    assignment.complete = true;

    await user.save();
    await assignment.save();

    return res
      .status(200)
      .json({
        message: "Assignment marked as completed",
        aura_points: user.aura_points,
      });
  } catch (error) {
    console.error("Error updating completed assignment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    console.log("Files in req.files:", req.files);

    // Separate student files and teacher files
    const studentFilesPaths =
      req.files?.studentFiles?.map((file) => file.path) || [];
    const teacherFilesPaths =
      req.files?.teacherFiles?.map((file) => file.path) || [];

    // Upload student files to Cloudinary
    const studentFiles = await uploadMultipleFiles(studentFilesPaths);

    // Upload teacher files to Cloudinary
    const teacherFiles = await uploadMultipleFiles(teacherFilesPaths);

    // Map uploaded files to the schema
    const formattedStudentFiles = studentFiles.map((file) => ({
      url: file.secure_url,
      fileType:
        file.format === "application/pdf"
          ? "pdf"
          : file.format.includes("doc")
            ? "docx"
            : file.format.includes("zip")
              ? "zip"
              : "other", // Map format to enum values
    }));

    const formattedTeacherFiles = teacherFiles.map((file) => ({
      url: file.secure_url,
      fileType:
        file.format === "application/pdf"
          ? "pdf"
          : file.format.includes("doc")
            ? "docx"
            : file.format.includes("zip")
              ? "zip"
              : "other", // Map format to enum values
    }));

    const newProject = new ProjectSubmission({
      title,
      description,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [], // Default to empty array
      files:
        formattedStudentFiles.length > 0 ? formattedStudentFiles : undefined,
      teacherFiles:
        formattedTeacherFiles.length > 0 ? formattedTeacherFiles : undefined,
      submitter: req.user._id, // Ensure req.user contains the authenticated user
    });

    await newProject.save();
    return res
      .status(201)
      .json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ message: "Error creating project", error });
  }
};

const getTeacherCreatedProjects = async (req, res) => {
  try {
    const teacherId = req.user.id; // Assuming `req.user` is populated by your authentication middleware

    // Find projects where `submitter` matches the teacher's ID
    const projects = await ProjectSubmission.find({ submitter: teacherId });

    return res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error fetching teacher-created projects:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects. Please try again later.",
    });
  }
};

// GET /api/projects/completed
const getCompletedProjects = async (req, res) => {
  try {
    const userId = req.user.id; // Current student's ID

    // Find the user and populate the submittedProjects field
    const user = await User.findById(userId).populate("submittedProjects");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const completedProjects = user.submittedProjects;

    res.status(200).json({
      success: true,
      completedProjects,
    });
  } catch (error) {
    console.error("Error fetching completed projects:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/projects/uncompleted
const getUncompletedProjects = async (req, res) => {
  try {
    const userId = req.user.id; // Current student's ID
    const { section, branch, submittedProjects } = req.user;

    // Fetch teachers from the same section and branch
    const teachers = await User.find({
      role: "teacher",
      section: section,
      branch: branch,
    });

    const teacherIds = teachers.map((teacher) => teacher._id);

    // Fetch projects created by these teachers that are not submitted by the student
    const uncompletedProjects = await ProjectSubmission.find({
      submitter: { $in: teacherIds },
      _id: { $nin: submittedProjects },
    });
    // if(uncompletedProjects) console.log(uncompletedProjects);
    

    res.status(200).json({
      success: true,
      uncompletedProjects,
    });
  } catch (error) {
    console.error("Error fetching uncompleted projects:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await ProjectSubmission.findById(projectId).populate("submitter", "username");
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
import path from "path";
import { log } from "console";

// Controller to handle file upload, update the project, and add to user's submittedProjects
 const uploadAndSubmitProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.user.id; // Assumes authentication middleware sets req.user
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }
    
    // Construct file URL (assuming you serve static files from "./public")
    const fileUrl = `/temp/${req.file.filename}`;
    const fileType = path.extname(req.file.originalname).substring(1).toLowerCase();
    
    // Find the project by its ID and update it with the new file
    const project = await ProjectSubmission.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }
    
    project.files.push({ url: fileUrl, fileType });
    // project.status = "submitted"; // Update status as needed
    await project.save();
    
    // Find the user and add this project ID to their submittedProjects (if not already added)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    
    if (!user.submittedProjects.includes(project._id)) {
      user.submittedProjects.push(project._id);
      await user.save();
    }
    
    res.status(200).json({
      success: true,
      message: "Project updated and submitted successfully.",
      project,
    });
  } catch (error) {
    console.error("Error in uploadAndSubmitProject:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

 const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({ role: "student" })
      .sort({ aura_points: -1 }) // Sort by aura_points in descending order
      .select("username aura_points avatar") // Select relevant fields
      .limit(10); // Limit to top 10

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard", error });
  }
};

export {
  getLeaderboard,
  uploadAndSubmitProject,
  getProjectById,
  getUncompletedProjects,
  getCompletedProjects,
  getTeacherCreatedProjects,
  createProject,
  updateCompletedAssignment,
  getUserProfile,
  getCompletedAssignments,
  getCreatedAssignments,
  updateUserProfile,
  getUncompletedAssignments,
  registerUser,
  loginUser,
  logoutUser,
  getAssignment,
  getAssignmentById,
  postAssignment,
  header,
  editAssignment,
};
