// import { asyncHandler } from "../utils/asyncHandler.js";
import { Challenge } from "../models/Challenge.model.js";

import { User } from "../models/User.model.js";

// Create a new challenge (teacher only)
const createChallenge = async (req, res) => {
  try {
    console.log(req.user);
    
    // Assume req.user is set by authentication middleware and is a teacher
    const { title, chapters, rewardAura, rewardCredit } = req.body;
    console.log("completed till here");
    
    const newChallenge = new Challenge({
      title,
      chapters,
      rewardAura,
      rewardCredit,
      submitter: req.user._id
    });
    console.log("new challenge creating");
    await newChallenge.save();
    console.log("successful");

    res.status(201).json({ message: "Challenge created successfully", challenge: newChallenge });
  } catch (error) {
    res.status(500).json({ message: "Failed to create challenge", error: error.message });
  }
};

// Get all challenges (accessible to both teachers and students)
const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().populate("submitter", "username");
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch challenges", error: error.message });
  }
};

// Get a challenge by ID
const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate("submitter", "username");
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch challenge", error: error.message });
  }
};

// Student submission to a challenge
const submitChallenge = async (req, res) => {
  try {
    // req.body.answers should mirror the chapters and questions structure
    // For simplicity, we expect an array of chapters where each chapter contains an array of answers.
    const { answers } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    // Validate student's answers
    let allCorrect = true;
    challenge.chapters.forEach((chapter, chapIndex) => {
      // For each question in the chapter
      chapter.questions.forEach((question, quesIndex) => {
        if (!answers[chapIndex] || answers[chapIndex][quesIndex] !== question.answer) {
          allCorrect = false;
        }
      });
    });

    if (!allCorrect) {
      return res.status(400).json({ message: "Some answers are incorrect. Please try again." });
    }

    // If correct, add challenge to user's challenges if not already present
    const user = await User.findById(req.user._id);
    if (!user.challenges.includes(challenge._id)) {
      user.challenges.push(challenge._id);
      // Optionally update user's reward points
      user.aura_points += challenge.rewardAura;
      user.credit_points += challenge.rewardCredit;
      await user.save();
    }
    res.json({ message: "Challenge completed and added to your record!", challengeId: challenge._id });
  } catch (error) {
    res.status(500).json({ message: "Submission failed", error: error.message });
  }
};


// controllers/challengeController.js
const getTeacherChallenges = async (req, res) => {
  try {
    console.log("Inside getTeacherChallenges");

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied. Only teachers can access this." });
    }

    const challenges = await Challenge.find({ submitter: req.user._id })
      .populate("submitter", "username");

    res.json(challenges);
  } catch (error) {
    console.error("Error in getTeacherChallenges:", error);
    res.status(500).json({ message: "Failed to fetch teacher challenges", error: error.message });
  }
};




const getStudentChallenges = async (req, res) => {
  try {
    // Ensure the user is authenticated and is a student
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied." });
    }

    // Find the current user and get their completed challenge IDs
    const user = await User.findById(req.user._id).lean();
    const completedChallengeIds = user.challenges.map(chId => chId.toString());

    // Fetch all challenges (you might filter by other criteria in a real app)
    const allChallenges = await Challenge.find().populate("submitter", "username");

    // Separate into completed and uncompleted lists
    const completed = allChallenges.filter(challenge =>
      completedChallengeIds.includes(challenge._id.toString())
    );
    const uncompleted = allChallenges.filter(challenge =>
      !completedChallengeIds.includes(challenge._id.toString())
    );

    res.json({ completed, uncompleted });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch student challenges", error: error.message });
  }
};




export {
  getTeacherChallenges,
  getStudentChallenges,
  getAllChallenges,
  createChallenge,
  getChallengeById,
  submitChallenge,
};
