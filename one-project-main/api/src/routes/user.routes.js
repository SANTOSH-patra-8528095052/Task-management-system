import { Router } from "express";
import multer from 'multer'
import { editAssignment, getAssignment, getAssignmentById, header, loginUser,logoutUser, postAssignment, registerUser } from "../controllers/user.controller.js";

import express from "express";
import {
  getUserProfile,
  updateCompletedAssignment,
  updateUserProfile,
  getCreatedAssignments,
  getCompletedAssignments,
  getUncompletedAssignments,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();
const upload=multer()

router.route("/profile").get( isAuthenticated, getUserProfile);
router.route("/update").put( isAuthenticated, updateUserProfile);

// Assignment-related endpoints
router.route("/assignments/created").get( isAuthenticated, getCreatedAssignments);
router.route("/assignments/completed").get( isAuthenticated, getCompletedAssignments);
router.route("/assignments/uncompleted").get( isAuthenticated, getUncompletedAssignments);
router.put("/assignments/update-completed", isAuthenticated, updateCompletedAssignment);


router.route("/register").post(registerUser)
router.route("/header").get(isAuthenticated,header)
router.route("/login").post(loginUser)
router.route("/logout").post(isAuthenticated,logoutUser)
router.route("/assignment").post(upload.none(), postAssignment)
router.route("/assignment").get(getAssignment)
router.route("/assignment/:id").get(getAssignmentById)
router.route("/assignment").put(upload.none(), editAssignment)

// router.route("/")
// router.route("/")

export default router;