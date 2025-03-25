import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { Assignment } from "../models/Assignment.model.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import cookieParser from 'cookie-parser'



const salt = bcrypt.genSaltSync(10);
const secret = "jn4k5n6n5nnn6oi4n";



const registerUser= asyncHandler( async (req,res) =>{
    console.log(req.body);
        
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
})

const header=asyncHandler( async (req,res) =>{
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        return res.json(info);
    });
})

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
      jwt.sign(
        { username, id: userDoc._id },
        secret,
        (err, token) => {
          if (err) throw err;

          // Set token in a secure, HTTP-only cookie
          res.cookie("token", token, {
            httpOnly: true,
            secure: false,  // Always false (cookies will be sent even in non-HTTPS requests)
          });

          return res.json({
            id: userDoc._id,
            username,
          });
        }
      );
    } else {
      return res.status(400).json("Wrong credentials");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});


const logoutUser = asyncHandler(async (req, res) => {
  try {
    // Clear the token cookie
    return res.cookie("token", "", {
      httpOnly: true,
      secure: true
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
          return res.status(403).json({ message: "Only teachers can create assignments." });
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



const getAssignment= asyncHandler( async (req, res) =>{
      
      const assignments = await Assignment.find()
      .populate("author",['username'])
      .sort({ createdAt: -1 })
      .limit(10);
    return res.json(assignments);
})

const getAssignmentById= asyncHandler( async (req,res) =>{
    const {id} = req.params;
    const assignmentDoc = await Assignment.findById(id).populate('author',['username'])
    res.json(assignmentDoc)
})

const editAssignment = asyncHandler( async (req,res) =>{
    const { token } = req.cookies;
      jwt.verify(token, secret, {}, async (err, info) => {
          if (err) throw err;
          const {id, title, description,dueDate,aura_point} = req.body
          const assignmentDoc = await Assignment.findById(id);
          const isAuthor= JSON.stringify(assignmentDoc.author)===JSON.stringify(info.id)
          if( !isAuthor ){
              return res.status(400).json('you are not the author');
          }
    
          await assignmentDoc.updateOne({title, description,dueDate,aura_point})
    
          res.json(assignmentDoc);
       });
})


// GET /api/user/profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using authentication middleware
    const user = await User.findById(userId).populate([
      { path: "Assignments", select: "title" },
      { path: "completedAssignments", select: "title" },
      { path: "createdAssignments", select: "title" },
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.Assignments = user.Assignments || [];
    user.completedAssignments = user.completedAssignments || [];
    user.createdAssignments = user.createdAssignments || [];

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/user/update
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using authentication middleware
    const { username, password, role, semester, section,branch } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, password, role, semester, section, branch },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/assignments/created
const getCreatedAssignments = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using authentication middleware
    const assignments = await Assignment.find({ createdBy: userId });

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
      return res.status(403).json({ error: "Unauthorized: Only students can complete assignments" });
    }

    // Check if the assignment is already marked as complete
    if (user.completedAssignments.includes(assignmentId)) {
      return res.status(400).json({ error: "Assignment already marked as completed" });
    }

    // Add assignment to completedAssignments and update aura points
    user.completedAssignments.push(assignmentId);
    user.aura_points += assignment.aura_point;

    // Mark the assignment as complete
    assignment.complete = true;

    await user.save();
    await assignment.save();

    return res.status(200).json({ message: "Assignment marked as completed", aura_points: user.aura_points });
  } catch (error) {
    console.error("Error updating completed assignment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateAchievements = asyncHandler( async (req,res)=>{
  const {aura_point} = req.body();
});

export {updateCompletedAssignment, getUserProfile,getCompletedAssignments,getCreatedAssignments,updateUserProfile,getUncompletedAssignments,registerUser, loginUser, logoutUser, getAssignment, getAssignmentById, postAssignment, header, editAssignment}
